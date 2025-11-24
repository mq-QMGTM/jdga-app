// IndexedDB Storage Layer for JDGA App
// Using local-db-storage for simplified IndexedDB access

import localDB from 'local-db-storage';

// Storage keys with jdga namespace
export const STORAGE_KEYS = {
  // Master course database
  COURSES: 'jdga_courses',
  // User's course records (played, scores, favorites, etc.)
  USER_COURSES: 'jdga_user_courses',
  // Scorecards
  SCORECARDS: 'jdga_scorecards',
  // Golf buddy contacts
  CONTACTS: 'jdga_contacts',
  // User's club memberships
  MEMBERSHIPS: 'jdga_memberships',
  // Favorite holes (global ranking)
  FAVORITE_HOLES: 'jdga_favorite_holes',
  // Golf trips
  TRIPS: 'jdga_trips',
  // Tournament/major results
  TOURNAMENT_RESULTS: 'jdga_tournament_results',
  // Future tournament hosts
  FUTURE_HOSTS: 'jdga_future_hosts',
  // User settings
  SETTINGS: 'jdga_settings',
  // Scorecard images
  SCORECARD_IMAGES: 'jdga_scorecard_images',
  // Contact photos
  CONTACT_PHOTOS: 'jdga_contact_photos',
} as const;

// Generic storage functions

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const data = await localDB.getItem(key);
    return data as T | null;
  } catch (error) {
    console.error(`Error getting item ${key}:`, error);
    return null;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await localDB.setItem(key, value);
  } catch (error) {
    console.error(`Error setting item ${key}:`, error);
    throw error;
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await localDB.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key}:`, error);
    throw error;
  }
}

// Helper to get array data with default empty array
export async function getArrayData<T>(key: string): Promise<T[]> {
  const data = await getItem<T[]>(key);
  return data || [];
}

// Helper to update a single item in an array by ID
export async function updateArrayItem<T extends { id: string }>(
  key: string,
  id: string,
  updates: Partial<T>
): Promise<T | null> {
  const items = await getArrayData<T>(key);
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) return null;

  const updatedItem = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
  items[index] = updatedItem;
  await setItem(key, items);

  return updatedItem;
}

// Helper to add item to array
export async function addArrayItem<T extends { id: string }>(key: string, item: T): Promise<void> {
  const items = await getArrayData<T>(key);
  items.push(item);
  await setItem(key, items);
}

// Helper to remove item from array by ID
export async function removeArrayItem<T extends { id: string }>(
  key: string,
  id: string
): Promise<boolean> {
  const items = await getArrayData<T>(key);
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) return false;

  items.splice(index, 1);
  await setItem(key, items);
  return true;
}

// Helper to find item in array by ID
export async function findArrayItem<T extends { id: string }>(
  key: string,
  id: string
): Promise<T | null> {
  const items = await getArrayData<T>(key);
  return items.find((item) => item.id === id) || null;
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Clear all JDGA data (for debugging/reset)
export async function clearAllData(): Promise<void> {
  const keys = Object.values(STORAGE_KEYS);
  for (const key of keys) {
    await removeItem(key);
  }
}

// Export data for backup
export async function exportAllData(): Promise<Record<string, unknown>> {
  const data: Record<string, unknown> = {};
  const keys = Object.values(STORAGE_KEYS);

  for (const key of keys) {
    data[key] = await getItem(key);
  }

  return data;
}

// Import data from backup
export async function importAllData(data: Record<string, unknown>): Promise<void> {
  for (const [key, value] of Object.entries(data)) {
    if (Object.values(STORAGE_KEYS).includes(key as (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS])) {
      await setItem(key, value);
    }
  }
}
