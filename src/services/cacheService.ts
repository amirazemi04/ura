const PREFIX = 'contentful_cache__';

const getItem = (key: string): any | null => {
  try {
    const raw = localStorage.getItem(`${PREFIX}${key}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const setItem = (key: string, value: any): void => {
  try {
    localStorage.setItem(
      `${PREFIX}${key}`,
      JSON.stringify({ ...value, syncedAt: new Date().toISOString() })
    );
  } catch {
    // storage full or unavailable
  }
};

export const getCachedEntries = async (
  contentType: string,
  locale: string
): Promise<any[] | null> => {
  const data = getItem(`entries__${contentType}__${locale}`);
  return data?.items ?? null;
};

export const setCachedEntries = async (
  contentType: string,
  locale: string,
  items: any[]
): Promise<void> => {
  setItem(`entries__${contentType}__${locale}`, { items });
};

export const getCachedEntry = async (
  entryId: string,
  locale: string
): Promise<any | null> => {
  const data = getItem(`entry__${entryId}__${locale}`);
  return data?.data ?? null;
};

export const setCachedEntry = async (
  entryId: string,
  locale: string,
  data: any
): Promise<void> => {
  setItem(`entry__${entryId}__${locale}`, { data });
};

export const getCachedAssetUrl = async (
  assetId: string
): Promise<string | null> => {
  const data = getItem(`asset__${assetId}`);
  return data?.url ?? null;
};

export const setCachedAssetUrl = async (
  assetId: string,
  url: string
): Promise<void> => {
  setItem(`asset__${assetId}`, { url });
};
