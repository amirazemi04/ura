import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import client from '../contentfulClient';
import Gallery from '../components/Gallery';

interface NewsItem {
  id: string;
  title: string;
  image: string;
  description: string;
  author: string;
  date: string;
}

const DEFAULT_LOCALE = 'de';

const GalleryPage = () => {
  const { i18n } = useTranslation();
  const itemsPerPage = 6;
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reservationRef = useRef<HTMLDivElement | null>(null);
  const hasChangedPageRef = useRef(false);

  const totalPages = Math.ceil(newsItems.length / itemsPerPage);
  const currentNews = newsItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const currentLocale = i18n.language || DEFAULT_LOCALE;

        // Fetch entries in current locale for text fields
        const response = await client.getEntries({
          content_type: 'ura',
          locale: currentLocale,
        });

        const items = await Promise.all(
          response.items.map(async (item: any) => {
            let imageUrl = '';
            const imageRef = item.fields.image?.sys?.id;

            if (imageRef) {
              try {
                // Fetch image asset in default locale (DE)
                const asset = await client.getAsset(imageRef, { locale: DEFAULT_LOCALE });
                imageUrl = asset?.fields?.file?.url ? `https:${asset.fields.file.url}` : '';
              } catch (assetError) {
                console.error('Failed to fetch image asset:', assetError);
              }
            }

            return {
              id: item.sys.id,
              title: item.fields.title || 'No title',
              image: imageUrl,
              description: item.fields.description || '',
              author: item.fields.author || 'Unknown',
              date: new Date(item.sys.createdAt).toLocaleDateString(
                currentLocale === 'sq' ? 'sq-AL' : 'de-DE',
                { year: 'numeric', month: 'long', day: 'numeric' }
              ),
            };
          })
        );

        setNewsItems(items);
      } catch (error) {
        console.error('Error fetching data from Contentful:', error);
        setNewsItems([]);
      }
    };

    fetchNews();
  }, [i18n.language]);

  useEffect(() => {
    if (hasChangedPageRef.current && reservationRef.current) {
      reservationRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    hasChangedPageRef.current = false;
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      hasChangedPageRef.current = true;
      setCurrentPage(page);
    }
  };

  return (
    <div className="pt-6 sm:pt-8">
      <Gallery />

      <div
        className="container mx-auto px-4 sm:px-6 mt-12 sm:mt-16 mb-20 sm:mb-24 space-y-12 sm:space-y-16 scroll-mt-48"
        ref={reservationRef}
      >
        {newsItems.length === 0 ? (
          <div className="text-center text-gray-500">
            {i18n.language === 'sq' ? 'Asnjë lajm i disponueshëm' : 'Keine Nachrichten verfügbar'}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {currentNews.map((news) => (
              <Link
                key={news.id}
                to={`/news/${news.id}`}
                className="flex flex-col justify-between transition-transform duration-300 hover:scale-[1.02] h-auto min-h-[550px] sm:min-h-[600px]"
              >
                <div>
                  <div className="h-[250px] sm:h-[300px] overflow-hidden">
                    {news.image ? (
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <p>
                          {i18n.language === 'sq' ? 'Asnjë imazh i disponueshëm' : 'Kein Bild verfügbar'}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="bg-[#a51e28] text-white px-4 sm:px-7 py-4">
                    <h3 className="text-base sm:text-lg font-semibold">{news.title}</h3>
                  </div>
                </div>
                <div className="px-2 sm:px-5">
                  <p className="text-gray-500 leading-relaxed text-sm">{news.description}</p>
                </div>
                <hr className="border-t border-black mx-4 sm:mx-7 my-1" />
                <div className="flex justify-between items-center text-xs italic text-black px-4 sm:px-7 pb-2">
                  <p>by {news.author}</p>
                  <p>{news.date}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 sm:mt-20">
            <div className="flex items-center space-x-6 sm:space-x-14 text-black">
              {/* Previous */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center rounded-full border-2 border-gray-500 hover:bg-black hover:text-white transition duration-300 disabled:opacity-40"
                aria-label={i18n.language === 'sq' ? 'Faqja e mëparshme' : 'Vorherige Seite'}
              >
                ←
              </button>

              {/* Page numbers */}
              <div className="flex space-x-4 sm:space-x-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`text-lg sm:text-2xl font-semibold ${
                      currentPage === page
                        ? 'text-black underline underline-offset-4'
                        : 'text-gray-600 hover:text-black hover:underline hover:underline-offset-4'
                    } transition duration-200`}
                    aria-label={i18n.language === 'sq' ? `Faqja ${page}` : `Seite ${page}`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center rounded-full border-2 border-gray-500 hover:bg-black hover:text-white transition duration-300 disabled:opacity-40"
                aria-label={i18n.language === 'sq' ? 'Faqja tjetër' : 'Nächste Seite'}
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;