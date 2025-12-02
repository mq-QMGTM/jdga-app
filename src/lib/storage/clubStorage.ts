// Club-specific storage operations

import type { Club, UserClubRecord } from '@/types';
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

// ============ Master Club Database ============

export async function getAllClubs(): Promise<Club[]> {
  return getArrayData<Club>(STORAGE_KEYS.CLUBS);
}

export async function getClubById(id: string): Promise<Club | null> {
  return findArrayItem<Club>(STORAGE_KEYS.CLUBS, id);
}

export async function getClubsByState(state: string): Promise<Club[]> {
  const clubs = await getAllClubs();
  return clubs.filter((c) => c.state === state);
}

export async function getClubsByType(type: Club['courseType']): Promise<Club[]> {
  const clubs = await getAllClubs();
  return clubs.filter((c) => c.courseType === type);
}

export async function searchClubs(query: string): Promise<Club[]> {
  const clubs = await getAllClubs();
  const lowerQuery = query.toLowerCase();

  return clubs.filter(
    (c) =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.city.toLowerCase().includes(lowerQuery) ||
      c.state.toLowerCase().includes(lowerQuery)
  );
}

// Initialize clubs from bundled data
export async function initializeClubs(clubs: Club[]): Promise<void> {
  await setItem(STORAGE_KEYS.CLUBS, clubs);
}

// Add a new club
export async function addClub(club: Omit<Club, 'id' | 'createdAt' | 'updatedAt'>): Promise<Club> {
  const now = new Date().toISOString();
  const newClub: Club = {
    ...club,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  await addArrayItem(STORAGE_KEYS.CLUBS, newClub);
  return newClub;
}

// Update a club
export async function updateClub(id: string, updates: Partial<Club>): Promise<Club | null> {
  return updateArrayItem<Club>(STORAGE_KEYS.CLUBS, id, updates);
}

// Delete a club
export async function deleteClub(id: string): Promise<boolean> {
  return removeArrayItem<Club>(STORAGE_KEYS.CLUBS, id);
}

// ============ User Club Records ============

export async function getAllUserClubRecords(): Promise<UserClubRecord[]> {
  return getArrayData<UserClubRecord>(STORAGE_KEYS.USER_CLUBS);
}

export async function getUserClubRecord(clubId: string): Promise<UserClubRecord | null> {
  const records = await getAllUserClubRecords();
  return records.find((r) => r.clubId === clubId) || null;
}

export async function createUserClubRecord(
  clubId: string,
  initialData?: Partial<UserClubRecord>
): Promise<UserClubRecord> {
  const existing = await getUserClubRecord(clubId);
  if (existing) return existing;

  const now = new Date().toISOString();
  const newRecord: UserClubRecord = {
    id: generateId(),
    clubId,
    knownMembers: [],
    createdAt: now,
    updatedAt: now,
    ...initialData,
  };

  await addArrayItem(STORAGE_KEYS.USER_CLUBS, newRecord);
  return newRecord;
}

export async function updateUserClubRecord(
  clubId: string,
  updates: Partial<UserClubRecord>
): Promise<UserClubRecord | null> {
  const existing = await getUserClubRecord(clubId);
  if (!existing) {
    // Create if doesn't exist
    return createUserClubRecord(clubId, updates);
  }

  return updateArrayItem<UserClubRecord>(STORAGE_KEYS.USER_CLUBS, existing.id, updates);
}

export async function deleteUserClubRecord(clubId: string): Promise<boolean> {
  const existing = await getUserClubRecord(clubId);
  if (!existing) return false;

  return removeArrayItem<UserClubRecord>(STORAGE_KEYS.USER_CLUBS, existing.id);
}

// ============ Member Management ============

export async function addKnownMember(clubId: string, contactId: string): Promise<void> {
  const record = await getUserClubRecord(clubId);

  if (record) {
    const knownMembers = record.knownMembers || [];
    if (!knownMembers.includes(contactId)) {
      await updateUserClubRecord(clubId, {
        knownMembers: [...knownMembers, contactId],
      });
    }
  } else {
    await createUserClubRecord(clubId, {
      knownMembers: [contactId],
    });
  }
}

export async function removeKnownMember(clubId: string, contactId: string): Promise<void> {
  const record = await getUserClubRecord(clubId);
  if (!record) return;

  const knownMembers = record.knownMembers.filter((id) => id !== contactId);
  await updateUserClubRecord(clubId, { knownMembers });
}

export async function getKnownMembersForClub(clubId: string): Promise<string[]> {
  const record = await getUserClubRecord(clubId);
  return record?.knownMembers || [];
}
