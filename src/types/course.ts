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
  name: string;
  clubName: string;
  city: string;
  state: string;
  country: string;
  continent: Continent;

  // Rankings
  usRanking?: number; // Top 100/250 US ranking
  worldRanking?: number;
  rankingSource?: string; // Golf Digest, Golf Magazine, etc.
  rankingYear?: number;

  // Course Details
  courseType: CourseType;
  numberOfCourses: number;
  courseNames: string[]; // If multi-course facility
  designer: string;
  coDesigners?: string[];
  yearOpened: number;
  ownership?: string;
  founders?: string[];

  // Technical Details
  teeBoxes: TeeBox[];
  par: number;
  holes: HoleInfo[];

  // Tournament History
  majorTournaments: TournamentHosting[];

  // Contact & Location
  address: string;
  phone: string;
  website?: string;
  latitude?: number;
  longitude?: number;

  // Travel Info
  closestPublicAirport?: AirportInfo;
  closestPrivateAirport?: AirportInfo;
  nearbyHotels: Hotel[];
  nearbyRestaurants: Restaurant[];

  // Weather
  optimalMonths: number[]; // 1-12, months with best playing conditions
  weatherNotes?: string;
  averageTemps?: Record<number, { high: number; low: number }>; // By month

  // Media
  photoUrl?: string;
  logoUrl?: string;
}

// User's personal data for a course
export interface UserCourseRecord {
  id: string;
  courseId: string;
  hasPlayed: boolean;
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

  // Contacts at this course
  playingPartners: string[]; // Contact IDs of people played with here
  knownMembers: string[]; // Contact IDs of known members
  knowsSomeoneWhoKnowsMember?: string; // Contact ID of person who knows a member

  // Favorites
  favoriteHoleNumbers: number[];
  favoriteDrink?: string;
  favoriteMenuItem?: string;
  merchWishlist: MerchItem[];

  // Notes
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
