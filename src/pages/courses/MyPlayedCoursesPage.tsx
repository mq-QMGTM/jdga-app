import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { CourseCard } from '@/components/courses/CourseCard';
import { CheckCircle } from 'lucide-react';
import type { Course, UserCourseRecord } from '@/types';
import { getAllCourses, getPlayedCourses } from '@/lib/storage';

export function MyPlayedCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userRecords, setUserRecords] = useState<UserCourseRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allCourses, playedRecords] = await Promise.all([
        getAllCourses(),
        getPlayedCourses(),
      ]);

      const playedCourseIds = new Set(playedRecords.map((r) => r.courseId));
      const playedCourses = allCourses.filter((c) => playedCourseIds.has(c.id));

      setCourses(playedCourses);
      setUserRecords(playedRecords);
    } catch (error) {
      console.error('Error loading played courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserRecord = (courseId: string) => {
    return userRecords.find((r) => r.courseId === courseId);
  };

  return (
    <div className="pb-safe">
      <PageHeader title="My Played Courses" showBack />

      {/* Stats bar */}
      <div className="px-5 py-3 flex items-center justify-between">
        <span className="text-[15px] text-[var(--foreground-tertiary)]">Total courses played</span>
        <span className="text-[15px] font-semibold text-[var(--primary)]">{courses.length}</span>
      </div>

      {/* Course list */}
      <div className="px-5">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="spinner" />
          </div>
        ) : courses.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">
                <CheckCircle className="w-8 h-8 text-[var(--primary)]" strokeWidth={1.5} />
              </div>
              <h3 className="empty-state-title">No Courses Yet</h3>
              <p className="empty-state-description">
                Start marking courses as played to track your golf journey.
              </p>
              <Link to="/courses/top-us" className="btn-primary mt-5">
                Browse Courses
              </Link>
            </div>
          </div>
        ) : (
          <div className="card-list">
            {courses.map((course) => (
              <Link key={course.id} to={`/courses/${course.id}`}>
                <CourseCard course={course} userRecord={getUserRecord(course.id)} showRanking />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
