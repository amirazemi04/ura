import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from "react-helmet-async";
import ContactForm from '../components/ContactForm';
import { Link } from 'react-router-dom';
import client from '../contentfulClient';
import ContactSponsors from '../components/ContactSponsors';
import Reveal from '../components/Reveal';

const DEFAULT_LOCALE = 'de';

const SponsorsPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const [sponsorImages, setSponsorImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchSponsorsContent = async () => {
      try {
        const currentLocale = i18n.language?.substring(0, 2) || DEFAULT_LOCALE;

        // Marrim përmbajtjen e përkthyer për titullin dhe përshkrimin
        const textEntries = await client.getEntries({
          content_type: 'sponsors',
          limit: 1,
          locale: currentLocale,
        });

        // Marrim imazhet gjithmonë nga 'de'
        const imageEntries = await client.getEntries({
          content_type: 'sponsors',
          limit: 1,
          locale: DEFAULT_LOCALE,
        });

        if (textEntries.items.length > 0) {
          const fields = textEntries.items[0].fields;
          setTitle(fields.title || '');
          setDescription(fields.description || '');
        }

        if (imageEntries.items.length > 0) {
          const imageFields = imageEntries.items[0].fields;
          const sponsors = imageFields.sponsorsImages || [];
          const images = sponsors.slice(0, 4).map((asset: any) => `https:${asset.fields.file.url}`);
          setSponsorImages(images);
        }
      } catch (error) {
        console.error('❌ Error loading sponsor content:', error);
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
        <div className="grid grid-cols-2 gap-x-12 gap-y-16 justify-items-center">
          {sponsorImages.length > 0 ? (
            sponsorImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={t('sponsorsSection.sponsorAlt', { number: i + 1 })}
                className="w-80 object-contain grayscale hover:grayscale-0 transition duration-300"
                style={{ alignSelf: 'center' }}
              />
            ))
          ) : (
            <p className="col-span-2 text-gray-500">
              Keine Sponsoren verfügbar.
            </p>
          )}
        </div>
      </Reveal>

      <ContactSponsors />
    </section>
  );
};

export default SponsorsPage;
