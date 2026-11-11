/**
 * IndexedDB storage utility for custom images & voice recordings in Zaheen portal
 */

const DB_NAME = 'zaheen_custom_media_db';
const STORE_NAME = 'media_store';
const DB_VERSION = 1;

export interface CustomMediaItem {
  id: string; // e.g. 'q_eng-let-1', 'item_apple', 'item_billi'
  title: string;
  customImageUrl?: string; // Data URL or external link
  customAudioUrl?: string; // Data URL (audio/webm or audio/mp3)
  updatedAt: number;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** Get all custom media entries */
export async function getAllCustomMedia(): Promise<Record<string, CustomMediaItem>> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const list: CustomMediaItem[] = request.result || [];
        const map: Record<string, CustomMediaItem> = {};
        list.forEach((item) => {
          map[item.id] = item;
        });
        resolve(map);
      };

      request.onerror = () => reject(request.error);
    });
  } catch {
    // Fallback to localStorage if IndexedDB fails
    try {
      const raw = localStorage.getItem('zaheen_custom_media_fallback');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }
}

/** Save or update custom media for a question or item */
export async function saveCustomMedia(
  id: string,
  data: { title: string; customImageUrl?: string; customAudioUrl?: string }
): Promise<void> {
  const item: CustomMediaItem = {
    id,
    title: data.title,
    customImageUrl: data.customImageUrl,
    customAudioUrl: data.customAudioUrl,
    updatedAt: Date.now(),
  };

  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    try {
      const raw = localStorage.getItem('zaheen_custom_media_fallback');
      const map = raw ? JSON.parse(raw) : {};
      map[id] = item;
      localStorage.setItem('zaheen_custom_media_fallback', JSON.stringify(map));
    } catch {
      // Storage error
    }
  }
}

/** Remove custom media for an id */
export async function deleteCustomMedia(id: string): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    try {
      const raw = localStorage.getItem('zaheen_custom_media_fallback');
      if (raw) {
        const map = JSON.parse(raw);
        delete map[id];
        localStorage.setItem('zaheen_custom_media_fallback', JSON.stringify(map));
      }
    } catch {
      // Ignore
    }
  }
}

/** Reset all custom media back to factory defaults */
export async function clearAllCustomMedia(): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    localStorage.removeItem('zaheen_custom_media_fallback');
  }
}
