import { useState, useRef, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import ContactForm from '../components/ContactForm';
import TeamSection from "../components/TeamSection";
import client from '../contentfulClient';
import Reveal from '../components/Reveal';

const DEFAULT_LOCALE = 'de';

interface FaqItem {
  title: string;
  content: string;
}

const AboutUs = () => {
  const { t, i18n } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutSubtitle, setAboutSubtitle] = useState('');
  const [aboutIntro, setAboutIntro] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [heroImageAlt, setHeroImageAlt] = useState('');
  const [faqLoading, setFaqLoading] = useState(true);
  const [aboutLoading, setAboutLoading] = useState(true);

  const toggleSection = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const currentLocale = i18n.language?.substring(0, 2) || DEFAULT_LOCALE;

    const fetchAboutContent = async () => {
      setAboutLoading(true);
      try {
        const entries = await client.getEntries({
          content_type: 'about',
          limit: 1,
          locale: currentLocale,
        });

        if (entries.items.length > 0) {
          const data = entries.items[0].fields;

          setAboutTitle(data.mainTitle || '');
          setAboutSubtitle(data.subtitle || '');
          setAboutIntro(data.introText || '');

          if (data.heroImage?.fields?.file?.url) {
            const file = data.heroImage.fields.file;
            const imageUrl = file.url.startsWith('//') ? `https:${file.url}` : file.url;
            setHeroImageUrl(imageUrl);
            setHeroImageAlt(data.heroImage.fields.title || 'About image');
          }
        }
      } catch (error) {
        console.error('Error loading about content:', error);
      } finally {
        setAboutLoading(false);
      }
    };

    const fetchFaqs = async () => {
      setFaqLoading(true);
      try {
        const entries = await client.getEntries({
          content_type: 'faqs',
          limit: 1,
          locale: currentLocale,
        });

        if (entries.items.length > 0) {
          const data = entries.items[0].fields;
          const fetchedFaqs: FaqItem[] = (data.faqList || []).map((faq: any) => ({
            title: faq?.fields?.question || 'Missing question',
            content: faq?.fields?.answer || 'Missing answer',
          }));
          setFaqItems(fetchedFaqs);
        }
      } catch (error) {
        console.error('Error loading FAQs:', error);
      } finally {
        setFaqLoading(false);
      }
    };

    fetchAboutContent();
    fetchFaqs();
  }, [i18n.language]);

  return (
    <section className="container mx-auto px-4 sm:px-6 mb-6 sm:mb-8">
      {/* SEO Meta für About Us */}
      <Helmet>
        <title>Über uns – Ansambli Ura</title>
        <meta
          name="description"
          content="Ansambli URA bewahrt das albanische Kulturerbe durch Tanz, Musik und Tradition in der Schweiz. Lernen Sie unser Team und unsere Mission kennen."
        />
        <link rel="canonical" href="https://ansambli-ura.ch/about-us" />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 my-6 sm:my-12 text-center sm:text-left">
        <Link to="/" className="hover:underline text-gray-500 font-medium">
          {t('header.home')}
        </Link>
        <span className="mx-1 sm:mx-2">/</span>
        <span className="text-gray-700 font-semibold">
          {t('header.about')}
        </span>
      </nav>

      {/* Title + Subtitle from Contentful */}
      {!aboutLoading && (
        <Reveal>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-2 sm:gap-0 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold">{aboutTitle}</h1>
            <span className="text-lg sm:text-xl font-semibold text-[#a51e28]">{aboutSubtitle}</span>
          </div>
        </Reveal>
      )}

      {/* Intro Paragraph */}
      {!aboutLoading && (
        <Reveal delay={0.1}>
          <p className="text-base sm:text-md text-gray-700 mb-8 leading-relaxed px-4 sm:px-0 text-center sm:text-left">
            {aboutIntro}
          </p>
        </Reveal>
      )}

      {/* Hero Image from Contentful */}
      {heroImageUrl && (
        <Reveal delay={0.2}>
          <div className="w-full h-40 sm:h-48 mb-8 sm:mb-12">
            <img
              src={heroImageUrl}
              alt={heroImageAlt}
              className="object-cover w-full h-full shadow-md"
            />
          </div>
        </Reveal>
      )}

      {/* FAQs from Contentful */}
      <Reveal delay={0.3}>
        <div className="space-y-4 sm:space-y-6">
          {faqLoading ? (
            <p>{i18n.language === 'sq' ? 'Duke u ngarkuar...' : 'Laden...'}</p>
          ) : (
            faqItems.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index} className="pb-2 sm:pb-4">
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full py-3 sm:py-4 text-left transition"
                >
                  <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                    <span className={`text-gray-900 font-semibold text-base sm:text-lg ${isOpen ? 'text-[#a51e28]' : ''}`}>
                      {faq.title}
                    </span>
                    {isOpen ? <Minus size={22} /> : <Plus size={22} />}
                  </div>
                </button>

                <div
                  ref={(el) => (contentRefs.current[index] = el)}
                  style={{
                    height: isOpen ? contentRefs.current[index]?.scrollHeight : 0,
                    overflow: 'hidden',
                    transition: 'height 0.4s ease',
                  }}
                  aria-expanded={isOpen}
                >
                  <div className="pt-3 sm:pt-4 text-sm sm:text-base text-gray-700 text-justify sm:text-left">
                    {faq.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
        </div>
      </Reveal>

      <div className="mt-12">
        <ContactForm />
        <TeamSection />
      </div>
    </section>
  );
};

export default AboutUs;
