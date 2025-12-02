/**
 * CSV Import Utility for Courses and Clubs
 *
 * This utility parses the us_courses.csv file and creates:
 * 1. Club records for multi-course facilities
 * 2. Course records linked to their parent clubs
 */

import type { Club, Course, CourseType } from '@/types';
import { initializeClubs } from './storage/clubStorage';
import { initializeCourses } from './storage/courseStorage';

interface CSVRow {
  usRanking: string;
  previousRank: string;
  clubId: string;
  clubName: string;
  name: string;
  city: string;
  state: string;
  courseType: string;
  panelistCount: string;
  starRating: string;
  in100Greatest: string;
  in100GreatestPublic: string;
  bestInState: string;
  description: string;
  designers: string;
  yearOpened: string;
  notableHistory: string;
  majorTournaments: string;
  address: string;
  phone: string;
  website: string;
  par: string;
  yardage: string;
  notes: string;
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current.trim());

  return fields;
}

function parseCSV(csvContent: string): CSVRow[] {
  const lines = csvContent.split('\n');
  const headers = parseCSVLine(lines[0]);

  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const fields = parseCSVLine(line);
    const row: any = {};

    headers.forEach((header, index) => {
      row[header] = fields[index] || '';
    });

    rows.push(row as CSVRow);
  }

  return rows;
}

function extractCourseName(fullName: string, clubName: string): string {
  // If no club, the full name is the course name
  if (!clubName) return fullName;

  // Extract course-specific name
  // e.g., "Winged Foot Golf Club: West" -> "West"
  // e.g., "Pacific Dunes" (at Bandon Dunes Resort) -> "Pacific Dunes"

  if (fullName.includes(':')) {
    return fullName.split(':')[1].trim();
  }

  // For cases like "Pacific Dunes" at Bandon Dunes Resort,
  // the full name IS the course name
  return fullName;
}

export async function importCoursesFromCSV(csvContent: string): Promise<void> {
  const rows = parseCSV(csvContent);

  // Build clubs map
  const clubsMap = new Map<string, Club>();
  const coursesByClub = new Map<string, string[]>(); // clubId -> courseIds[]

  // First pass: identify all clubs
  rows.forEach((row) => {
    if (row.clubId && row.clubName && !clubsMap.has(row.clubId)) {
      const club: Club = {
        id: row.clubId,
        name: row.clubName,
        city: row.city,
        state: row.state,
        country: 'USA',
        courseType: row.courseType as CourseType,
        courseIds: [], // Will populate in second pass
        address: row.address || '',
        phone: row.phone || '',
        website: row.website || '',
        nearbyHotels: [],
        nearbyRestaurants: [],
        optimalMonths: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      clubsMap.set(row.clubId, club);
      coursesByClub.set(row.clubId, []);
    }
  });

  // Second pass: create courses
  const courses: Course[] = rows.map((row, index) => {
    const courseId = `course-${row.usRanking || index}`;

    // Add course to club's courseIds
    if (row.clubId) {
      coursesByClub.get(row.clubId)?.push(courseId);
    }

    // Parse designers (semicolon-separated)
    const designerList = row.designers
      .split(';')
      .map((d) => d.trim())
      .filter(Boolean);
    const mainDesigner = designerList[0] || 'Unknown';
    const coDesigners = designerList.slice(1);

    // Extract course-specific name
    const courseName = extractCourseName(row.name, row.clubName);

    const course: Course = {
      id: courseId,
      name: courseName,
      fullName: row.name,
      clubId: row.clubId || null,

      // Location (for standalone courses)
      city: row.clubId ? undefined : row.city,
      state: row.clubId ? undefined : row.state,
      country: row.clubId ? undefined : 'USA',
      continent: row.clubId ? undefined : 'North America',

      // Rankings
      usRanking: parseInt(row.usRanking) || undefined,
      previousRank: parseInt(row.previousRank) || undefined,
      starRating: parseInt(row.starRating) || undefined,
      panelistCount: parseInt(row.panelistCount) || undefined,
      rankingSource: 'Golf Digest',
      rankingYear: 2024,

      // Badges
      in100Greatest: row.in100Greatest === 'true',
      in100GreatestPublic: row.in100GreatestPublic === 'true',
      bestInState: row.bestInState === 'true',

      // Course details
      courseType: row.clubId ? undefined : (row.courseType as CourseType),
      designer: mainDesigner,
      coDesigners: coDesigners.length > 0 ? coDesigners : undefined,
      yearOpened: parseInt(row.yearOpened) || undefined,

      description: row.description || undefined,
      notableHistory: row.notableHistory || undefined,

      // Technical
      teeBoxes: [], // Will populate later with detailed data
      par: parseInt(row.par) || undefined,
      yardage: parseInt(row.yardage) || undefined,
      holes: [], // Will populate later with detailed hole info

      // Tournaments
      majorTournaments: row.majorTournaments
        ? row.majorTournaments.split(';').map((t) => {
            const parts = t.trim().match(/(.+?)\s+(\d{4})/);
            if (parts) {
              return {
                tournamentName: parts[1].trim(),
                year: parseInt(parts[2]),
                isFuture: parseInt(parts[2]) > new Date().getFullYear(),
              };
            }
            return {
              tournamentName: t.trim(),
              year: 0,
              isFuture: false,
            };
          })
        : [],
      tournamentSummary: row.majorTournaments || undefined,

      // Contact (for standalone courses)
      address: row.clubId ? undefined : row.address || undefined,
      phone: row.clubId ? undefined : row.phone || undefined,
      website: row.clubId ? undefined : row.website || undefined,

      // Travel (for standalone courses)
      nearbyHotels: row.clubId ? undefined : [],
      nearbyRestaurants: row.clubId ? undefined : [],

      // Weather (for standalone courses)
      optimalMonths: row.clubId ? undefined : [],

      notes: row.notes || undefined,
    };

    return course;
  });

  // Update clubs with their courseIds
  clubsMap.forEach((club, clubId) => {
    club.courseIds = coursesByClub.get(clubId) || [];
  });

  // Initialize storage
  const clubs = Array.from(clubsMap.values());
  await initializeClubs(clubs);
  await initializeCourses(courses);

  console.log(`✅ Imported ${clubs.length} clubs and ${courses.length} courses`);
}

// Helper function to load and import from file
export async function importCoursesFromFile(filePath: string): Promise<void> {
  const response = await fetch(filePath);
  const csvContent = await response.text();
  await importCoursesFromCSV(csvContent);
}
