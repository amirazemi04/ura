import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Reveal from './Reveal';
import { safeGetEntries, safeGetField } from '../utils/contentfulHelpers';
const ROTATION_INTERVAL = 3000; // ms
const SLIDE_DURATION = 600; // ms

const SponsorsSection: React.FC = () => {
  const { t } = useTranslation();
  const [sponsorImages, setSponsorImages] = useState<string[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [visibleSlots, setVisibleSlots] = useState(4); // default 4 for desktop

  useEffect(() => {
    // Adjust VISIBLE_SLOTS based on screen width
    const updateVisibleSlots = () => {
      if (window.innerWidth < 768) {
        setVisibleSlots(2); // mobile
      } else {
        setVisibleSlots(4); // desktop
      }
    };

    updateVisibleSlots();
    window.addEventListener('resize', updateVisibleSlots);
    return () => window.removeEventListener('resize', updateVisibleSlots);
  }, []);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const entries = await safeGetEntries('sponsors', 'de', { limit: 1 });

        if (entries.length > 0) {
          const fields = entries[0].fields || {};
          const sponsors = safeGetField(fields, 'sponsorsImages', []);
          const images = sponsors
            .map((asset: any) => asset?.fields?.file?.url ? `https:${asset.fields.file.url}` : '')
            .filter(Boolean);
          if (images.length > 0) {
            setSponsorImages([...images, ...images]);
          }
        }
      } catch (error) {
        console.error('Error fetching sponsor images:', error);
      }
    };

    fetchSponsors();
  }, []);

  useEffect(() => {
    if (sponsorImages.length <= visibleSlots) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setOffset((prev) => prev + 1);
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [sponsorImages, visibleSlots]);

  useEffect(() => {
    if (offset >= sponsorImages.length / 2) {
      setTimeout(() => {
        setIsTransitioning(false);
        setOffset(0);
      }, SLIDE_DURATION);
    }
  }, [offset, sponsorImages.length]);

  return (
    <section className="py-20 bg-white overflow-hidden">
      <Reveal>
        {/* Title */}
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-thin text-[#1a1a1a] mb-10 text-left">
            {t('sponsorsSection.title')}
          </h2>
        </div>

        {/* Slider */}
        <div className="container mx-auto">
          <div className="relative w-full overflow-hidden">
            <div className="px-4">
              <div
                ref={sliderRef}
                className="flex"
                style={{
                  width: `${(sponsorImages.length / visibleSlots) * 100}%`,
                  transform: `translateX(-${(offset * 100) / sponsorImages.length}%)`,
                  transition: isTransitioning ? `transform ${SLIDE_DURATION}ms ease-in-out` : 'none',
                }}
              >
                {sponsorImages.map((src, i) => (
                  <div key={i} className="flex-1 flex justify-center items-center px-2">
                    <img
                      src={src}
                      alt={`Sponsor ${i + 1}`}
                      className="w-36 md:w-52 lg:w-64 grayscale hover:grayscale-0 transition duration-300 object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="container mx-auto px-4 flex justify-center mt-10">
          <Link
            to="/sponsor-contact"
            className="relative inline-block text-[#8B1D24] cursor-pointer text-center pb-1"
          >
            {t('header.join')}
            <svg
              viewBox="0 0 200 40"
              preserveAspectRatio="none"
              className="absolute left-0 bottom-0 w-full h-[18px]"
            >
              <path
                d="M2,34 Q100,-16 198,34"
                fill="none"
                stroke="#a51e28"
                strokeWidth="14"
                strokeLinecap="round"
              />
            </svg>
          </Link>
        </div>
      </Reveal>
    </section>
  );
};

export default SponsorsSection;
