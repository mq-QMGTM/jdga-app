// Course and Club Types

export type CourseType = 'Public' | 'Private' | 'Resort' | 'Semi-Private';
export type Continent =
  | 'North America'
  | 'Europe'
  | 'Asia'
  | 'Oceania'
  | 'Africa'
  | 'South America';

export interface TeeBox {
  name: string; // e.g., "Championship", "Blue", "White", "Red"
  color?: string;
  yardage: number;
  par: number;
  courseRating?: number;
  slopeRating?: number;
}

export interface HoleInfo {
  number: number;
  par: number;
  yardages: Record<string, number>; // Keyed by tee box name
  handicapIndex?: number;
  nickname?: string; // e.g., "Amen Corner"
  notes?: string;
}

export interface AirportInfo {
  code: string; // e.g., "LAX"
  name: string;
  city: string;
  distanceMiles: number;
  driveTimeMinutes: number;
  isPrivate: boolean;
}

export interface Hotel {
  name: string;
  rating: number; // 1-5 stars
  distanceMiles: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  website?: string;
  phone?: string;
}

export interface Restaurant {
  name: string;
  cuisine: string;
  rating: number; // 1-5
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  distanceMiles: number;
  website?: string;
  phone?: string;
}

export interface TournamentHosting {
  tournamentName: string;
  year: number;
  isFuture: boolean;
}

// Main Course interface
export interface Course {
  id: string;
  name: string; // e.g., "West", "East", "The Ocean Course", "Stadium"
  fullName: string; // e.g., "Winged Foot Golf Club: West"

  // Club Relationship
  clubId: string | null; // Reference to Club if part of multi-course facility, null if standalone

  // Location (for standalone courses) - use Club data for multi-course facilities
  city?: string;
  state?: string;
  country?: string;
  continent?: Continent;

  // Rankings
  usRanking?: number; // Top 100/250 US ranking
  worldRanking?: number;
  previousRank?: number;
  rankingSource?: string; // Golf Digest, Golf Magazine, etc.
  rankingYear?: number;
  starRating?: number; // 1-5 stars
  panelistCount?: number;

  // Badges/Awards
  in100Greatest?: boolean;
  in100GreatestPublic?: boolean;
  bestInState?: boolean;

  // Course Details (specific to this course, not club-level)
  courseType?: CourseType; // For standalone courses; multi-course facilities get this from Club
  designer: string;
  coDesigners?: string[];
  yearOpened?: number;

  // Course description and history
  description?: string;
  notableHistory?: string;

  // Technical Details
  teeBoxes: TeeBox[];
  par?: number;
  yardage?: number;
  holes: HoleInfo[];

  // Tournament History (specific to this course)
  majorTournaments: TournamentHosting[];
  tournamentSummary?: string; // e.g., "U.S. Open 2020 (Bryson DeChambeau)"

  // Contact & Location (for standalone courses only - multi-course facilities use Club)
  address?: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;

  // Travel Info (for standalone courses only)
  closestPublicAirport?: AirportInfo;
  closestPrivateAirport?: AirportInfo;
  nearbyHotels?: Hotel[];
  nearbyRestaurants?: Restaurant[];

  // Weather (for standalone courses only)
  optimalMonths?: number[];
  weatherNotes?: string;
  averageTemps?: Record<number, { high: number; low: number }>;

  // Media
  photoUrl?: string;

  // Notes from source data
  notes?: string;
}

// Course status from user's perspective
export type CourseStatus = 'played' | 'planning' | 'wishlist' | 'not-interested' | 'none';

// User's personal data for a course
export interface UserCourseRecord {
  id: string;
  courseId: string;
  hasPlayed: boolean;
  status?: CourseStatus; // User's tracking status for this course
  timesPlayed: number;
  estimatedTimesPlayed: boolean;
  desiredFrequency:
    | 'multiple_per_year'
    | 'yearly'
    | 'every_2_years'
    | 'every_5_years'
    | 'bucket_list'
    | 'none';
  bestScore?: number;
  firstPlayedDate?: string;
  lastPlayedDate?: string;

  // Contacts at this course (club-level membership is tracked in UserClubRecord)
  playingPartners: string[]; // Contact IDs of people played with at this specific course

  // Favorites (specific to this course)
  favoriteHoleNumbers: number[];
  favoriteDrink?: string;
  favoriteMenuItem?: string;
  merchWishlist: MerchItem[];

  // Notes (specific to this course)
  personalNotes?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface MerchItem {
  id: string;
  itemDescription: string;
  forSelf: boolean;
  giftRecipient?: string; // Name or contact ID
  purchased: boolean;
  notes?: string;
}

// For global favorite holes ranking
export interface FavoriteHole {
  id: string;
  courseId: string;
  courseName: string;
  holeNumber: number;
  globalRank: number; // User's personal global ranking
  notes?: string;
}
