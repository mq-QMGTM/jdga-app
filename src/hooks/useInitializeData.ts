import { useEffect, useState } from 'react';
import { getInitialCourses } from '@/data/courses/topUSCourses';
import { initializeCourses, getAllCourses } from '@/lib/storage';

export function useInitializeData() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAppData();
  }, []);

  const initializeAppData = async () => {
    try {
      // Check if courses are already loaded
      const existingCourses = await getAllCourses();

      if (existingCourses.length === 0) {
        // Load initial course data
        const initialCourses = getInitialCourses();
        await initializeCourses(initialCourses);
        console.log(`Initialized ${initialCourses.length} courses`);
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing app data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isInitialized, isLoading };
}
