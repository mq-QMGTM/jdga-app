import { useEffect, useState } from 'react';
import { getAllCourses } from '@/lib/storage';
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

        if (existingCourses.length === 0) {
          console.log('📥 Importing courses from CSV...');
          // Load courses from CSV in public directory
          await importCoursesFromFile('/us_courses.csv');
          console.log('✅ Courses imported successfully');
        } else {
          console.log(`✅ Found ${existingCourses.length} existing courses in database`);
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
