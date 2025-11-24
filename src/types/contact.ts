// Golf Buddy Contact Types

export type SkillLevel = 'recreational' | 'intermediate' | 'advanced';
export type PlayFrequency = 'occasional' | 'regular' | 'avid';

export interface GolfBuddy {
  id: string;
  firstName: string;
  lastName: string;
  nickname?: string;

  // Location
  homeCity: string;
  homeState: string;
  homeCountry?: string;

  // Golf Profile
  skillLevel: SkillLevel;
  playFrequency: PlayFrequency;
  approximateAge?: number;
  handicap?: number;

  // Memberships - course IDs where they are a member
  memberClubs: string[];

  // Contact Info
  phone?: string;
  email?: string;

  // Relationship with User
  hasPlayedWith: boolean;
  wouldPlayWith: boolean;

  // Courses played together with user
  coursesPlayedTogether: CoursePlayRecord[];

  // Member connections - this contact knows members at these courses
  knowsMemberAt: MemberConnection[];

  // Photo
  photo?: string; // Base64 or IndexedDB blob key

  // Notes
  notes?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface CoursePlayRecord {
  courseId: string;
  date?: string;
  notes?: string;
}

export interface MemberConnection {
  courseId: string;
  memberName?: string; // Name of the member they know (might not be a contact)
  memberContactId?: string; // If the member is also a contact
  relationshipNote?: string;
}

// For displaying skill level badges
export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  recreational: 'Recreational',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const SKILL_LEVEL_COLORS: Record<SkillLevel, string> = {
  recreational: 'bg-blue-100 text-blue-800',
  intermediate: 'bg-amber-100 text-amber-800',
  advanced: 'bg-emerald-100 text-emerald-800',
};

// For displaying frequency badges
export const PLAY_FREQUENCY_LABELS: Record<PlayFrequency, string> = {
  occasional: 'Occasional',
  regular: 'Regular',
  avid: 'Avid',
};

export const PLAY_FREQUENCY_COLORS: Record<PlayFrequency, string> = {
  occasional: 'bg-slate-100 text-slate-700',
  regular: 'bg-purple-100 text-purple-800',
  avid: 'bg-rose-100 text-rose-800',
};
