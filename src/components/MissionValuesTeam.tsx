import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Reveal from './Reveal';
import { safeGetEntries, safeGetField, normalizeLocale } from '../utils/contentfulHelpers';

type Tab = 'mission' | 'values' | 'team';

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
      try {
        const currentLocale = normalizeLocale(i18n.language);
        const entries = await safeGetEntries('teksti', currentLocale, { limit: 1 });

        if (entries.length > 0) {
          const fields = entries[0].fields || {};

          setContents({
            mission: safeGetField(fields, 'missionContent', ''),
            values: safeGetField(fields, 'valuesContent', ''),
            team: safeGetField(fields, 'teamContent', ''),
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
    <section className="bg-white py-12">
      <Reveal>
        <div className="container mx-auto px-6">

          {/* Tabs */}
          <div className="flex flex-wrap justify-start gap-10 sm:gap-20 mb-8">
            {(['mission', 'values', 'team'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative pb-2 text-base sm:text-lg font-medium text-gray-700 hover:text-[#8B1D24] font-myfont"
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
                    viewBox="-5 -5 110 30"
                    preserveAspectRatio="none"
                    className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full h-[5px] overflow-visible"
                  >
                    <path
                      d="M5,20 Q50,-10 95,20"
                      fill="none"
                      stroke="#a51e28"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="w-full flex justify-start">
            <div className="w-full transition-all duration-500 ease-in-out text-[#7c7c7c] leading-relaxed text-base sm:text-[18px] whitespace-pre-line">
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
      </Reveal>
    </section>
  );
};

export default MissionValuesTeam;
