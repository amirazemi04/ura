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
                fields.img1, fields.img2, fields.img3, fields.img4, fields.img5, fields.img6,
                fields.img7, fields.img8, fields.img9, fields.img10, fields.img11, fields.img12,
                fields.img13, fields.img14, fields.img15, fields.img16, fields.img17, fields.img18,
                fields.img19, fields.img20
              ];

              const images: GalleryImage[] = await Promise.all(
                assets.map(async (asset: any, index: number) => {
                  if (!asset?.sys?.id) return null;
                  try {
                    const assetData = await client.getAsset(asset.sys.id, { locale: DEFAULT_LOCALE });
                    if (!assetData?.fields?.file?.url) return null;
                    return {
                      src: `https:${assetData.fields.file.url}?w=1200&fm=webp`,
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
        setActiveFilter((prev) => (catList.includes(prev) ? prev : catList[0] || ''));
        setImagesByCat(tmp);
      } catch {
        setImagesByCat({});
        setCategories([]);
        setActiveFilter('');
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [i18n.language, t, i18n.isInitialized]);

  const currentCategoryIndex = categories.indexOf(activeFilter);
  const images = imagesByCat[activeFilter] || [];

  if (loading) {
    return null;
  }

  if (!categories.length || !images.length) {
    return null;
  }

  const handleCategoryChange = (index: number) => {
    setActiveFilter(categories[index]);
  };

  return (
    <section className="py-16 bg-white" id="gallery">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header with Category and Pagination Numbers */}
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-12">
            <div className="mb-6 sm:mb-0">
              <h2 className="text-4xl sm:text-5xl font-light text-[#333333] mb-2">
                {activeFilter}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              {categories.map((cat, index) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(index)}
                  className={`text-lg font-light transition-colors duration-200 ${
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
                  onClick={() => handleCategoryChange(currentCategoryIndex + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </Reveal>

        {/* Gallery Grid */}
        <Reveal delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative overflow-hidden bg-gray-100 aspect-[4/3] cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => {
                  setLightboxIndex(index);
                  setLightboxOpen(true);
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={images.map((img) => ({ src: img.src, alt: img.alt }))}
      />
    </section>
  );
}
