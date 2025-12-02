// Golf Club Types

import { AirportInfo, Hotel, Restaurant, CourseType } from './course';

/**
 * Represents a golf club/facility that may have one or more courses.
 * Examples: Winged Foot Golf Club (West + East), Bandon Dunes Resort (4 courses)
 */
export interface Club {
  id: string;
  name: string; // e.g., "Winged Foot Golf Club", "Bandon Dunes Resort"

  // Location
  city: string;
  state: string;
  country: string;

  // Type
  courseType: CourseType; // Private, Public, Resort, Semi-Private

  // Courses at this club
  courseIds: string[]; // Array of Course IDs that belong to this club

  // Contact Information (shared across all courses)
  address: string;
  phone: string;
  website?: string;
  latitude?: number;
  longitude?: number;

  // Travel Information (shared across all courses)
  closestPublicAirport?: AirportInfo;
  closestPrivateAirport?: AirportInfo;
  nearbyHotels: Hotel[];
  nearbyRestaurants: Restaurant[];

  // Weather (shared across all courses)
  optimalMonths: number[]; // 1-12, months with best playing conditions
  weatherNotes?: string;
  averageTemps?: Record<number, { high: number; low: number }>; // By month

  // Club-level metadata
  ownership?: string;
  founders?: string[];

  // Media
  logoUrl?: string;
  photoUrl?: string; // Main club photo

  // Metadata
  createdAt: string;
  updatedAt: string;
}

/**
 * User's personal data for a club (applies to all courses at the club)
 */
export interface UserClubRecord {
  id: string;
  clubId: string;

  // Contacts at this club (applies to all courses)
  knownMembers: string[]; // Contact IDs of known members
  knowsSomeoneWhoKnowsMember?: string; // Contact ID of person who knows a member

  // Club-level notes
  clubNotes?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}
