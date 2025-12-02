// Re-export all types from a single entry point

export * from './course';
export * from './club';
export * from './contact';
export * from './scorecard';
export * from './membership';
export * from './tournament';

// App-wide settings type
export interface UserSettings {
  homeAirportCode?: string;
  homeAirportName?: string;
  homeCity?: string;
  homeState?: string;
  preferredUnits: 'imperial' | 'metric';
  theme: 'light' | 'dark' | 'system';
  createdAt: string;
  updatedAt: string;
}

// Trip planning types
export interface GolfTrip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  destination: string; // City or region
  isGolfPrimaryPurpose: boolean; // vs. non-golf trip with golf added

  // Planned courses
  plannedCourses: PlannedCourseVisit[];

  // Buddies on the trip
  travelingWith: string[]; // Contact IDs

  // Notes
  notes?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface PlannedCourseVisit {
  courseId: string;
  plannedDate?: string;
  teeTime?: string;
  confirmed: boolean;
  notes?: string;
}
