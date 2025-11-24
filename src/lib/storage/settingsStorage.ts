// User settings storage operations

import type { UserSettings, UserMembership, GolfTrip } from '@/types';
import {
  STORAGE_KEYS,
  getItem,
  setItem,
  getArrayData,
  addArrayItem,
  updateArrayItem,
  removeArrayItem,
  findArrayItem,
  generateId,
} from './db';

// ============ User Settings ============

const DEFAULT_SETTINGS: UserSettings = {
  preferredUnits: 'imperial',
  theme: 'system',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export async function getSettings(): Promise<UserSettings> {
  const settings = await getItem<UserSettings>(STORAGE_KEYS.SETTINGS);
  return settings || DEFAULT_SETTINGS;
}

export async function updateSettings(updates: Partial<UserSettings>): Promise<UserSettings> {
  const current = await getSettings();
  const updated: UserSettings = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await setItem(STORAGE_KEYS.SETTINGS, updated);
  return updated;
}

export async function setHomeAirport(
  code: string,
  name: string,
  city: string,
  state: string
): Promise<void> {
  await updateSettings({
    homeAirportCode: code,
    homeAirportName: name,
    homeCity: city,
    homeState: state,
  });
}

// ============ User Memberships ============

export async function getAllMemberships(): Promise<UserMembership[]> {
  return getArrayData<UserMembership>(STORAGE_KEYS.MEMBERSHIPS);
}

export async function getMembershipById(id: string): Promise<UserMembership | null> {
  return findArrayItem<UserMembership>(STORAGE_KEYS.MEMBERSHIPS, id);
}

export async function getMembershipByCourse(courseId: string): Promise<UserMembership | null> {
  const memberships = await getAllMemberships();
  return memberships.find((m) => m.courseId === courseId) || null;
}

export async function createMembership(
  data: Omit<UserMembership, 'id' | 'createdAt' | 'updatedAt' | 'guestHistory' | 'sponsoredGuests'>
): Promise<UserMembership> {
  const now = new Date().toISOString();
  const membership: UserMembership = {
    ...data,
    id: generateId(),
    guestHistory: [],
    sponsoredGuests: [],
    createdAt: now,
    updatedAt: now,
  };

  await addArrayItem(STORAGE_KEYS.MEMBERSHIPS, membership);
  return membership;
}

export async function updateMembership(
  id: string,
  updates: Partial<UserMembership>
): Promise<UserMembership | null> {
  return updateArrayItem<UserMembership>(STORAGE_KEYS.MEMBERSHIPS, id, updates);
}

export async function deleteMembership(id: string): Promise<boolean> {
  return removeArrayItem<UserMembership>(STORAGE_KEYS.MEMBERSHIPS, id);
}

// Guest management
export async function addGuestToMembership(
  membershipId: string,
  guest: Omit<UserMembership['guestHistory'][0], 'id'>
): Promise<void> {
  const membership = await getMembershipById(membershipId);
  if (!membership) return;

  const newGuest = { ...guest, id: generateId() };
  await updateMembership(membershipId, {
    guestHistory: [...membership.guestHistory, newGuest],
  });
}

export async function addSponsoredGuest(
  membershipId: string,
  guest: Omit<UserMembership['sponsoredGuests'][0], 'id' | 'timesUsed' | 'isActive'>
): Promise<void> {
  const membership = await getMembershipById(membershipId);
  if (!membership) return;

  const newGuest = {
    ...guest,
    id: generateId(),
    timesUsed: 0,
    isActive: true,
  };

  await updateMembership(membershipId, {
    sponsoredGuests: [...membership.sponsoredGuests, newGuest],
  });
}

export async function deactivateSponsoredGuest(
  membershipId: string,
  guestId: string
): Promise<void> {
  const membership = await getMembershipById(membershipId);
  if (!membership) return;

  const updatedGuests = membership.sponsoredGuests.map((g) =>
    g.id === guestId ? { ...g, isActive: false } : g
  );

  await updateMembership(membershipId, { sponsoredGuests: updatedGuests });
}

// ============ Golf Trips ============

export async function getAllTrips(): Promise<GolfTrip[]> {
  const trips = await getArrayData<GolfTrip>(STORAGE_KEYS.TRIPS);
  return trips.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}

export async function getTripById(id: string): Promise<GolfTrip | null> {
  return findArrayItem<GolfTrip>(STORAGE_KEYS.TRIPS, id);
}

export async function getUpcomingTrips(): Promise<GolfTrip[]> {
  const trips = await getAllTrips();
  const today = new Date().toISOString().split('T')[0];
  return trips.filter((t) => t.startDate >= today);
}

export async function getPastTrips(): Promise<GolfTrip[]> {
  const trips = await getAllTrips();
  const today = new Date().toISOString().split('T')[0];
  return trips.filter((t) => t.endDate < today);
}

export async function createTrip(
  data: Omit<GolfTrip, 'id' | 'createdAt' | 'updatedAt'>
): Promise<GolfTrip> {
  const now = new Date().toISOString();
  const trip: GolfTrip = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };

  await addArrayItem(STORAGE_KEYS.TRIPS, trip);
  return trip;
}

export async function updateTrip(id: string, updates: Partial<GolfTrip>): Promise<GolfTrip | null> {
  return updateArrayItem<GolfTrip>(STORAGE_KEYS.TRIPS, id, updates);
}

export async function deleteTrip(id: string): Promise<boolean> {
  return removeArrayItem<GolfTrip>(STORAGE_KEYS.TRIPS, id);
}

export async function addCourseToTrip(
  tripId: string,
  courseVisit: GolfTrip['plannedCourses'][0]
): Promise<void> {
  const trip = await getTripById(tripId);
  if (!trip) return;

  await updateTrip(tripId, {
    plannedCourses: [...trip.plannedCourses, courseVisit],
  });
}
