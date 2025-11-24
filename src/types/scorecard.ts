// Scorecard Types

export type EntryMethod = 'manual' | 'ocr';

export interface HoleScore {
  holeNumber: number;
  par: number;
  score: number;
  putts?: number;
  fairwayHit?: boolean;
  greenInRegulation?: boolean;
  notes?: string;
}

export interface Scorecard {
  id: string;
  courseId: string;
  courseName: string; // Specific course name if multi-course facility
  clubName: string;
  date: string; // ISO date string

  // Tee played
  teeBox: string;
  teeYardage?: number;

  // Players
  playerId: string; // 'user' for the app user, or contact ID
  playerName: string;
  playingPartners: PlayingPartner[];

  // Scores
  scores: HoleScore[];
  frontNine: number;
  backNine: number;
  totalScore: number;
  totalPar: number;
  scoreToPar: number; // Can be negative (under par)

  // Statistics
  totalPutts?: number;
  fairwaysHit?: number;
  fairwaysPossible?: number;
  greensInRegulation?: number;

  // Import method
  entryMethod: EntryMethod;
  originalImage?: string; // Base64 or IndexedDB blob key if OCR imported

  // Notes
  notes?: string;
  conditions?: string; // Weather, course conditions, etc.

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface PlayingPartner {
  contactId?: string; // If they're a saved contact
  name: string; // Always have a name even if not a contact
  score?: number;
}

// Helper function to calculate score relative to par
export function calculateScoreToPar(scores: HoleScore[]): number {
  return scores.reduce((acc, hole) => acc + (hole.score - hole.par), 0);
}

// Helper to get score display string
export function formatScoreToPar(scoreToPar: number): string {
  if (scoreToPar === 0) return 'E';
  if (scoreToPar > 0) return `+${scoreToPar}`;
  return scoreToPar.toString();
}

// Helper to calculate front/back nine
export function calculateNineScore(scores: HoleScore[], front: boolean): number {
  const relevantHoles = front
    ? scores.filter((s) => s.holeNumber <= 9)
    : scores.filter((s) => s.holeNumber > 9);
  return relevantHoles.reduce((acc, hole) => acc + hole.score, 0);
}
