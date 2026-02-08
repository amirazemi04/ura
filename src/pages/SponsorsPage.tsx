import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from "react-helmet-async";
import { Link } from 'react-router-dom';
import { BLOCKS, Document } from '@contentful/rich-text-types';
import ContactSponsors from '../components/ContactSponsors';
import Reveal from '../components/Reveal';
import { safeGetEntries, safeGetField, normalizeLocale } from '../utils/contentfulHelpers';

const ROTATION_INTERVAL = 3000;
const SLIDE_DURATION = 600;

interface SponsorImage {
  url: string;
  link?: string;
}

interface SponsorContent {
  title: string;
  description: string;
  topSponsors: SponsorImage[];
  secondarySponsors: SponsorImage[];
  otherSponsorsTitle: string;
  otherSponsors: string[];
}

const extractTextFromRichText = (doc: Document | null): string[] => {
  if (!doc || !doc.content) return [];
  return doc.content
    .filter((node: any) => node.nodeType === BLOCKS.PARAGRAPH)
    .map((node: any) => {
      const text = node.content
        ?.map((child: any) => child.value || '')
        .join('')
        .trim();
      return text;
    })
    .filter(Boolean);
};

const extractImagesFromAssets = (assets: any[]): SponsorImage[] => {
  if (!Array.isArray(assets)) return [];
  return assets
    .map((asset: any) => {
      const url = asset?.fields?.file?.url ? `https:${asset.fields.file.url}` : '';
      const link = asset?.fields?.title || '';
      return { url, link };
    })
    .filter((item: SponsorImage) => item.url);
};

const SponsorsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState<SponsorContent>({
    title: '',
    description: '',
    topSponsors: [],
    secondarySponsors: [],
    otherSponsorsTitle: '',
    otherSponsors: [],
  });
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderOffset, setSliderOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [visibleSlots, setVisibleSlots] = useState(4);
  const [sliderImages, setSliderImages] = useState<SponsorImage[]>([]);

  useEffect(() => {
    const updateVisibleSlots = () => {
      setVisibleSlots(window.innerWidth < 768 ? 2 : 4);
    };
    updateVisibleSlots();
    window.addEventListener('resize', updateVisibleSlots);
    return () => window.removeEventListener('resize', updateVisibleSlots);
  }, []);

  useEffect(() => {
    if (content.secondarySponsors.length > 0) {
      setSliderImages([...content.secondarySponsors, ...content.secondarySponsors]);
    }
  }, [content.secondarySponsors]);

  useEffect(() => {
    if (sliderImages.length <= visibleSlots) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setSliderOffset((prev) => prev + 1);
    }, ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, [sliderImages, visibleSlots]);

  useEffect(() => {
    if (sliderImages.length > 0 && sliderOffset >= sliderImages.length / 2) {
      setTimeout(() => {
        setIsTransitioning(false);
        setSliderOffset(0);
      }, SLIDE_DURATION);
    }
  }, [sliderOffset, sliderImages.length]);

  useEffect(() => {
    const fetchSponsorsContent = async () => {
      setLoading(true);
      try {
        const currentLocale = normalizeLocale(i18n.language);

        const textEntries = await safeGetEntries('sponsors', currentLocale, { limit: 1 });
        const imageEntries = await safeGetEntries('sponsors', 'de', { limit: 1 });

        let title = '';
        let description = '';
        let otherSponsorsTitle = '';
        let otherSponsors: string[] = [];

        if (textEntries.length > 0) {
          const fields = textEntries[0].fields || {};
          title = safeGetField(fields, 'title', '');
          description = safeGetField(fields, 'description', '');
          otherSponsorsTitle = safeGetField(fields, 'otherSponsorsTitle', '');
          const otherSponsorsRich = safeGetField(fields, 'otherSponsors', null);
          if (otherSponsorsRich) {
            otherSponsors = extractTextFromRichText(otherSponsorsRich);
          }
        }

        let topSponsors: string[] = [];
        let secondarySponsors: string[] = [];

        if (imageEntries.length > 0) {
          const imageFields = imageEntries[0].fields || {};
          topSponsors = extractImagesFromAssets(safeGetField(imageFields, 'topSponsors', []));
          secondarySponsors = extractImagesFromAssets(safeGetField(imageFields, 'secondarySponsors', []));
        }

        setContent({
          title,
          description,
          topSponsors,
          secondarySponsors,
          otherSponsorsTitle,
          otherSponsors,
        });
      } catch (error) {
        console.error('Error loading sponsor content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsorsContent();
  }, [i18n.language]);

  return (
    <section className="container mx-auto px-4 sm:px-6 mb-6 sm:mb-8">
      <Helmet>
        <title>Sponsoren – Ansambli Ura</title>
        <meta
          name="description"
          content="Dank unseren Sponsoren können wir die albanische Kultur auf nationalen und internationalen Bühnen würdig vertreten. Unterstützen Sie Ansambli URA und tragen Sie zur Erhaltung unserer kulturellen Identität bei."
        />
        <link rel="canonical" href="https://ansambli-ura.ch/sponsors" />
      </Helmet>

      <nav className="text-sm text-gray-500 my-6 sm:my-12 text-center md:text-left">
        <Link to="/" className="hover:underline hover:underline-offset-4 text-gray-500 font-medium">
          {t('header.home')}
        </Link>
        <span className="mx-1 sm:mx-2">/</span>
        <span className="text-gray-700 font-semibold">{t('header.sponsors')}</span>
      </nav>

      <Reveal>
        <h1 className="text-4xl md:text-5xl font-thin mb-6 text-center md:text-left">
          {content.title}
        </h1>

        <p className="text-lg md:text-xl text-gray-500 leading-relaxed mb-16 text-center md:text-left">
          {content.description}
          <br />
          {t('sponsorsSection.callToAction')}
        </p>
      </Reveal>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {i18n.language === 'sq' ? 'Duke u ngarkuar...' : 'Laden...'}
          </p>
        </div>
      ) : (
        <>
          {content.topSponsors.length > 0 && (
            <Reveal delay={0.1}>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 py-10">
                {content.topSponsors.map((sponsor, i) => (
                  <div key={i} className="flex items-center justify-center">
                    {sponsor.link ? (
                      <a
                        href={sponsor.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={sponsor.url}
                          alt={`Top Sponsor ${i + 1}`}
                          className="h-24 md:h-32 w-auto object-contain transition duration-300"
                        />
                      </a>
                    ) : (
                      <img
                        src={sponsor.url}
                        alt={`Top Sponsor ${i + 1}`}
                        className="h-24 md:h-32 w-auto object-contain transition duration-300"
                      />
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {sliderImages.length > 0 && (
            <Reveal delay={0.2}>
              <div className="border-t border-gray-200 my-4" />
              <div className="relative w-full overflow-hidden py-4">
                <div
                  ref={sliderRef}
                  className="flex"
                  style={{
                    width: `${(sliderImages.length / visibleSlots) * 100}%`,
                    transform: `translateX(-${(sliderOffset * 100) / sliderImages.length}%)`,
                    transition: isTransitioning ? `transform ${SLIDE_DURATION}ms ease-in-out` : 'none',
                  }}
                >
                  {sliderImages.map((sponsor, i) => (
                    <div key={i} className="flex-1 flex justify-center items-center px-2">
                      {sponsor.link ? (
                        <a
                          href={sponsor.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer"
                        >
                          <img
                            src={sponsor.url}
                            alt={`Sponsor ${i + 1}`}
                            className="w-28 md:w-40 lg:w-48 grayscale hover:grayscale-0 transition duration-300 object-contain"
                          />
                        </a>
                      ) : (
                        <img
                          src={sponsor.url}
                          alt={`Sponsor ${i + 1}`}
                          className="w-28 md:w-40 lg:w-48 grayscale hover:grayscale-0 transition duration-300 object-contain"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {content.otherSponsors.length > 0 && (
            <Reveal delay={0.3}>
              <div className="border-t border-gray-200 mt-4 mb-8" />
              <div className="w-full py-6">
                <p className="text-gray-400 text-xl md:text-2xl mb-2">
                  {content.otherSponsorsTitle || t('sponsorsSection.otherSponsorsDefault')}
                </p>
                <div className="border-b border-gray-200 mb-6" />
                <ul>
                  {content.otherSponsors.map((name, i) => (
                    <li
                      key={i}
                      className="py-3 border-b border-gray-200 text-[#333333] text-lg font-medium hover:bg-[#A41E28] hover:text-white px-2 transition-colors duration-200 cursor-pointer"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </>
      )}

      <ContactSponsors />
    </section>
  );
};

export default SponsorsPage;
