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

        // Check if we need to import or re-import
        // Re-import if: no courses, OR old seed data (< 50 courses and no clubs)
        const needsImport = existingCourses.length === 0 ||
          (existingCourses.length < 50 && existingClubs.length === 0);

        if (needsImport) {
          console.log('📥 Importing courses from CSV...');
          if (existingCourses.length > 0) {
            console.log(`⚠️  Found ${existingCourses.length} old courses, replacing with CSV data...`);
          }
          // Load courses from CSV in public directory
          await importCoursesFromFile('/us_courses.csv');
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
