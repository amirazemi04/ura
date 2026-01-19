import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import client from '../contentfulClient';
import Reveal from './Reveal';

interface NewsItem {
  id: string;
  title: string;
  image: string;
  description: string;
  author: string;
  date: string;
}

const DEFAULT_LOCALE = 'de';

const NewInvestments = () => {
  const { i18n } = useTranslation();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [leftImage, setLeftImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!i18n.isInitialized) return; // ✅ Prevent early run before i18n is ready

    const fetchData = async () => {
      setLoading(true);
      const currentLocale = i18n.language?.substring(0, 2) || DEFAULT_LOCALE;

      try {
        // ✅ Fetch static image (always from default locale)
        const staticImageEntries = await client.getEntries({
          content_type: 'imazhetEwebit',
          limit: 1,
          locale: DEFAULT_LOCALE,
        });

        if (staticImageEntries.items.length > 0) {
          const imgAsset = staticImageEntries.items[0].fields.imazhiBallines;
          const imgUrl = imgAsset?.fields?.file?.url;
          if (imgUrl) {
            setLeftImage(`https:${imgUrl}`);
          }
        }

        // ✅ Fetch localized news entry
        let entries = await client.getEntries({
          content_type: 'ura',
          order: '-sys.createdAt',
          limit: 1,
          locale: currentLocale,
        });

        // ✅ Fallback to default locale if nothing found
        if (!entries.items.length && currentLocale !== DEFAULT_LOCALE) {
          entries = await client.getEntries({
            content_type: 'ura',
            order: '-sys.createdAt',
            limit: 1,
            locale: DEFAULT_LOCALE,
          });
        }

        if (!entries.items.length) {
          setNewsItem(null);
          return;
        }

        const entry = entries.items[0];
        const fields = entry.fields;

        // ✅ Always fetch image using DEFAULT_LOCALE (since your images are not localized)
        let imageUrl = '';
        const imageRef = fields.image?.sys?.id;
        if (imageRef) {
          try {
            const asset = await client.getAsset(imageRef, { locale: DEFAULT_LOCALE });
            imageUrl = asset?.fields?.file?.url ? `https:${asset.fields.file.url}` : '';
          } catch (assetError) {
            console.error('Failed to fetch asset:', assetError);
          }
        }

        setNewsItem({
          id: entry.sys.id,
          title: fields.title || 'No title',
          description: fields.description || '',
          author: fields.author || 'Unknown',
          image: imageUrl,
          date: new Date(entry.sys.createdAt).toLocaleDateString(
            currentLocale === 'sq' ? 'sq-AL' : 'de-DE',
            { year: 'numeric', month: 'long', day: 'numeric' }
          ),
        });
      } catch (error) {
        console.error('Error while fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language, i18n.isInitialized]);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-100">
        <p>{i18n.language === 'sq' ? 'Duke u ngarkuar...' : 'Laden...'}</p>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-100">
        <p>{i18n.language === 'sq' ? 'Asnjë lajm i gjetur.' : 'Keine Nachrichten gefunden.'}</p>
      </div>
    );
  }

  return (
    <section className="px-6 py-12 bg-white">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10">
        {/* Left Column: static image */}
        <Reveal>
          <div className="h-[550px] w-full overflow-hidden shadow-xl">
            {leftImage ? (
              <img
                src={leftImage}
                alt="Imazhi Ballines"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p>{i18n.language === 'sq' ? 'Imazhi mungon' : 'Bild fehlt'}</p>
              </div>
            )}
          </div>
        </Reveal>

        {/* Right Column: news */}
        <Reveal delay={0.2}>
          <Link
            to={`/news/${newsItem.id}`}
            className="flex flex-col justify-between transition-transform duration-300 hover:scale-[1.02] h-[550px]"
          >
            <div className="h-[400px] overflow-hidden shadow-xl">
              {newsItem.image ? (
                <img
                  src={newsItem.image}
                  alt={newsItem.title}
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

            <div className="bg-[#a51e28] text-white px-7 py-4 -mt-16">
              <h3 className="text-lg font-semibold">{newsItem.title}</h3>
            </div>

            <div className="mt-2 text-[#333333] leading-relaxed px-2 sm:px-5">
              <p className="text-sm">{newsItem.description}</p>
            </div>

            <hr className="border-t border-[#DDDDDD] my-2 mx-4 sm:mx-7" />

            <div className="flex justify-between items-center text-xs italic text-[#333333] px-4 sm:px-7">
              <p>by {newsItem.author}</p>
              <p>{newsItem.date}</p>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default NewInvestments;
