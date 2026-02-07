import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import client from '../contentfulClient';
import {
  documentToReactComponents,
  Options,
} from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, Document } from '@contentful/rich-text-types';

const DEFAULT_LOCALE = 'de';

const PrivacyPolicy = () => {
  const { i18n } = useTranslation();

  const [content, setContent] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrivacyContent = async () => {
      setLoading(true);
      const currentLocale = i18n.language?.substring(0, 2) || DEFAULT_LOCALE;

      try {
        const entries = await client.getEntries({
          content_type: 'privacyPolicy',
          limit: 1,
          locale: currentLocale,
        });

        if (entries.items.length > 0) {
          const entry = entries.items[0].fields;
          setContent(entry.content || null);
        }
      } catch (error) {
        console.error('Error fetching Privacy Policy:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyContent();
  }, [i18n.language]);

  const options: Options = {
    renderMark: {
      [MARKS.UNDERLINE]: (text) => (
        <span className="relative inline-block pb-1">
          {text}
          <svg
            viewBox="0 0 768.9 65.28"
            preserveAspectRatio="none"
            className="absolute left-0 bottom-0 w-full h-[6px]"
          >
            <path
              fill="#a61e29"
              d="M22.08,48.81c82.09-11.37,164.95-17.33,247.75-20.22,97.88-3.42,195.97-2.19,293.72,4.02,56.9,3.62,113.69,8.98,170.23,16.42,3.24.43,5.97-3.06,6-6,.04-3.59-2.8-5.58-6-6-100.74-13.25-202.31-20-303.88-21.8-93.06-1.65-186.27.79-279.07,7.98-44.1,3.42-88.11,7.96-131.93,14.03-7.62,1.05-4.38,12.62,3.19,11.57"
            />
          </svg>
        </span>
      ),
      [MARKS.BOLD]: (text) => <strong className="font-bold text-black">{text}</strong>,
    },
    renderNode: {
      [BLOCKS.HEADING_1]: (_, children) => (
        <h1 className="text-4xl font-bold mt-8 mb-4 text-black">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (_, children) => (
        <h2 className="text-3xl font-semibold mt-6 mb-3 text-gray-800">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (_, children) => (
        <h3 className="text-2xl font-medium mt-5 mb-2 text-gray-700">{children}</h3>
      ),
      [BLOCKS.PARAGRAPH]: (_, children) => (
        <p className="text-base text-gray-700 mb-4">{children}</p>
      ),
    },
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-100">
        <p>{i18n.language === 'sq' ? 'Duke u ngarkuar...' : 'Laden...'}</p>
      </div>
    );
  }

  return (
    <section className="px-6 py-12">
      <div className="container mx-auto">
        {content ? (
          <div className="prose max-w-none">{documentToReactComponents(content, options)}</div>
        ) : (
          <p className="text-gray-600">
            {i18n.language === 'sq' ? 'Përmbajtja mungon.' : 'Inhalt fehlt.'}
          </p>
        )}
      </div>
    </section>
  );
};

export default PrivacyPolicy;
