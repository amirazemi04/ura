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
    <section className="px-4 sm:px-6 py-12 bg-white">
      <Reveal>
        <div className="container mx-auto">

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
                    viewBox="0 0 768.9 65.28"
                    preserveAspectRatio="none"
                    className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[55px] sm:w-[65px] h-[5px]"
                  >
                    <path
                      fill="#a61e29"
                      d="M22.08,48.81c82.09-11.37,164.95-17.33,247.75-20.22,97.88-3.42,195.97-2.19,293.72,4.02,56.9,3.62,113.69,8.98,170.23,16.42,3.24.43,5.97-3.06,6-6,.04-3.59-2.8-5.58-6-6-100.74-13.25-202.31-20-303.88-21.8-93.06-1.65-186.27.79-279.07,7.98-44.1,3.42-88.11,7.96-131.93,14.03-7.62,1.05-4.38,12.62,3.19,11.57"
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
