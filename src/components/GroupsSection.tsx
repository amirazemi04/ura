import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Reveal from './Reveal';
import { safeGetEntries, safeGetField, normalizeLocale } from '../utils/contentfulHelpers';

const GroupsSection = () => {
  const { t, i18n } = useTranslation();
  const [groupImages, setGroupImages] = useState<string[]>([]);
  const [sectionDescription, setSectionDescription] = useState<string>('');
  const [scheduleTime, setScheduleTime] = useState<string[]>([]);
  const [scheduleLocation, setScheduleLocation] = useState<string[]>([]);

  useEffect(() => {
    const fetchGroupTexts = async () => {
      try {
        const currentLocale = normalizeLocale(i18n.language);

        const defaultEntries = await safeGetEntries('teksti', 'de', { limit: 1 });
        const localizedEntries = await safeGetEntries('teksti', currentLocale, { limit: 1 });

        if (defaultEntries.length > 0) {
          const defaultFields = defaultEntries[0].fields || {};
          setScheduleTime(safeGetField(defaultFields, 'groupsScheduleTime', []));
          setScheduleLocation(safeGetField(defaultFields, 'groupsScheduleLocation', []));
        }

        if (localizedEntries.length > 0) {
          const localizedFields = localizedEntries[0].fields || {};
          setSectionDescription(safeGetField(localizedFields, 'groupsSectionDescription', ''));
        }
      } catch (error) {
        console.error('Error fetching group texts:', error);
      }
    };

    fetchGroupTexts();
  }, [i18n.language]);

  useEffect(() => {
    const fetchGroupImages = async () => {
      try {
        const entries = await safeGetEntries('imazhetEwebit', 'de', { limit: 1 });

        if (entries.length > 0) {
          const fields = entries[0].fields || {};
          const images = safeGetField(fields, 'grups', []);
          const imageUrls = images
            .slice(0, 3)
            .map((img: any) => img?.fields?.file?.url ? `https:${img.fields.file.url}` : '')
            .filter(Boolean);
          setGroupImages(imageUrls);
        }
      } catch (error) {
        console.error('Error fetching group images:', error);
      }
    };

    fetchGroupImages();
  }, []);

  const captions = [
    t('groupsSection.groups.age18_30'),
    t('groupsSection.groups.age30_45'),
    t('groupsSection.groups.age45_plus'),
  ];

  return (
    <section className="bg-white" id="groups">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Group Images */}
          <Reveal>
            <div>
              <h2 className="text-2xl sm:text-3xl font-light mb-8 text-center sm:text-left">
                {t('groupsSection.title')}
              </h2>

              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                {groupImages.map((image, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden shadow-xl cursor-pointer aspect-[3/6] w-full max-w-sm mx-auto"

                  >
                    <img
                      src={image}
                      alt={`Group ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                      <span className="text-white font-medium mb-4 text-center">
                        {captions[index] || ''}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-[#8B1D24]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right Column - Schedule and Info */}
          <Reveal delay={0.2}>
            <div className="flex flex-col justify-between">
              {/* Schedule */}
              <div className="mt-16">
                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div>
                    <h3 className="text-xl font-bold mb-4">
                      {t('groupsSection.schedule.title')}
                    </h3>
                    {scheduleTime.length > 0 ? (
                      scheduleTime.map((time, idx) => (
                        <p key={idx} className="text-[#8B1D24]">{time}</p>
                      ))
                    ) : (
                      <p className="text-[#8B1D24]">08:00–11:00</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4">
                      {t('groupsSection.locations.title')}
                    </h3>
                    {scheduleLocation.length > 0 ? (
                      scheduleLocation.map((loc, idx) => (
                        <p key={idx} className="text-[#8B1D24]">{loc}</p>
                      ))
                    ) : (
                      <p className="text-[#8B1D24]">Dübendorf, Zürich</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {sectionDescription ||
                    'Ansambli URA është i hapur për bashkëpunime\nme institucione, organizata dhe komunitete\nqë vlerësojnë trashëgiminë shqiptare.'}
                </p>
              </div>

              {/* Join Link */}
              <Link to="/join-us">
                <div className="mt-16 sm:mt-auto">
                  <div className="relative inline-block text-[#8B1D24] cursor-pointer text-left pb-1">
                    {t('header.join')}
                    <svg
                      viewBox="-5 -5 110 30"
                      preserveAspectRatio="none"
                      className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full h-[6px] overflow-visible"
                    >
                      <path
                        d="M5,20 Q50,-10 95,20"
                        fill="none"
                        stroke="#a51e28"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default GroupsSection;
