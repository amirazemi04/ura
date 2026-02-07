import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import client from '../contentfulClient';
import {
  documentToReactComponents,
  Options,
} from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, Document } from '@contentful/rich-text-types';

const DEFAULT_LOCALE = 'de';

const TermsService = () => {
  const { i18n } = useTranslation();

  const [content, setContent] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTermsContent = async () => {
      setLoading(true);
      const currentLocale = i18n.language?.substring(0, 2) || DEFAULT_LOCALE;

      try {
        const entries = await client.getEntries({
          content_type: 'termsService',
          limit: 1,
          locale: currentLocale,
        });

        if (entries.items.length > 0) {
          const entry = entries.items[0].fields;
          setContent(entry.content || null);
        }
      } catch (error) {
        console.error('Error fetching Terms of Service:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTermsContent();
  }, [i18n.language]);

  const options: Options = {
    renderMark: {
      [MARKS.UNDERLINE]: (text) => (
        <span className="relative inline-block pb-1">
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

export default TermsService;
