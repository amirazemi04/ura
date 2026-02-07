import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from "react-helmet-async";
import { Link } from 'react-router-dom';
import ContactSponsors from '../components/ContactSponsors';
import Reveal from '../components/Reveal';
import { safeGetEntries, safeGetField, normalizeLocale } from '../utils/contentfulHelpers';

const SponsorsPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const [sponsorImages, setSponsorImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsorsContent = async () => {
      setLoading(true);
      try {
        const currentLocale = normalizeLocale(i18n.language);

        const textEntries = await safeGetEntries('sponsors', currentLocale, { limit: 1 });
        const imageEntries = await safeGetEntries('sponsors', 'de', { limit: 1 });

        if (textEntries.length > 0) {
          const fields = textEntries[0].fields || {};
          setTitle(safeGetField(fields, 'title', ''));
          setDescription(safeGetField(fields, 'description', ''));
        }

        if (imageEntries.length > 0) {
          const imageFields = imageEntries[0].fields || {};
          const sponsors = safeGetField(imageFields, 'sponsorsImages', []);
          const images = sponsors
            .map((asset: any) => asset?.fields?.file?.url ? `https:${asset.fields.file.url}` : '')
            .filter(Boolean);
          setSponsorImages(images);
        }
      } catch (error) {
        console.error('Error loading sponsor content:', error);
        setSponsorImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsorsContent();
  }, [i18n.language]);

  return (
    <section className="container mx-auto px-4 sm:px-6 mb-6 sm:mb-8">
      {/* SEO Meta für Sponsors-Seite */}
      <Helmet>
        <title>Sponsoren – Ansambli Ura</title>
        <meta
          name="description"
          content="Dank unseren Sponsoren können wir die albanische Kultur auf nationalen und internationalen Bühnen würdig vertreten. Unterstützen Sie Ansambli URA und tragen Sie zur Erhaltung unserer kulturellen Identität bei."
        />
        <link rel="canonical" href="https://ansambli-ura.ch/sponsors" />
      </Helmet>

      {/* Breadcrumb Navigation */}
      <nav className="text-sm text-gray-500 my-6 sm:my-12 text-center md:text-left">
        <Link to="/" className="hover:underline text-gray-500 font-medium">
          {t('header.home')}
        </Link>
        <span className="mx-1 sm:mx-2">/</span>
        <span className="text-gray-700 font-semibold">{t('header.sponsors')}</span>
      </nav>

      {/* Title and Description */}
      <Reveal>
        <h1 className="text-4xl md:text-5xl font-thin mb-6 text-center md:text-left">
          {title}
        </h1>

        <p className="text-lg md:text-xl text-gray-500 leading-relaxed mb-16 text-center md:text-left">
          {description}
          <br />
          {t('sponsorsSection.callToAction')}
        </p>
      </Reveal>

      {/* Sponsors Logo Grid */}
      <Reveal delay={0.2}>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {i18n.language === 'sq' ? 'Duke u ngarkuar...' : 'Laden...'}
            </p>
          </div>
        ) : sponsorImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 justify-items-center">
            {sponsorImages.map((src, i) => (
              <div key={i} className="flex items-center justify-center w-full h-32">
                <img
                  src={src}
                  alt={`Sponsor ${i + 1}`}
                  className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition duration-300"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {i18n.language === 'sq' ? 'Asnjë sponsor i disponueshëm' : 'Keine Sponsoren verfügbar'}
            </p>
          </div>
        )}
      </Reveal>

      <ContactSponsors />
    </section>
  );
};

export default SponsorsPage;
