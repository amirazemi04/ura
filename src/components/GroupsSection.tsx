import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import client from '../contentfulClient';

const DEFAULT_LOCALE = 'de';

const GroupsSection = () => {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language?.substring(0, 2) || DEFAULT_LOCALE;

  const [groupImages, setGroupImages] = useState<string[]>([]);
  const [sectionDescription, setSectionDescription] = useState<string>('');
  const [scheduleTime, setScheduleTime] = useState<string[]>([]);
  const [scheduleLocation, setScheduleLocation] = useState<string[]>([]);

  useEffect(() => {
    const fetchGroupTexts = async () => {
      try {
        const defaultLocaleResponse = await client.getEntries({
          content_type: 'teksti',
          limit: 1,
          locale: DEFAULT_LOCALE,
        });

        const localizedResponse = await client.getEntries({
          content_type: 'teksti',
          limit: 1,
          locale: currentLocale,
        });

        if (defaultLocaleResponse.items.length > 0) {
          const defaultFields = defaultLocaleResponse.items[0].fields;
          setScheduleTime(defaultFields.groupsScheduleTime || []);
          setScheduleLocation(defaultFields.groupsScheduleLocation || []);
        }

        if (localizedResponse.items.length > 0) {
          const localizedFields = localizedResponse.items[0].fields;
          setSectionDescription(localizedFields.groupsSectionDescription || '');
        }
      } catch (error) {
        console.error('Error fetching group texts:', error);
      }
    };

    fetchGroupTexts();
  }, [currentLocale]);

  useEffect(() => {
    const fetchGroupImages = async () => {
      try {
        const response = await client.getEntries({
          content_type: 'imazhetEwebit',
          limit: 1,
          locale: DEFAULT_LOCALE,
        });

        if (response.items.length > 0) {
          const entry = response.items[0];
          const images = entry.fields.grups || [];
          const imageUrls = images
            .slice(0, 3)
            .map((img: any) => `https:${img.fields.file.url}`);
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
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Group Images */}
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

          {/* Right Column - Schedule and Info */}
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
                    viewBox="0 0 100 20"
                    preserveAspectRatio="none"
                    className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[85px] h-[6px]"
                  >
                    <path
                      d="M0,20 Q50,-10 100,20"
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
        </div>
      </div>
    </section>
  );
};

export default GroupsSection;
