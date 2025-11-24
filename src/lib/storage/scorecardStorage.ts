// Scorecard storage operations

import type { Scorecard, HoleScore, PlayingPartner } from '@/types';
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
import { calculateNineScore, calculateScoreToPar } from '@/types/scorecard';
import { updateBestScore } from './courseStorage';

// ============ Scorecard CRUD ============

export async function getAllScorecards(): Promise<Scorecard[]> {
  const scorecards = await getArrayData<Scorecard>(STORAGE_KEYS.SCORECARDS);
  return scorecards.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getScorecardById(id: string): Promise<Scorecard | null> {
  return findArrayItem<Scorecard>(STORAGE_KEYS.SCORECARDS, id);
}

export async function getScorecardsForCourse(courseId: string): Promise<Scorecard[]> {
  const scorecards = await getAllScorecards();
  return scorecards.filter((s) => s.courseId === courseId);
}

export async function getScorecardsForContact(contactId: string): Promise<Scorecard[]> {
  const scorecards = await getAllScorecards();
  return scorecards.filter(
    (s) => s.playerId === contactId || s.playingPartners.some((p) => p.contactId === contactId)
  );
}

export async function createScorecard(
  scorecardData: Omit<
    Scorecard,
    'id' | 'createdAt' | 'updatedAt' | 'frontNine' | 'backNine' | 'totalScore' | 'scoreToPar'
  >
): Promise<Scorecard> {
  const now = new Date().toISOString();

  // Calculate totals
  const frontNine = calculateNineScore(scorecardData.scores, true);
  const backNine = calculateNineScore(scorecardData.scores, false);
  const totalScore = frontNine + backNine;
  const scoreToPar = calculateScoreToPar(scorecardData.scores);
  const totalPar = scorecardData.scores.reduce((acc, h) => acc + h.par, 0);

  const newScorecard: Scorecard = {
    ...scorecardData,
    id: generateId(),
    frontNine,
    backNine,
    totalScore,
    totalPar,
    scoreToPar,
    createdAt: now,
    updatedAt: now,
  };

  await addArrayItem(STORAGE_KEYS.SCORECARDS, newScorecard);

  // Update best score for the course if this is user's scorecard
  if (scorecardData.playerId === 'user') {
    await updateBestScore(scorecardData.courseId, totalScore);
  }

  return newScorecard;
}

export async function updateScorecard(
  id: string,
  updates: Partial<Scorecard>
): Promise<Scorecard | null> {
  // If scores are updated, recalculate totals
  if (updates.scores) {
    const frontNine = calculateNineScore(updates.scores, true);
    const backNine = calculateNineScore(updates.scores, false);
    const totalScore = frontNine + backNine;
    const scoreToPar = calculateScoreToPar(updates.scores);

    updates = {
      ...updates,
      frontNine,
      backNine,
      totalScore,
      scoreToPar,
    };
  }

  return updateArrayItem<Scorecard>(STORAGE_KEYS.SCORECARDS, id, updates);
}

export async function deleteScorecard(id: string): Promise<boolean> {
  // Also delete associated image
  await deleteScorecardImage(id);
  return removeArrayItem<Scorecard>(STORAGE_KEYS.SCORECARDS, id);
}

// ============ Scorecard Queries ============

export async function getRecentScorecards(limit: number = 10): Promise<Scorecard[]> {
  const scorecards = await getAllScorecards();
  return scorecards.slice(0, limit);
}

export async function getScorecardsByDateRange(startDate: string, endDate: string): Promise<Scorecard[]> {
  const scorecards = await getAllScorecards();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  return scorecards.filter((s) => {
    const date = new Date(s.date).getTime();
    return date >= start && date <= end;
  });
}

export async function getUserScorecards(): Promise<Scorecard[]> {
  const scorecards = await getAllScorecards();
  return scorecards.filter((s) => s.playerId === 'user');
}

// ============ Scorecard Images ============

export async function saveScorecardImage(scorecardId: string, imageData: string): Promise<void> {
  const images = (await getItem<Record<string, string>>(STORAGE_KEYS.SCORECARD_IMAGES)) || {};
  images[scorecardId] = imageData;
  await setItem(STORAGE_KEYS.SCORECARD_IMAGES, images);
}

export async function getScorecardImage(scorecardId: string): Promise<string | null> {
  const images = await getItem<Record<string, string>>(STORAGE_KEYS.SCORECARD_IMAGES);
  return images?.[scorecardId] || null;
}

export async function deleteScorecardImage(scorecardId: string): Promise<void> {
  const images = (await getItem<Record<string, string>>(STORAGE_KEYS.SCORECARD_IMAGES)) || {};
  delete images[scorecardId];
  await setItem(STORAGE_KEYS.SCORECARD_IMAGES, images);
}

// ============ Statistics ============

export async function getScorecardStats(): Promise<{
  totalRounds: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  coursesPlayed: number;
  roundsThisYear: number;
  averageScoreThisYear: number;
}> {
  const scorecards = await getUserScorecards();
  const currentYear = new Date().getFullYear();

  if (scorecards.length === 0) {
    return {
      totalRounds: 0,
      averageScore: 0,
      bestScore: 0,
      worstScore: 0,
      coursesPlayed: 0,
      roundsThisYear: 0,
      averageScoreThisYear: 0,
    };
  }

  const scores = scorecards.map((s) => s.totalScore);
  const uniqueCourses = new Set(scorecards.map((s) => s.courseId));

  const thisYearScorecards = scorecards.filter(
    (s) => new Date(s.date).getFullYear() === currentYear
  );
  const thisYearScores = thisYearScorecards.map((s) => s.totalScore);

  return {
    totalRounds: scorecards.length,
    averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    bestScore: Math.min(...scores),
    worstScore: Math.max(...scores),
    coursesPlayed: uniqueCourses.size,
    roundsThisYear: thisYearScorecards.length,
    averageScoreThisYear:
      thisYearScores.length > 0
        ? Math.round(thisYearScores.reduce((a, b) => a + b, 0) / thisYearScores.length)
        : 0,
  };
}

// ============ Quick Scorecard Creation ============

// Create an empty 18-hole scorecard template
export function createEmptyScores(par: number[] | number = 72): HoleScore[] {
  const pars = Array.isArray(par)
    ? par
    : [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]; // Default par 72

  return pars.map((holePar, index) => ({
    holeNumber: index + 1,
    par: holePar,
    score: 0,
  }));
}
