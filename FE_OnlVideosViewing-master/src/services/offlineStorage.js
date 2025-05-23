import { openDB } from 'idb';

const DB_NAME = 'videoOfflineDB';
const STORE_NAME = 'videos';
const DB_VERSION = 1;

const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'videoId' });
      }
    },
  });
};

export const saveVideoOffline = async (videoId, videoBlob, metadata) => {
  try {
    const db = await initDB();
    await db.put(STORE_NAME, {
      videoId,
      videoBlob,
      metadata,
      downloadedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Error saving video offline:', error);
    return false;
  }
};

export const getOfflineVideo = async (videoId) => {
  try {
    const db = await initDB();
    return await db.get(STORE_NAME, videoId);
  } catch (error) {
    console.error('Error getting offline video:', error);
    return null;
  }
};

export const getAllOfflineVideos = async () => {
  try {
    const db = await initDB();
    return await db.getAll(STORE_NAME);
  } catch (error) {
    console.error('Error getting all offline videos:', error);
    return [];
  }
};

export const deleteOfflineVideo = async (videoId) => {
  try {
    const db = await initDB();
    await db.delete(STORE_NAME, videoId);
    return true;
  } catch (error) {
    console.error('Error deleting offline video:', error);
    return false;
  }
};

export const isVideoOffline = async (videoId) => {
  try {
    const db = await initDB();
    const video = await db.get(STORE_NAME, videoId);
    return !!video;
  } catch (error) {
    console.error('Error checking if video is offline:', error);
    return false;
  }
}; 