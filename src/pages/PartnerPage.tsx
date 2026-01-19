import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from "react-helmet-async";
import { Link } from 'react-router-dom';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';
import sponsor1 from '../assets/sponsor1.png';
import sponsor2 from '../assets/sponsor2.png';
import sponsor3 from '../assets/sponsor3.png';
import sponsor4 from '../assets/sponsor4.png';

interface Partner {
  id: number;
  name: string;
  logo: string;
  description: string;
  social?: {
    instagram?: string;
    linkedin?: string;
  };
}

const PartnerPage: React.FC = () => {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const partners: Partner[] = [
    {
      id: 1,
      name: 'amag',
      logo: sponsor1,
      description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.\n\nLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.\n\nLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
      social: {
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
      }
    },
    {
      id: 2,
      name: 'Audi',
      logo: sponsor2,
      description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.',
    },
    {
      id: 3,
      name: 'Chanel',
      logo: sponsor3,
      description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.',
    },
    {
      id: 4,
      name: 'GUCCI',
      logo: sponsor4,
      description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.',
    },
  ];

  const togglePartner = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 mb-6 sm:mb-8">
      <Helmet>
        <title>{t('header.partner')} – Ansambli Ura</title>
        <meta
          name="description"
          content={t('partner.description')}
        />
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

      <div className="space-y-4 mt-16">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="border-b border-gray-300 pb-4"
          >
            <div
              onClick={() => togglePartner(partner.id)}
              className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity py-4"
            >
              <div className="flex items-center gap-8">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-24 h-24 md:w-32 md:h-32 object-contain grayscale"
                />
                {partner.social && (
                  <div className="flex gap-4">
                    {partner.social.instagram && (
                      <a
                        href={partner.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaInstagram size={24} />
                      </a>
                    )}
                    {partner.social.linkedin && (
                      <a
                        href={partner.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaLinkedin size={24} />
                      </a>
                    )}
                  </div>
                )}
              </div>
              <h2 className="text-3xl md:text-5xl font-thin font-myfont">
                {partner.name}
              </h2>
            </div>

            {expandedId === partner.id && (
              <div className="mt-4 pb-6 pl-0 md:pl-40">
                <p className="text-sm md:text-base text-gray-600 leading-relaxed font-myfont whitespace-pre-line max-w-full md:max-w-[50%]">
                  {partner.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PartnerPage;
