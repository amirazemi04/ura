import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from "react-helmet-async";
import { Link } from 'react-router-dom';

const PartnerPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="container mx-auto px-4 sm:px-6 mb-6 sm:mb-8">
      <Helmet>
        <title>{t('header.partner')} – Ansambli Ura</title>
        <meta
          name="description"
          content="Partner page of Ansambli URA"
        />
        <link rel="canonical" href="https://ansambli-ura.ch/partner" />
      </Helmet>

      <nav className="text-sm text-gray-500 my-6 sm:my-12 text-center md:text-left">
        <Link to="/" className="hover:underline text-gray-500 font-medium">
          {t('header.home')}
        </Link>
        <span className="mx-1 sm:mx-2">/</span>
        <span className="text-gray-700 font-semibold">{t('header.partner')}</span>
      </nav>

      <h1 className="text-4xl md:text-5xl font-thin mb-6 text-center md:text-left font-myfont">
        {t('header.partner')}
      </h1>

      <div className="text-lg md:text-xl text-gray-500 leading-relaxed mb-16 text-center md:text-left font-myfont">
        <p>
          Partner content will be added here.
        </p>
      </div>
    </section>
  );
};

export default PartnerPage;
