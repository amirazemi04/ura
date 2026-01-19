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

        <Reveal delay={0.2}>
  <div className="grid grid-cols-4 auto-rows-[140px] gap-3">

    {images.map((image, index) => {
      let span = '';

      // ROW 1
      if (index === 0) span = 'row-span-3';              // Left tall
      if (index === 1) span = 'col-span-2 row-span-4';   // Middle BIG 2x2+
      if (index === 2) span = 'row-span-2';              // Right top
      if (index === 3) span = 'row-span-2';              // Right bottom

      // ROW 2
      if (index === 4) span = 'row-span-2';              // Left shorter than first
      if (index === 5) span = 'col-span-2 row-span-2';   // Wide but not tall
      if (index === 6) span = 'row-span-1';
      if (index === 7) span = 'row-span-1';

      // ROW 3 (optional continuation)
      if (index === 8) span = 'row-span-3';
      if (index === 9) span = 'col-span-2 row-span-4';
      if (index === 10) span = 'row-span-2';
      if (index === 11) span = 'row-span-2';

      return (
        <div
          key={index}
          onClick={() => {
            setLightboxIndex(index);
            setLightboxOpen(true);
          }}
          className={`relative overflow-hidden cursor-pointer ${span}`}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      );
    })}

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
