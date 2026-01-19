import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import client from '../contentfulClient';
import { Helmet } from 'react-helmet-async';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface NewsItem {
  title: string;
  longDescription: string;
  imageWithText: string;
  author: string;
  date: string;
  image: { fields: { file: { url: string } } } | null;
  thumbnail: { fields: { file: { url: string } } } | null;
  secondImage: { fields: { file: { url: string } } } | null;
}

const DEFAULT_LOCALE = 'de';

// Helper to optimize Contentful images
const getOptimizedImage = (url: string, width: number, format = 'webp', quality = 80) => {
  return `${url}?w=${width}&fm=${format}&q=${quality}`;
};

const NewsDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { i18n } = useTranslation();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!i18n.isInitialized) return;

    const fetchData = async () => {
      setLoading(true);
      const currentLocale = i18n.language || DEFAULT_LOCALE;

      try {
        let entry;
        try {
          entry = await client.getEntry(id!, { locale: currentLocale });
        } catch {
          entry = await client.getEntry(id!, { locale: DEFAULT_LOCALE });
        }

        if (!entry) {
          setNews(null);
          return;
        }

        const fields = entry.fields;

        const getAssetUrl = async (asset: any) => {
          if (!asset?.sys?.id) return '';
          try {
            const assetData = await client.getAsset(asset.sys.id, { locale: DEFAULT_LOCALE });
            return assetData?.fields?.file?.url ? `https:${assetData.fields.file.url}` : '';
          } catch (error) {
            console.error('Failed to fetch asset:', asset.sys.id, error);
            return '';
          }
        };

        const imageUrl = await getAssetUrl(fields.image);
        const thumbnailUrl = await getAssetUrl(fields.thumbnail);
        const secondImageUrl = await getAssetUrl(fields.secondImage);

        const formattedDate = new Date(entry.sys.createdAt).toLocaleDateString(
          currentLocale === 'sq' ? 'sq-AL' : 'de-DE',
          { year: 'numeric', month: 'long', day: 'numeric' }
        );

        setNews({
          title: fields.title || 'No title',
          longDescription: fields.longDescription || '',
          imageWithText: fields.imageWithText || '',
          author: fields.author || 'Unknown',
          date: formattedDate,
          image: imageUrl ? { fields: { file: { url: imageUrl } } } : null,
          thumbnail: thumbnailUrl ? { fields: { file: { url: thumbnailUrl } } } : null,
          secondImage: secondImageUrl ? { fields: { file: { url: secondImageUrl } } } : null,
        });
      } catch (error) {
        console.error('Error fetching news detail:', error);
        setNews(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, i18n.language, i18n.isInitialized]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!news)
    return (
      <div className="container mx-auto px-4 sm:px-6 mt-20 text-center">
        <h2 className="text-2xl font-bold text-[#a51e28]">
          {i18n.language === 'sq' ? 'Lajmi nuk u gjet' : 'Nachricht nicht gefunden'}
        </h2>
      </div>
    );

  const { title, image, longDescription, imageWithText, thumbnail, secondImage, author, date } = news;
  const metaDescription =
    longDescription.length > 160 ? longDescription.substring(0, 157) + '...' : longDescription;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pb-16">
      {/* SEO */}
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={metaDescription} />
        {image?.fields?.file?.url && (
          <meta property="og:image" content={getOptimizedImage(image.fields.file.url, 1200)} />
        )}
        <link rel="canonical" href={`https://ansambli-ura.ch/news/${id}`} />
      </Helmet>

      <div className="container mx-auto mt-16 sm:mt-24 px-4 sm:px-6">
        <nav className="text-sm text-gray-500 my-6 sm:my-12 text-center sm:text-left">
          <Link to="/" className="hover:underline text-gray-500 font-medium">
            {i18n.language === 'sq' ? 'Ballina' : 'Startseite'}
          </Link>
          <span className="mx-1 sm:mx-2">/</span>
          <span className="text-gray-700 font-semibold">{title}</span>
        </nav>

        <div className="h-[400px] sm:h-[500px] w-full overflow-hidden shadow-xl">
  {image?.fields?.file?.url ? (
    <img
      src={image.fields.file.url}
      alt={title}
      className="w-full h-full object-cover"
      loading="lazy" // optional for native lazy load
    />
  ) : (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <p>{i18n.language === 'sq' ? 'Asnjë imazh i disponueshëm' : 'Kein Bild verfügbar'}</p>
    </div>
  )}
        </div>

        <div className="bg-[#a51e28] text-white px-20 py-5 sm:-mt-3 shadow-md w-fit mx-auto sm:mx-0">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold">{title}</h3>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 mt-10 text-gray-500 text-base sm:text-lg leading-relaxed whitespace-pre-line text-justify">
        {longDescription ||
          (i18n.language === 'sq'
            ? 'Nuk ka përshkrim të gjatë për këtë lajm.'
            : 'Keine ausführliche Beschreibung für diese Nachricht.')}
      </div>

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 mt-10 flex flex-col md:flex-row gap-8 md:gap-16">
        <div className="md:w-[30%] flex flex-col items-center gap-6">
          {thumbnail?.fields?.file?.url && (
            <LazyLoadImage
              src={getOptimizedImage(thumbnail.fields.file.url, 600)}
              alt={`${title} detail`}
              effect="blur"
              placeholderSrc={getOptimizedImage(thumbnail.fields.file.url, 20, 'webp', 20)}
              className="w-full max-w-[300px] aspect-square shadow-md object-cover"
            />
          )}
          {secondImage?.fields?.file?.url && (
            <LazyLoadImage
              src={getOptimizedImage(secondImage.fields.file.url, 600)}
              alt={`${title} second image`}
              effect="blur"
              placeholderSrc={getOptimizedImage(secondImage.fields.file.url, 20, 'webp', 20)}
              className="w-full max-w-[300px] aspect-square shadow-md object-cover"
            />
          )}
        </div>

        <div className="md:w-[70%] text-gray-500 text-base sm:text-lg leading-relaxed text-justify whitespace-pre-line">
          {imageWithText || ''}
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 mt-16">
        <div className="max-w-md border-t border-gray-300 mb-3"></div>
        <div className="max-w-md flex justify-between text-gray-600 text-sm italic">
          <span>by {author || 'Unknown'}</span>
          <span>{date || (i18n.language === 'sq' ? 'Pa datë' : 'Kein Datum')}</span>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;


