import client from '../contentfulClient';
import { Entry, Asset } from 'contentful';

const DEFAULT_LOCALE = 'de';

export const normalizeLocale = (locale: string | undefined): string => {
  if (!locale) return DEFAULT_LOCALE;
  const normalized = locale.substring(0, 2).toLowerCase();
  return ['de', 'sq'].includes(normalized) ? normalized : DEFAULT_LOCALE;
};

export const safeGetEntries = async <T = any>(
  contentType: string,
  locale: string,
  options: any = {}
): Promise<Entry<T>[]> => {
  const normalizedLocale = normalizeLocale(locale);

  try {
    const response = await client.getEntries({
      content_type: contentType,
      locale: normalizedLocale,
      ...options,
    });

    return response.items as Entry<T>[];
  } catch (error) {
    console.error(`Error fetching entries for ${contentType} in ${normalizedLocale}:`, error);

    if (normalizedLocale !== DEFAULT_LOCALE) {
      try {
        console.log(`Falling back to default locale (${DEFAULT_LOCALE})`);
        const fallbackResponse = await client.getEntries({
          content_type: contentType,
          locale: DEFAULT_LOCALE,
          ...options,
        });
        return fallbackResponse.items as Entry<T>[];
      } catch (fallbackError) {
        console.error(`Error fetching entries in fallback locale:`, fallbackError);
      }
    }

    return [];
  }
};

export const safeGetEntry = async <T = any>(
  entryId: string,
  locale: string
): Promise<Entry<T> | null> => {
  const normalizedLocale = normalizeLocale(locale);

  try {
    const entry = await client.getEntry<T>(entryId, { locale: normalizedLocale });
    return entry;
  } catch (error) {
    console.error(`Error fetching entry ${entryId} in ${normalizedLocale}:`, error);

    if (normalizedLocale !== DEFAULT_LOCALE) {
      try {
        console.log(`Falling back to default locale (${DEFAULT_LOCALE})`);
        const fallbackEntry = await client.getEntry<T>(entryId, { locale: DEFAULT_LOCALE });
        return fallbackEntry;
      } catch (fallbackError) {
        console.error(`Error fetching entry in fallback locale:`, fallbackError);
      }
    }

    return null;
  }
};

export const safeGetAsset = async (
  assetId: string,
  locale: string = DEFAULT_LOCALE
): Promise<string> => {
  if (!assetId) return '';

  try {
    const asset = await client.getAsset(assetId, { locale: DEFAULT_LOCALE });
    return asset?.fields?.file?.url ? `https:${asset.fields.file.url}` : '';
  } catch (error) {
    console.error(`Error fetching asset ${assetId}:`, error);
    return '';
  }
};

export const safeGetAssetFromReference = async (
  assetRef: any,
  locale: string = DEFAULT_LOCALE
): Promise<string> => {
  if (!assetRef?.sys?.id) return '';
  return safeGetAsset(assetRef.sys.id, locale);
};

export const safeGetField = <T = any>(
  fields: any,
  fieldName: string,
  defaultValue: T
): T => {
  try {
    const value = fields?.[fieldName];
    return value !== undefined && value !== null ? value : defaultValue;
  } catch (error) {
    console.error(`Error accessing field ${fieldName}:`, error);
    return defaultValue;
  }
};

export const processAssetArray = async (
  assets: any[],
  locale: string = DEFAULT_LOCALE
): Promise<string[]> => {
  if (!Array.isArray(assets)) return [];

  const urls = await Promise.all(
    assets.map(async (asset) => {
      if (!asset?.sys?.id) return '';
      return safeGetAsset(asset.sys.id, locale);
    })
  );

  return urls.filter(Boolean);
};
