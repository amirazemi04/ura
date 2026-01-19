import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import client from '../contentfulClient';
import {
  documentToReactComponents,
  Options,
} from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, Document } from '@contentful/rich-text-types';
import LazyImage from './LazyImage';
import Reveal from './Reveal';

const DEFAULT_LOCALE = 'de';

const HeroSection = () => {
  const { i18n } = useTranslation();

  const [heading, setHeading] = useState('');
  const [slogan, setSlogan] = useState('');
  const [description, setDescription] = useState<Document | null>(null);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroContent = async () => {
      setLoading(true);
      const currentLocale = i18n.language?.substring(0, 2) || DEFAULT_LOCALE;

      try {
        const entries = await client.getEntries({
          content_type: 'teksti',
          limit: 1,
          locale: currentLocale,
        });

        if (entries.items.length > 0) {
          const entry = entries.items[0].fields;
          setHeading(entry.heroSectionHeading || '');
          setSlogan(entry.slogani || '');
          setDescription(entry.heroDescription || null);

          if (entry.heroImage?.fields?.file?.url) {
            setHeroImage(`https:${entry.heroImage.fields.file.url}`);
          }
        }
      } catch (error) {
        console.error('Error fetching HeroSection:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroContent();
  }, [i18n.language]);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-100">
        <p>{i18n.language === 'sq' ? 'Duke u ngarkuar...' : 'Laden...'}</p>
      </div>
    );
  }

  const options: Options = {
    renderMark: {
      [MARKS.UNDERLINE]: (text) => (
        <span className="text-black relative inline-block pb-1">
          {text}
          <svg
            viewBox="0 0 200 20"
            preserveAspectRatio="none"
            className="absolute left-0 bottom-0 w-full h-3"
          >
            <path
              d="M0,20 Q100,-10 200,20"
              fill="none"
              stroke="#8B1D24"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </span>
      ),
      [MARKS.BOLD]: (text) => <strong className="font-bold text-black">{text}</strong>,
    },
  };

  return (
    <section className="px-6 py-12" id="home">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-6 items-center">
          {/* Left Column */}
          <Reveal className="lg:col-span-6 text-center lg:text-left space-y-3" delay={0.1}>
            <h1 className="text-3xl lg:text-6xl font-light text-[#333333] tracking-wide font-myfont whitespace-pre-line">
              {heading}
            </h1>
            <p className="text-xl lg:text-4xl text-[#a51e28] font-handsome whitespace-pre-line">
              {slogan}
            </p>
          </Reveal>

          {/* Right Column */}
          <Reveal className="lg:col-span-6 flex justify-center lg:justify-start text-center lg:text-left lg:pl-28" delay={0.3}>
            <div className="max-w-xl px-2 sm:px-0 text-[#7c7c7c] text-base sm:text-lg leading-relaxed font-myfont">
              {heroImage && (
                <div className="mb-6 w-full h-64 sm:h-80">
                  <LazyImage
                    src={heroImage}
                    alt={heading || 'Hero Image'}
                    width={800}
                    height={600}
                    className="rounded-md shadow-md"
                  />
                </div>
              )}
              {description ? (
                <div className="prose max-w-none">
                  {documentToReactComponents(description, options)}
                </div>
              ) : (
                <p>{i18n.language === 'sq' ? 'Përshkrimi mungon.' : 'Beschreibung fehlt.'}</p>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
