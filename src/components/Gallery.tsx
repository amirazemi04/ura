import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import client from '../contentfulClient';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

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

              const assets = [fields.img1, fields.img2, fields.img3, fields.img4, fields.img5, fields.img6];
              
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

  const images = imagesByCat[activeFilter] || [];

  if (loading) {
    return (
      <section className="py-12" id="gallery">
        <div className="text-center">{t('gallery.loading')}</div>
      </section>
    );
  }

  if (!images.length) {
    return (
      <section className="py-12" id="gallery">
        <div className="text-center">{t('gallery.noImages', { category: activeFilter })}</div>
      </section>
    );
  }

  return (
    <section className="py-12" id="gallery">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-10 gap-4">
          <h2 className="text-3xl sm:text-4xl font-thin text-[#333333]">
            {t('header.gallery')}
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`text-base font-medium transition-colors duration-200 ${
                  activeFilter === cat
                    ? 'text-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="space-y-6">
          {/* Row 1 */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {images[0] && (
              <div
                className="w-full sm:w-[30%] overflow-hidden shadow-xl aspect-[3/4] cursor-pointer"
                onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
              >
                <img src={images[0].src} alt={images[0].alt} className="w-full h-full object-cover" />
              </div>
            )}
            {images[1] && (
              <div
                className="w-full sm:w-[50%] overflow-hidden shadow-xl aspect-[16/9] cursor-pointer"
                onClick={() => { setLightboxIndex(1); setLightboxOpen(true); }}
              >
                <img src={images[1].src} alt={images[1].alt} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="w-full sm:w-[20%] flex sm:flex-col gap-4">
              {images[2] && (
                <div
                  className="w-1/2 sm:w-full overflow-hidden shadow-xl aspect-square cursor-pointer"
                  onClick={() => { setLightboxIndex(2); setLightboxOpen(true); }}
                >
                  <img src={images[2].src} alt={images[2].alt} className="w-full h-full object-cover" />
                </div>
              )}
              {images[3] && (
                <div
                  className="w-1/2 sm:w-full overflow-hidden shadow-xl aspect-square cursor-pointer"
                  onClick={() => { setLightboxIndex(3); setLightboxOpen(true); }}
                >
                  <img src={images[3].src} alt={images[3].alt} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {images[4] && (
              <div
                className="w-full sm:w-[29%] max-h-[300px] overflow-hidden shadow-xl aspect-[3/4] cursor-pointer"
                onClick={() => { setLightboxIndex(4); setLightboxOpen(true); }}
              >
                <img src={images[4].src} alt={images[4].alt} className="w-full h-full object-cover" />
              </div>
            )}
            {images[5] && (
              <div
                className="w-full sm:w-[70%] max-h-[300px] overflow-hidden shadow-xl aspect-[21/9] cursor-pointer"
                onClick={() => { setLightboxIndex(5); setLightboxOpen(true); }}
              >
                <img src={images[5].src} alt={images[5].alt} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
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
