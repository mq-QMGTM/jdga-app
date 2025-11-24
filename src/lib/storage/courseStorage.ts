// Course-specific storage operations

import type { Course, UserCourseRecord, FavoriteHole, MerchItem } from '@/types';
import {
  STORAGE_KEYS,
  getArrayData,
  setItem,
  findArrayItem,
  addArrayItem,
  updateArrayItem,
  removeArrayItem,
  generateId,
} from './db';

// ============ Master Course Database ============

export async function getAllCourses(): Promise<Course[]> {
  return getArrayData<Course>(STORAGE_KEYS.COURSES);
}

export async function getCourseById(id: string): Promise<Course | null> {
  return findArrayItem<Course>(STORAGE_KEYS.COURSES, id);
}

export async function getTopUSCourses(limit?: number): Promise<Course[]> {
  const courses = await getAllCourses();
  const usCourses = courses
    .filter((c) => c.country === 'USA' && c.usRanking)
    .sort((a, b) => (a.usRanking || 999) - (b.usRanking || 999));

  return limit ? usCourses.slice(0, limit) : usCourses;
}

export async function getCoursesByContinent(continent: string): Promise<Course[]> {
  const courses = await getAllCourses();
  return courses.filter((c) => c.continent === continent);
}

export async function getCoursesByState(state: string): Promise<Course[]> {
  const courses = await getAllCourses();
  return courses.filter((c) => c.state === state);
}

export async function getCoursesByDesigner(designer: string): Promise<Course[]> {
  const courses = await getAllCourses();
  return courses.filter(
    (c) =>
      c.designer.toLowerCase().includes(designer.toLowerCase()) ||
      c.coDesigners?.some((d) => d.toLowerCase().includes(designer.toLowerCase()))
  );
}

export async function getCoursesByType(type: Course['courseType']): Promise<Course[]> {
  const courses = await getAllCourses();
  return courses.filter((c) => c.courseType === type);
}

export async function searchCourses(query: string): Promise<Course[]> {
  const courses = await getAllCourses();
  const lowerQuery = query.toLowerCase();

  return courses.filter(
    (c) =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.clubName.toLowerCase().includes(lowerQuery) ||
      c.city.toLowerCase().includes(lowerQuery) ||
      c.state.toLowerCase().includes(lowerQuery) ||
      c.designer.toLowerCase().includes(lowerQuery)
  );
}

// Initialize courses from bundled data
export async function initializeCourses(courses: Course[]): Promise<void> {
  await setItem(STORAGE_KEYS.COURSES, courses);
}

// ============ User Course Records ============

export async function getAllUserCourseRecords(): Promise<UserCourseRecord[]> {
  return getArrayData<UserCourseRecord>(STORAGE_KEYS.USER_COURSES);
}

export async function getUserCourseRecord(courseId: string): Promise<UserCourseRecord | null> {
  const records = await getAllUserCourseRecords();
  return records.find((r) => r.courseId === courseId) || null;
}

export async function getPlayedCourses(): Promise<UserCourseRecord[]> {
  const records = await getAllUserCourseRecords();
  return records.filter((r) => r.hasPlayed);
}

export async function markCourseAsPlayed(
  courseId: string,
  initialData?: Partial<UserCourseRecord>
): Promise<UserCourseRecord> {
  const existing = await getUserCourseRecord(courseId);
  const now = new Date().toISOString();

  if (existing) {
    const updated = await updateArrayItem<UserCourseRecord>(
      STORAGE_KEYS.USER_COURSES,
      existing.id,
      {
        hasPlayed: true,
        timesPlayed: (existing.timesPlayed || 0) + 1,
        lastPlayedDate: initialData?.lastPlayedDate || now,
        ...initialData,
      }
    );
    return updated!;
  }

  const newRecord: UserCourseRecord = {
    id: generateId(),
    courseId,
    hasPlayed: true,
    timesPlayed: 1,
    estimatedTimesPlayed: false,
    desiredFrequency: 'none',
    playingPartners: [],
    knownMembers: [],
    favoriteHoleNumbers: [],
    merchWishlist: [],
    createdAt: now,
    updatedAt: now,
    ...initialData,
  };

  await addArrayItem(STORAGE_KEYS.USER_COURSES, newRecord);
  return newRecord;
}

export async function updateUserCourseRecord(
  courseId: string,
  updates: Partial<UserCourseRecord>
): Promise<UserCourseRecord | null> {
  const existing = await getUserCourseRecord(courseId);
  if (!existing) return null;

  return updateArrayItem<UserCourseRecord>(STORAGE_KEYS.USER_COURSES, existing.id, updates);
}

export async function updateBestScore(courseId: string, score: number): Promise<void> {
  const existing = await getUserCourseRecord(courseId);

  if (existing) {
    if (!existing.bestScore || score < existing.bestScore) {
      await updateArrayItem<UserCourseRecord>(STORAGE_KEYS.USER_COURSES, existing.id, {
        bestScore: score,
      });
    }
  } else {
    await markCourseAsPlayed(courseId, { bestScore: score });
  }
}

// ============ Favorite Holes ============

export async function getAllFavoriteHoles(): Promise<FavoriteHole[]> {
  const holes = await getArrayData<FavoriteHole>(STORAGE_KEYS.FAVORITE_HOLES);
  return holes.sort((a, b) => a.globalRank - b.globalRank);
}

export async function addFavoriteHole(
  courseId: string,
  courseName: string,
  holeNumber: number,
  notes?: string
): Promise<FavoriteHole> {
  const holes = await getAllFavoriteHoles();
  const newRank = holes.length + 1;

  const newHole: FavoriteHole = {
    id: generateId(),
    courseId,
    courseName,
    holeNumber,
    globalRank: newRank,
    notes,
  };

  await addArrayItem(STORAGE_KEYS.FAVORITE_HOLES, newHole);
  return newHole;
}

export async function updateFavoriteHoleRank(id: string, newRank: number): Promise<void> {
  const holes = await getAllFavoriteHoles();
  const holeIndex = holes.findIndex((h) => h.id === id);
  if (holeIndex === -1) return;

  const hole = holes[holeIndex];
  const oldRank = hole.globalRank;

  // Update ranks of affected holes
  holes.forEach((h) => {
    if (h.id === id) {
      h.globalRank = newRank;
    } else if (oldRank < newRank && h.globalRank > oldRank && h.globalRank <= newRank) {
      h.globalRank--;
    } else if (oldRank > newRank && h.globalRank >= newRank && h.globalRank < oldRank) {
      h.globalRank++;
    }
  });

  await setItem(STORAGE_KEYS.FAVORITE_HOLES, holes);
}

export async function removeFavoriteHole(id: string): Promise<void> {
  await removeArrayItem<FavoriteHole>(STORAGE_KEYS.FAVORITE_HOLES, id);

  // Re-rank remaining holes
  const holes = await getAllFavoriteHoles();
  holes.forEach((h, index) => {
    h.globalRank = index + 1;
  });
  await setItem(STORAGE_KEYS.FAVORITE_HOLES, holes);
}

// ============ Merch Wishlist ============

export async function addMerchItem(
  courseId: string,
  item: Omit<MerchItem, 'id'>
): Promise<MerchItem> {
  const record = await getUserCourseRecord(courseId);
  const newItem: MerchItem = {
    ...item,
    id: generateId(),
  };

  if (record) {
    const updatedWishlist = [...record.merchWishlist, newItem];
    await updateArrayItem<UserCourseRecord>(STORAGE_KEYS.USER_COURSES, record.id, {
      merchWishlist: updatedWishlist,
    });
  } else {
    // Create a record for this course with just the merch item
    const now = new Date().toISOString();
    const newRecord: UserCourseRecord = {
      id: generateId(),
      courseId,
      hasPlayed: false,
      timesPlayed: 0,
      estimatedTimesPlayed: false,
      desiredFrequency: 'none',
      playingPartners: [],
      knownMembers: [],
      favoriteHoleNumbers: [],
      merchWishlist: [newItem],
      createdAt: now,
      updatedAt: now,
    };
    await addArrayItem(STORAGE_KEYS.USER_COURSES, newRecord);
  }

  return newItem;
}

export async function markMerchPurchased(courseId: string, itemId: string): Promise<void> {
  const record = await getUserCourseRecord(courseId);
  if (!record) return;

  const updatedWishlist = record.merchWishlist.map((item) =>
    item.id === itemId ? { ...item, purchased: true } : item
  );

  await updateArrayItem<UserCourseRecord>(STORAGE_KEYS.USER_COURSES, record.id, {
    merchWishlist: updatedWishlist,
  });
}
