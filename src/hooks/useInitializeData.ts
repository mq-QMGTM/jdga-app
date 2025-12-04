import { useEffect, useState } from 'react';
import { getAllCourses, getAllClubs } from '@/lib/storage';
import { importCoursesFromFile } from '@/lib/importCourses';

/**
 * Hook to initialize app data on first load
 * Loads courses and clubs from CSV into IndexedDB if not already loaded
 */
export function useInitializeData() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function initializeData() {
      try {
        // Check if courses are already loaded
        const existingCourses = await getAllCourses();
        const existingClubs = await getAllClubs();

        // CSV data version - increment this when CSV structure changes to force reimport
        const CSV_VERSION = 2; // Changed from 1 to force reimport after CSV fix
        const storedVersion = parseInt(localStorage.getItem('jdga_csv_version') || '0');

        // Check if we need to import or re-import
        // Re-import if:
        // - no courses
        // - old seed data (< 50 courses and no clubs)
        // - CSV version changed (structure was fixed)
        const needsImport = existingCourses.length === 0 ||
          (existingCourses.length < 50 && existingClubs.length === 0) ||
          storedVersion < CSV_VERSION;

        if (needsImport) {
          console.log('📥 Importing courses from CSV...');
          if (existingCourses.length > 0) {
            console.log(`⚠️  Found ${existingCourses.length} old courses, replacing with CSV data (version ${storedVersion} -> ${CSV_VERSION})...`);
          }
          // Load courses from CSV in public directory
          await importCoursesFromFile('/us_courses.csv');
          localStorage.setItem('jdga_csv_version', CSV_VERSION.toString());
          console.log('✅ Courses imported successfully');
        } else {
          console.log(`✅ Found ${existingCourses.length} courses and ${existingClubs.length} clubs in database`);
        }
      } catch (err) {
        console.error('Error initializing data:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize data'));
      } finally {
        setIsLoading(false);
      }
    }

    initializeData();
  }, []);

  return { isLoading, error };
}
