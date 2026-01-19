import { useEffect, useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import client from '../contentfulClient';
import { useTranslation } from 'react-i18next';
import Reveal from './Reveal';

const DEFAULT_LOCALE = 'de';

interface FaqItem {
  title: string;
  content: string;
}

const FinalSection = () => {
  const { t, i18n } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionDescription, setSectionDescription] = useState('');
  const [loading, setLoading] = useState(true);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const currentLocale = i18n.language?.substring(0, 2) || DEFAULT_LOCALE;

      try {
        const entries = await client.getEntries({
          content_type: 'faqs',
          limit: 1,
          locale: currentLocale,
        });

        if (entries.items.length > 0) {
          const data = entries.items[0].fields;
          console.log('Fetched data:', data);

          setSectionTitle(data.sectionTitle || '');
          setSectionDescription(data.sectionDescription || '');

          const fetchedFaqs: FaqItem[] = (data.faqList || []).map((faq: any) => ({
            title: faq?.fields?.question || 'Missing question',
            content: faq?.fields?.answer || 'Missing answer',
          }));

          setFaqItems(fetchedFaqs);
        } else {
          console.warn('No faqs entry found.');
        }
      } catch (error) {
        console.error('Error fetching FinalSection:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [i18n.language]);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-100">
        <p>{i18n.language === 'sq' ? 'Duke u ngarkuar...' : 'Laden...'}</p>
      </div>
    );
  }

  if (!faqItems.length) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-yellow-100 text-yellow-700">
        <p>No FAQs loaded. Please check your Contentful content and references.</p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 mb-16 lg:mb-20 items-start">
          {/* Left Column */}
          <Reveal>
            <div>
              <h5 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                {sectionTitle}
              </h5>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                {sectionDescription}
              </p>
            </div>
          </Reveal>

          {/* Right Column - FAQ */}
          <Reveal delay={0.2}>
            <div className="space-y-4">
              <h5 className="text-xl sm:text-2xl font-bold text-black mb-2 sm:mb-4">
                {t('finalSection.faq.title')}
              </h5>

              {faqItems.map((item, index) => (
                <div key={index} className="border-b border-[#DDDDDD]">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-2 sm:px-3 py-2 text-left flex items-center justify-between transition-colors duration-200"
                  >
                    <span className="font-medium text-gray-600 text-base sm:text-lg">
                      {item.title}
                    </span>
                    {openFaq === index ? (
                      <Minus size={20} className="text-gray-500" />
                    ) : (
                      <Plus size={20} className="text-gray-500" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {openFaq === index && (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className="px-4 sm:px-6 overflow-hidden"
                      >
                        <p className="text-[#333333] text-sm sm:text-base leading-relaxed py-2">
                          {item.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default FinalSection;
