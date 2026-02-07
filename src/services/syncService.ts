import client from '../contentfulClient';
import {
  setCachedEntries,
  setCachedEntry,
  setCachedAssetUrl,
} from './cacheService';

const CONTENT_TYPES = [
  'teksti',
  'sponsors',
  'faqs',
  'galleryBlock',
  'imazhetEwebit',
  'ura',
  'teamMember',
  'partner',
  'about',
  'privacyPolicy',
  'termsService',
];

const LOCALES = ['de', 'sq'];

const extractAssets = (obj: any, assets: Map<string, string>): void => {
  if (!obj || typeof obj !== 'object') return;

  if (obj.sys?.type === 'Asset' && obj.fields?.file?.url) {
    const raw = obj.fields.file.url as string;
    assets.set(obj.sys.id, raw.startsWith('//') ? `https:${raw}` : raw);
    return;
  }

  const values = Array.isArray(obj) ? obj : Object.values(obj);
  values.forEach((v) => extractAssets(v, assets));
};

export const syncAllContent = async (
  onProgress?: (msg: string) => void
): Promise<void> => {
  const log = (msg: string) => onProgress?.(msg);
  const allAssets = new Map<string, string>();

  for (const contentType of CONTENT_TYPES) {
    for (const locale of LOCALES) {
      try {
        log(`Syncing ${contentType} (${locale})...`);
        const response = await client.getEntries({
          content_type: contentType,
          locale,
          include: 10,
          limit: 1000,
        });

        const items = JSON.parse(JSON.stringify(response.items));
        await setCachedEntries(contentType, locale, items);

        for (const entry of items) {
          await setCachedEntry(entry.sys.id, locale, entry);
          extractAssets(entry, allAssets);
        }

        log(`  Done ${contentType} (${locale}): ${items.length} entries`);
      } catch (error: any) {
        log(`  Failed ${contentType} (${locale}): ${error?.message ?? error}`);
      }
    }
  }

  log('Caching extracted assets...');
  for (const [id, url] of allAssets) {
    await setCachedAssetUrl(id, url);
  }
  log(`Cached ${allAssets.size} assets from entries`);

  for (const locale of LOCALES) {
    try {
      log(`Fetching all assets (${locale})...`);
      const assets = await client.getAssets({ locale, limit: 1000 });
      for (const asset of assets.items) {
        if (asset.fields?.file?.url) {
          const raw = asset.fields.file.url as string;
          await setCachedAssetUrl(
            asset.sys.id,
            raw.startsWith('//') ? `https:${raw}` : raw
          );
        }
      }
      log(`  Done all assets (${locale}): ${assets.items.length}`);
    } catch (error: any) {
      log(`  Failed assets (${locale}): ${error?.message ?? error}`);
    }
  }

  log('\nSync complete!');
};
