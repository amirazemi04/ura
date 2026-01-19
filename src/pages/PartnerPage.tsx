import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from "react-helmet-async";
import { Link } from 'react-router-dom';
import { FaInstagram, FaLinkedin, FaFacebook, FaTwitter, FaYoutube, FaGlobe } from 'react-icons/fa';
import contentfulClient from '../contentfulClient';

interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  instagramLink?: string;
  linkedinLink?: string;
  facebookLink?: string;
  twitterLink?: string;
  youtubeLink?: string;
  websiteLink?: string;
}

const PartnerPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await contentfulClient.getEntries({
          content_type: 'partner',
          order: ['fields.order', 'sys.createdAt'],
          include: 2,
        });

        const partnersData: Partner[] = response.items.map((item: any) => ({
          id: item.sys.id,
          name: item.fields.name || '',
          logo: item.fields.logo?.fields?.file?.url
            ? `https:${item.fields.logo.fields.file.url}`
            : '',
          description: item.fields.description || '',
          instagramLink: item.fields.instagramLink || '',
          linkedinLink: item.fields.linkedinLink || '',
          facebookLink: item.fields.facebookLink || '',
          twitterLink: item.fields.twitterLink || '',
          youtubeLink: item.fields.youtubeLink || '',
          websiteLink: item.fields.websiteLink || '',
        }));

        setPartners(partnersData);
      } catch (err) {
        console.error('Error fetching partners:', err);
        setError('Failed to load partners. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [i18n.language]);

  const togglePartner = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 sm:px-6 mb-6 sm:mb-8">
        <Helmet>
          <title>{t('header.partner')} – Ansambli Ura</title>
        </Helmet>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a51e28] mx-auto mb-4"></div>
            <p className="text-gray-600 font-myfont">Loading partners...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 sm:px-6 mb-6 sm:mb-8">
        <Helmet>
          <title>{t('header.partner')} – Ansambli Ura</title>
        </Helmet>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 font-myfont">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 mb-6 sm:mb-8">
      <Helmet>
        <title>{t('header.partner')} – Ansambli Ura</title>
        <meta name="description" content={t('partner.description')} />
        <link rel="canonical" href="https://ansambli-ura.ch/partner" />
      </Helmet>

      <nav className="text-sm text-gray-500 my-6 sm:my-12 text-center md:text-left font-myfont">
        <Link to="/" className="hover:underline text-gray-500 font-medium">
          {t('header.home')}
        </Link>
        <span className="mx-1 sm:mx-2">/</span>
        <span className="text-gray-700 font-semibold">{t('header.partner')}</span>
      </nav>

      <h1 className="text-4xl md:text-6xl font-thin mb-6 text-center md:text-left font-myfont">
        {t('partner.title')}
      </h1>

      <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-12 text-center md:text-left font-myfont max-w-5xl">
        {t('partner.description')}
      </p>

      {partners.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 font-myfont">No partners available at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4 mt-16">
          {partners.map((partner) => (
            <div key={partner.id} className="border-b border-gray-300 pb-4">
              <div
                onClick={() => togglePartner(partner.id)}
                className="cursor-pointer hover:opacity-80 transition-opacity py-4"
              >
                {/* Name row */}
                <div className="flex justify-end">
                  <h2 className="text-3xl md:text-5xl font-thin font-myfont text-right">
                    {partner.name}
                  </h2>
                </div>

                {/* Description + Icons (only when expanded) */}
                {expandedId === partner.id && partner.description && (
                  <div className="mt-4 flex items-start gap-6 max-w-3xl ml-auto text-left">
                    <div className="flex gap-3 pt-1">
                      {partner.instagramLink && (
                        <a href={partner.instagramLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-gray-600 hover:text-[#E4405F]">
                          <FaInstagram size={20} />
                        </a>
                      )}
                      {partner.linkedinLink && (
                        <a href={partner.linkedinLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-gray-600 hover:text-[#0077B5]">
                          <FaLinkedin size={20} />
                        </a>
                      )}
                      {partner.facebookLink && (
                        <a href={partner.facebookLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-gray-600 hover:text-[#1877F2]">
                          <FaFacebook size={20} />
                        </a>
                      )}
                      {partner.twitterLink && (
                        <a href={partner.twitterLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-gray-600 hover:text-[#1DA1F2]">
                          <FaTwitter size={20} />
                        </a>
                      )}
                      {partner.youtubeLink && (
                        <a href={partner.youtubeLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-gray-600 hover:text-[#FF0000]">
                          <FaYoutube size={20} />
                        </a>
                      )}
                      {partner.websiteLink && (
                        <a href={partner.websiteLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-gray-600 hover:text-gray-900">
                          <FaGlobe size={20} />
                        </a>
                      )}
                    </div>

                    <p className="text-sm md:text-base text-gray-600 leading-relaxed font-myfont whitespace-pre-line">
                      {partner.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PartnerPage;
