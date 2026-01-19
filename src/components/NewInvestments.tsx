import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Reveal from './Reveal';
import { safeGetEntries, safeGetAssetFromReference, safeGetField, normalizeLocale } from '../utils/contentfulHelpers';

interface NewsItem {
  id: string;
  title: string;
  image: string;
  description: string;
  author: string;
  date: string;
}

const NewInvestments = () => {
  const { i18n } = useTranslation();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [leftImage, setLeftImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const currentLocale = normalizeLocale(i18n.language);

        const staticImageEntries = await safeGetEntries('imazhetEwebit', 'de', { limit: 1 });

        if (staticImageEntries.length > 0) {
          const fields = staticImageEntries[0].fields || {};
          const imgAsset = fields.imazhiBallines;
          const imgUrl = imgAsset?.fields?.file?.url;
          if (imgUrl) {
            setLeftImage(`https:${imgUrl}`);
          }
        }

        const entries = await safeGetEntries('ura', currentLocale, {
          order: ['-sys.createdAt'],
          limit: 1,
        });

        if (!entries.length) {
          setNewsItem(null);
          return;
        }

        const entry = entries[0];
        const fields = entry.fields || {};
        const imageUrl = await safeGetAssetFromReference(fields.image);

        setNewsItem({
          id: entry.sys.id,
          title: safeGetField(fields, 'title', 'No title'),
          description: safeGetField(fields, 'description', ''),
          author: safeGetField(fields, 'author', 'Unknown'),
          image: imageUrl,
          date: new Date(entry.sys.createdAt).toLocaleDateString(
            currentLocale === 'sq' ? 'sq-AL' : 'de-DE',
            { year: 'numeric', month: 'long', day: 'numeric' }
          ),
        });
      } catch (error) {
        console.error('Error while fetching data:', error);
        setNewsItem(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language]);

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
