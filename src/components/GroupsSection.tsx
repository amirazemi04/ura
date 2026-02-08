import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Reveal from './Reveal';
import { safeGetEntries, safeGetField, normalizeLocale } from '../utils/contentfulHelpers';

interface GroupImage {
  url: string;
  title: string;
}

const GroupsSection = () => {
  const { t, i18n } = useTranslation();
  const [groupImages, setGroupImages] = useState<GroupImage[]>([]);
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
        const currentLocale = normalizeLocale(i18n.language);
        const entries = await safeGetEntries('imazhetEwebit', currentLocale, { limit: 1 });

        if (entries.length > 0) {
          const fields = entries[0].fields || {};
          const images = safeGetField(fields, 'grups', []);
          const imageData: GroupImage[] = images
            .slice(0, 4)
            .map((img: any) => {
              const url = img?.fields?.file?.url ? `https:${img.fields.file.url}` : '';
              const title = img?.fields?.title || '';
              return { url, title };
            })
            .filter((item: GroupImage) => item.url);
          setGroupImages(imageData);
        }
      } catch (error) {
        console.error('Error fetching group images:', error);
      }
    };

    fetchGroupImages();
  }, [i18n.language]);

  return (
    <section className="bg-white" id="groups">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Group Images + Schedule */}
          <Reveal>
            <div>
              <h2 className="text-2xl sm:text-3xl font-light mb-8 text-center sm:text-left">
                {t('groupsSection.title')}
              </h2>

              {/* 4 Images Grid */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-8">
                {groupImages.map((image, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden shadow-xl cursor-pointer aspect-[3/4] w-full"
                  >
                    <img
                      src={image.url}
                      alt={image.title || `Group ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                      <span className="text-white font-medium mb-2 text-center text-xs sm:text-sm px-1">
                        {image.title}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-[#8B1D24]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>

              {/* Schedule - Now in Left Column */}
              <div className="mt-8">
                <div className="grid grid-cols-2 gap-8">
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
            </div>
          </Reveal>

          {/* Right Column - Description + Button */}
          <Reveal delay={0.2}>
            <div className="flex flex-col justify-between h-full">
              {/* Description */}
              <div className="mt-16">
                <p className="text-gray-600 leading-relaxed text-lg">
                  {sectionDescription ||
                    'Të bashkuar nga qëllimi për të ruajtur dhe promovuar kulturën shqiptare, ekipi ynë sjell përvojë, pasion dhe bashkëpunim në çdo provë dhe paraqitje.'}
                </p>
              </div>

              {/* Join Link */}
              <div className="mt-16 sm:mt-auto flex justify-end">
                <Link to="/join-us">
                  <div className="relative inline-block text-[#8B1D24] cursor-pointer text-right pb-1">
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
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default GroupsSection;
