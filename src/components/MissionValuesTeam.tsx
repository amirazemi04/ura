import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import client from '../contentfulClient';

type Tab = 'mission' | 'values' | 'team';

const DEFAULT_LOCALE = 'de';

const MissionValuesTeam = () => {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('mission');

  const [contents, setContents] = useState<{
    mission: string;
    values: string;
    team: string;
  }>({
    mission: '',
    values: '',
    team: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const currentLocale = i18n.language?.substring(0, 2) || DEFAULT_LOCALE;

      try {
        const entries = await client.getEntries({
          content_type: 'teksti',
          limit: 1,
          locale: currentLocale,
        });

        if (entries.items.length > 0) {
          const fields = entries.items[0].fields;

          setContents({
            mission: fields.missionContent || '',
            values: fields.valuesContent || '',
            team: fields.teamContent || '',
          });
        }
      } catch (error) {
        console.error('Error fetching content:', error);
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

  return (
    <section className="px-6 py-12 bg-white">
      <div className="container mx-auto">
        {/* Tabs */}
        <div className="flex space-x-24 mb-8">
          {(['mission', 'values', 'team'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative pb-1 text-lg font-medium text-gray-700 hover:text-[#8B1D24] font-myfont"
            >
              <span>
                {tab === 'mission'
                  ? i18n.language === 'sq' ? 'Misioni' : 'Mission'
                  : tab === 'values'
                  ? i18n.language === 'sq' ? 'Vlerat' : 'Werte'
                  : i18n.language === 'sq' ? 'Ekipi' : 'Team'}
              </span>

              {activeTab === tab && (
                <svg
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                  className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[60px] h-[6px]"
                >
                  <path
                    d="M0,20 Q50,-10 100,20"
                    fill="none"
                    stroke="#a51e28"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-4xl flex justify-start">
        <div className="transition-all duration-500 ease-in-out text-[#7c7c7c] leading-relaxed text-[18px] whitespace-pre-line">

            {contents[activeTab] || (
              <p className="text-gray-400 italic">
                {i18n.language === 'sq'
                  ? 'Përmbajtja nuk është në dispozicion.'
                  : 'Content is not available.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionValuesTeam;
