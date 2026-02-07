import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Reveal from './Reveal';
import { ChevronRight } from 'lucide-react';
import { safeGetEntries, safeGetEntry, safeGetAsset, safeGetField, normalizeLocale } from '../utils/contentfulHelpers';

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryBlock {
  id: string;
  category: string;
  images: GalleryImage[];
}

export default function Gallery() {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [imagesByCat, setImagesByCat] = useState<Record<string, GalleryImage[]>>({});
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const locale = normalizeLocale(i18n.language);
        const localizedEntries = await safeGetEntries('galleryBlock', locale);

        const combinedBlocks: GalleryBlock[] = await Promise.all(
          localizedEntries.map(async (item: any) => {
            try {
              const id = item.sys.id;
              const fields = item.fields || {};
              const category = safeGetField(fields, 'category', t('gallery.uncategorized')).trim();

              const defaultEntry = await safeGetEntry(id, 'de');
              const defaultFields = defaultEntry?.fields || {};

              const assets = [
                defaultFields.img1, defaultFields.img2, defaultFields.img3, defaultFields.img4, defaultFields.img5,
                defaultFields.img6, defaultFields.img7, defaultFields.img8, defaultFields.img9, defaultFields.img10,
                defaultFields.img11, defaultFields.img12, defaultFields.img13, defaultFields.img14, defaultFields.img15,
                defaultFields.img16, defaultFields.img17, defaultFields.img18, defaultFields.img19, defaultFields.img20,
              ];

              const images: GalleryImage[] = await Promise.all(
                assets.map(async (asset: any, index: number) => {
                  if (!asset?.sys?.id) return null;
                  try {
                    const url = await safeGetAsset(asset.sys.id);
                    if (!url) return null;
                    return {
                      src: `${url}?w=1600&fm=webp`,
                      alt: t('gallery.imageAlt', { number: index + 1 }),
                    };
                  } catch {
                    return null;
                  }
                })
              );

              return { id, category, images: images.filter(Boolean) as GalleryImage[] };
            } catch {
              return null;
            }
          })
        );

        const validBlocks = combinedBlocks.filter(Boolean) as GalleryBlock[];
        const tmp: Record<string, GalleryImage[]> = {};
        validBlocks.forEach((block) => {
          if (!tmp[block.category]) tmp[block.category] = [];
          tmp[block.category] = [...tmp[block.category], ...block.images];
        });

        const catList = Object.keys(tmp);
        setCategories(catList);
        setActiveFilter(catList[0] || '');
        setImagesByCat(tmp);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [i18n.language, t]);

  const currentCategoryIndex = categories.indexOf(activeFilter);
  const images = imagesByCat[activeFilter] || [];

  if (loading || !images.length) return null;

  return (
    <section className="py-16 bg-white" id="gallery">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Header */}
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-12 gap-4">

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-light text-[#333333]">
              {activeFilter}
            </h2>

            {/* Pagination */}
            <div className="flex items-center gap-4">
              {categories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFilter(categories[index])}
                  className={`text-lg font-light ${
                    currentCategoryIndex === index
                      ? 'text-black font-medium'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {(index + 1).toString().padStart(2, '0')}
                </button>
              ))}
              {currentCategoryIndex < categories.length - 1 && (
                <button
                  onClick={() => setActiveFilter(categories[currentCategoryIndex + 1])}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </Reveal>

        {/* 👉 DESIGN LAYOUT */}
        <Reveal delay={0.2}>
          <div className="space-y-2 sm:space-y-3">

            {/* Row 1 */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className={`w-full sm:w-[30%] aspect-[3/4] overflow-hidden ${images[0] ? 'cursor-pointer' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}
                onClick={images[0] ? () => { setLightboxIndex(0); setLightboxOpen(true); } : undefined}>
                {images[0] && <img src={images[0].src} alt={images[0].alt} className="w-full h-full object-cover" />}
              </div>

              <div className={`w-full sm:w-[50%] aspect-[16/9] overflow-hidden ${images[1] ? 'cursor-pointer' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}
                onClick={images[1] ? () => { setLightboxIndex(1); setLightboxOpen(true); } : undefined}>
                {images[1] && <img src={images[1].src} alt={images[1].alt} className="w-full h-full object-cover" />}
              </div>

              <div className="w-full sm:w-[20%] flex sm:flex-col gap-2">
                <div className={`w-1/2 sm:w-full aspect-square overflow-hidden ${images[2] ? 'cursor-pointer' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}
                  onClick={images[2] ? () => { setLightboxIndex(2); setLightboxOpen(true); } : undefined}>
                  {images[2] && <img src={images[2].src} alt={images[2].alt} className="w-full h-full object-cover" />}
                </div>
                <div className={`w-1/2 sm:w-full aspect-square overflow-hidden ${images[3] ? 'cursor-pointer' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}
                  onClick={images[3] ? () => { setLightboxIndex(3); setLightboxOpen(true); } : undefined}>
                  {images[3] && <img src={images[3].src} alt={images[3].alt} className="w-full h-full object-cover" />}
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className={`w-full sm:w-[29%] aspect-[3/4] overflow-hidden ${images[4] ? 'cursor-pointer' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}
                onClick={images[4] ? () => { setLightboxIndex(4); setLightboxOpen(true); } : undefined}>
                {images[4] && <img src={images[4].src} alt={images[4].alt} className="w-full h-full object-cover" />}
              </div>

              <div className={`w-full sm:w-[71%] aspect-[21/9] overflow-hidden ${images[5] ? 'cursor-pointer' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}
                onClick={images[5] ? () => { setLightboxIndex(5); setLightboxOpen(true); } : undefined}>
                {images[5] && <img src={images[5].src} alt={images[5].alt} className="w-full h-full object-cover" />}
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {/* Left section with 2 images on top and 1 below */}
              <div className="w-full sm:w-[45%] flex flex-col gap-2">
                {/* Top row: 2 images side by side */}
                <div className="flex gap-2">
                  <div className={`w-1/2 aspect-[4/3] overflow-hidden ${images[6] ? 'cursor-pointer' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}
                    onClick={images[6] ? () => { setLightboxIndex(6); setLightboxOpen(true); } : undefined}>
                    {images[6] && <img src={images[6].src} alt={images[6].alt} className="w-full h-full object-cover" />}
                  </div>
                  <div className={`w-1/2 aspect-[4/3] overflow-hidden ${images[7] ? 'cursor-pointer' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}
                    onClick={images[7] ? () => { setLightboxIndex(7); setLightboxOpen(true); } : undefined}>
                    {images[7] && <img src={images[7].src} alt={images[7].alt} className="w-full h-full object-cover" />}
                  </div>
                </div>
                {/* Bottom: 1 image centered */}
                <div className={`w-full aspect-[16/9] overflow-hidden ${images[8] ? 'cursor-pointer' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}
                  onClick={images[8] ? () => { setLightboxIndex(8); setLightboxOpen(true); } : undefined}>
                  {images[8] && <img src={images[8].src} alt={images[8].alt} className="w-full h-full object-cover" />}
                </div>
              </div>

              {/* Right section: large landscape image */}
              <div className={`w-full sm:w-[55%] aspect-[16/9] overflow-hidden ${images[9] ? 'cursor-pointer' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}
                onClick={images[9] ? () => { setLightboxIndex(9); setLightboxOpen(true); } : undefined}>
                {images[9] && <img src={images[9].src} alt={images[9].alt} className="w-full h-full object-cover" />}
              </div>
            </div>

          </div>
        </Reveal>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={images.map((img) => ({ src: img.src, alt: img.alt }))}
      />
    </section>
  );
}
