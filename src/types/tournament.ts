// Tournament and Major Championship Types

export type MajorChampionship = 'Masters' | 'PGA Championship' | 'US Open' | 'The Open Championship';

export interface TournamentFinisher {
  position: 1 | 2 | 3;
  playerName: string;
  score: string; // e.g., "-12", "+4", "E"
  country?: string;
}

export interface MajorResult {
  id: string;
  championship: MajorChampionship;
  year: number;
  courseId?: string; // Reference to course in database
  courseName: string;
  clubName?: string;
  location: string; // City, State/Country
  topFinishers: TournamentFinisher[];
  winningScore: string;
  notes?: string;
}

export interface FutureHost {
  id: string;
  championship: MajorChampionship;
  year: number;
  courseId?: string;
  courseName: string;
  clubName?: string;
  location: string;
  confirmed: boolean;
}

// Major championship metadata
export const MAJOR_CHAMPIONSHIPS: Record<
  MajorChampionship,
  {
    fullName: string;
    shortName: string;
    organization: string;
    typicalMonth: string;
    color: string;
  }
> = {
  Masters: {
    fullName: 'The Masters Tournament',
    shortName: 'Masters',
    organization: 'Augusta National Golf Club',
    typicalMonth: 'April',
    color: '#076652', // Augusta green
  },
  'PGA Championship': {
    fullName: 'PGA Championship',
    shortName: 'PGA',
    organization: 'PGA of America',
    typicalMonth: 'May',
    color: '#00205B', // PGA blue
  },
  'US Open': {
    fullName: 'United States Open Championship',
    shortName: 'US Open',
    organization: 'USGA',
    typicalMonth: 'June',
    color: '#003087', // USGA blue
  },
  'The Open Championship': {
    fullName: 'The Open Championship',
    shortName: 'The Open',
    organization: 'The R&A',
    typicalMonth: 'July',
    color: '#1C2541', // R&A dark blue
  },
};

// Helper to get all host courses for a championship
export function getHostCoursesForChampionship(
  results: MajorResult[],
  championship: MajorChampionship
): string[] {
  const courses = results
    .filter((r) => r.championship === championship)
    .map((r) => r.courseName);
  return [...new Set(courses)];
}

// Helper to get years a course hosted a major
export function getYearsHosted(
  results: MajorResult[],
  courseName: string
): { championship: MajorChampionship; year: number }[] {
  return results
    .filter((r) => r.courseName === courseName)
    .map((r) => ({ championship: r.championship, year: r.year }))
    .sort((a, b) => b.year - a.year);
}
