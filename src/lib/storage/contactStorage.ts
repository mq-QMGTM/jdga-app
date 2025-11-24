// Golf Buddy Contact storage operations

import type { GolfBuddy, CoursePlayRecord, MemberConnection } from '@/types';
import {
  STORAGE_KEYS,
  getArrayData,
  setItem,
  findArrayItem,
  addArrayItem,
  updateArrayItem,
  removeArrayItem,
  generateId,
  getItem,
} from './db';

// ============ Golf Buddy CRUD ============

export async function getAllContacts(): Promise<GolfBuddy[]> {
  return getArrayData<GolfBuddy>(STORAGE_KEYS.CONTACTS);
}

export async function getContactById(id: string): Promise<GolfBuddy | null> {
  return findArrayItem<GolfBuddy>(STORAGE_KEYS.CONTACTS, id);
}

export async function createContact(
  contactData: Omit<GolfBuddy, 'id' | 'createdAt' | 'updatedAt'>
): Promise<GolfBuddy> {
  const now = new Date().toISOString();
  const newContact: GolfBuddy = {
    ...contactData,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };

  await addArrayItem(STORAGE_KEYS.CONTACTS, newContact);
  return newContact;
}

export async function updateContact(
  id: string,
  updates: Partial<GolfBuddy>
): Promise<GolfBuddy | null> {
  return updateArrayItem<GolfBuddy>(STORAGE_KEYS.CONTACTS, id, updates);
}

export async function deleteContact(id: string): Promise<boolean> {
  // Also delete their photo
  await deleteContactPhoto(id);
  return removeArrayItem<GolfBuddy>(STORAGE_KEYS.CONTACTS, id);
}

// ============ Contact Queries ============

export async function getContactsByCity(city: string): Promise<GolfBuddy[]> {
  const contacts = await getAllContacts();
  return contacts.filter((c) => c.homeCity.toLowerCase() === city.toLowerCase());
}

export async function getContactsByState(state: string): Promise<GolfBuddy[]> {
  const contacts = await getAllContacts();
  return contacts.filter((c) => c.homeState.toLowerCase() === state.toLowerCase());
}

export async function getContactsWhoAreMembersAt(courseId: string): Promise<GolfBuddy[]> {
  const contacts = await getAllContacts();
  return contacts.filter((c) => c.memberClubs.includes(courseId));
}

export async function getContactsWhoKnowMembersAt(courseId: string): Promise<GolfBuddy[]> {
  const contacts = await getAllContacts();
  return contacts.filter((c) => c.knowsMemberAt.some((m) => m.courseId === courseId));
}

export async function getContactsPlayedWith(): Promise<GolfBuddy[]> {
  const contacts = await getAllContacts();
  return contacts.filter((c) => c.hasPlayedWith);
}

export async function getContactsWouldPlayWith(): Promise<GolfBuddy[]> {
  const contacts = await getAllContacts();
  return contacts.filter((c) => c.wouldPlayWith && !c.hasPlayedWith);
}

export async function searchContacts(query: string): Promise<GolfBuddy[]> {
  const contacts = await getAllContacts();
  const lowerQuery = query.toLowerCase();

  return contacts.filter(
    (c) =>
      c.firstName.toLowerCase().includes(lowerQuery) ||
      c.lastName.toLowerCase().includes(lowerQuery) ||
      c.nickname?.toLowerCase().includes(lowerQuery) ||
      c.homeCity.toLowerCase().includes(lowerQuery)
  );
}

// ============ Contact-Course Relationships ============

export async function addCoursePlayedTogether(
  contactId: string,
  record: CoursePlayRecord
): Promise<void> {
  const contact = await getContactById(contactId);
  if (!contact) return;

  const updatedRecords = [...contact.coursesPlayedTogether, record];
  await updateContact(contactId, {
    coursesPlayedTogether: updatedRecords,
    hasPlayedWith: true,
  });
}

export async function addMemberConnection(
  contactId: string,
  connection: MemberConnection
): Promise<void> {
  const contact = await getContactById(contactId);
  if (!contact) return;

  const updatedConnections = [...contact.knowsMemberAt, connection];
  await updateContact(contactId, { knowsMemberAt: updatedConnections });
}

export async function addMembership(contactId: string, courseId: string): Promise<void> {
  const contact = await getContactById(contactId);
  if (!contact) return;

  if (!contact.memberClubs.includes(courseId)) {
    const updatedClubs = [...contact.memberClubs, courseId];
    await updateContact(contactId, { memberClubs: updatedClubs });
  }
}

export async function removeMembership(contactId: string, courseId: string): Promise<void> {
  const contact = await getContactById(contactId);
  if (!contact) return;

  const updatedClubs = contact.memberClubs.filter((id) => id !== courseId);
  await updateContact(contactId, { memberClubs: updatedClubs });
}

// ============ Suggested Playing Partners ============

// Get contacts who might be good playing partners for a course
// Based on: proximity to course, membership, or knowing members
export async function getSuggestedPartnersForCourse(
  courseCity: string,
  courseState: string,
  courseId: string
): Promise<GolfBuddy[]> {
  const contacts = await getAllContacts();

  return contacts.filter((c) => {
    // Member at this course
    if (c.memberClubs.includes(courseId)) return true;

    // Knows a member at this course
    if (c.knowsMemberAt.some((m) => m.courseId === courseId)) return true;

    // Lives in the same city or state
    if (
      c.homeCity.toLowerCase() === courseCity.toLowerCase() ||
      c.homeState.toLowerCase() === courseState.toLowerCase()
    ) {
      return true;
    }

    return false;
  });
}

// ============ Contact Photos ============

export async function saveContactPhoto(contactId: string, photoData: string): Promise<void> {
  const photos = (await getItem<Record<string, string>>(STORAGE_KEYS.CONTACT_PHOTOS)) || {};
  photos[contactId] = photoData;
  await setItem(STORAGE_KEYS.CONTACT_PHOTOS, photos);
}

export async function getContactPhoto(contactId: string): Promise<string | null> {
  const photos = await getItem<Record<string, string>>(STORAGE_KEYS.CONTACT_PHOTOS);
  return photos?.[contactId] || null;
}

export async function deleteContactPhoto(contactId: string): Promise<void> {
  const photos = (await getItem<Record<string, string>>(STORAGE_KEYS.CONTACT_PHOTOS)) || {};
  delete photos[contactId];
  await setItem(STORAGE_KEYS.CONTACT_PHOTOS, photos);
}

// ============ Statistics ============

export async function getContactStats(): Promise<{
  total: number;
  playedWith: number;
  wouldPlayWith: number;
  members: number;
  bySkillLevel: Record<string, number>;
  byFrequency: Record<string, number>;
}> {
  const contacts = await getAllContacts();

  const stats = {
    total: contacts.length,
    playedWith: contacts.filter((c) => c.hasPlayedWith).length,
    wouldPlayWith: contacts.filter((c) => c.wouldPlayWith && !c.hasPlayedWith).length,
    members: contacts.filter((c) => c.memberClubs.length > 0).length,
    bySkillLevel: {
      recreational: contacts.filter((c) => c.skillLevel === 'recreational').length,
      intermediate: contacts.filter((c) => c.skillLevel === 'intermediate').length,
      advanced: contacts.filter((c) => c.skillLevel === 'advanced').length,
    },
    byFrequency: {
      occasional: contacts.filter((c) => c.playFrequency === 'occasional').length,
      regular: contacts.filter((c) => c.playFrequency === 'regular').length,
      avid: contacts.filter((c) => c.playFrequency === 'avid').length,
    },
  };

  return stats;
}
