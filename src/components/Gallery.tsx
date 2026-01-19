import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import client from '../contentfulClient';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Reveal from './Reveal';
import { ChevronRight } from 'lucide-react';

const DEFAULT_LOCALE = 'de';

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
    if (!i18n.isInitialized) return;

    const fetchGallery = async () => {
      setLoading(true);
      try {
        const locale = i18n.language || DEFAULT_LOCALE;
        const localizedEntries = await client.getEntries({
          content_type: 'galleryBlock',
          locale,
        });

        const combinedBlocks: GalleryBlock[] = await Promise.all(
          localizedEntries.items.map(async (item: any) => {
            try {
              const id = item.sys.id;
              const category = item.fields.category?.trim() || t('gallery.uncategorized');
              const defaultEntry = await client.getEntry(id, { locale: DEFAULT_LOCALE });
              const fields = defaultEntry.fields;

              const assets = [
                fields.img1, fields.img2, fields.img3, fields.img4, fields.img5,
                fields.img6, fields.img7, fields.img8, fields.img9, fields.img10,
                fields.img11, fields.img12, fields.img13, fields.img14, fields.img15,
                fields.img16, fields.img17, fields.img18, fields.img19, fields.img20,
              ];

              const images: GalleryImage[] = await Promise.all(
                assets.map(async (asset: any, index: number) => {
                  if (!asset?.sys?.id) return null;
                  try {
                    const assetData = await client.getAsset(asset.sys.id, { locale: DEFAULT_LOCALE });
                    if (!assetData?.fields?.file?.url) return null;
                    return {
                      src: `https:${assetData.fields.file.url}?w=1600&fm=webp`,
                      alt: assetData.fields.title || t('gallery.imageAlt', { number: index + 1 }),
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
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [i18n.language, t, i18n.isInitialized]);

  const currentCategoryIndex = categories.indexOf(activeFilter);
  const images = imagesByCat[activeFilter] || [];

  if (loading || !images.length) return null;

  return (
    <section className="py-16 bg-white" id="gallery">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Header */}
        <Reveal>
          <div className="flex justify-between items-start mb-10">
            <h2 className="text-4xl sm:text-5xl font-light text-[#333333]">
              {activeFilter}
            </h2>

            <div className="flex items-center gap-3">
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

        {/* 👉 TIGHT GRID LAYOUT */}
        <Reveal delay={0.15}>
          <div className="space-y-3">

            {/* Row 1 */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {images[0] && (
                <div className="w-full sm:w-[30%] aspect-[3/4] overflow-hidden cursor-pointer"
                  onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}>
                  <img src={images[0].src} alt={images[0].alt} className="w-full h-full object-cover" />
                </div>
              )}

              {images[1] && (
                <div className="w-full sm:w-[50%] aspect-[16/9] overflow-hidden cursor-pointer"
                  onClick={() => { setLightboxIndex(1); setLightboxOpen(true); }}>
                  <img src={images[1].src} alt={images[1].alt} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="w-full sm:w-[20%] flex sm:flex-col gap-2">
                {images[2] && (
                  <div className="w-1/2 sm:w-full aspect-square overflow-hidden cursor-pointer"
                    onClick={() => { setLightboxIndex(2); setLightboxOpen(true); }}>
                    <img src={images[2].src} alt={images[2].alt} className="w-full h-full object-cover" />
                  </div>
                )}
                {images[3] && (
                  <div className="w-1/2 sm:w-full aspect-square overflow-hidden cursor-pointer"
                    onClick={() => { setLightboxIndex(3); setLightboxOpen(true); }}>
                    <img src={images[3].src} alt={images[3].alt} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {images[4] && (
                <div className="w-full sm:w-[29%] aspect-[3/4] overflow-hidden cursor-pointer"
                  onClick={() => { setLightboxIndex(4); setLightboxOpen(true); }}>
                  <img src={images[4].src} alt={images[4].alt} className="w-full h-full object-cover" />
                </div>
              )}

              {images[5] && (
                <div className="w-full sm:w-[71%] aspect-[21/9] overflow-hidden cursor-pointer"
                  onClick={() => { setLightboxIndex(5); setLightboxOpen(true); }}>
                  <img src={images[5].src} alt={images[5].alt} className="w-full h-full object-cover" />
                </div>
              )}
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

