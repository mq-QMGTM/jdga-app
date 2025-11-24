import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { CourseCard } from '@/components/courses/CourseCard';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import type { Course, UserCourseRecord } from '@/types';
import { getAllCourses, getAllUserCourseRecords } from '@/lib/storage';

type RankingFilter = 'all' | 'top25' | 'top50' | 'top100';
type TypeFilter = 'all' | 'public' | 'private';

export function TopUSCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userRecords, setUserRecords] = useState<UserCourseRecord[]>([]);
  const [rankingFilter, setRankingFilter] = useState<RankingFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allCourses, records] = await Promise.all([
        getAllCourses(),
        getAllUserCourseRecords(),
      ]);

      const usCourses = allCourses
        .filter((c) => c.country === 'USA' && c.usRanking)
        .sort((a, b) => (a.usRanking || 999) - (b.usRanking || 999));

      setCourses(usCourses);
      setUserRecords(records);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const rank = course.usRanking || 999;

    // Ranking filter
    if (rankingFilter === 'top25' && rank > 25) return false;
    if (rankingFilter === 'top50' && rank > 50) return false;
    if (rankingFilter === 'top100' && rank > 100) return false;

    // Type filter
    if (typeFilter === 'public' && course.courseType !== 'Public' && course.courseType !== 'Resort') return false;
    if (typeFilter === 'private' && course.courseType !== 'Private') return false;

    return true;
  });

  const getUserRecord = (courseId: string) => {
    return userRecords.find((r) => r.courseId === courseId);
  };

  const playedCount = filteredCourses.filter((c) =>
    userRecords.some((r) => r.courseId === c.id && r.hasPlayed)
  ).length;

  const hasActiveFilters = rankingFilter !== 'all' || typeFilter !== 'all';

  const clearFilters = () => {
    setRankingFilter('all');
    setTypeFilter('all');
  };

  return (
    <div className="pb-safe">
      <PageHeader title="Top US Courses" showBack />

      {/* Filters Card */}
      <div className="px-5 mt-2">
        <div className="bg-[var(--card)] rounded-xl overflow-hidden">
          {/* Filter Header */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="w-full flex items-center justify-between px-4 py-3.5 active:bg-[var(--separator)]"
          >
            <span className="text-[15px] font-semibold text-[var(--foreground)]">
              Filters
              {hasActiveFilters && (
                <span className="ml-2 text-[var(--primary)]">Active</span>
              )}
            </span>
            {filtersOpen ? (
              <ChevronUp className="w-5 h-5 text-[var(--foreground-tertiary)]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[var(--foreground-tertiary)]" />
            )}
          </button>

          {/* Filter Content */}
          {filtersOpen && (
            <div className="px-4 pb-4 border-t border-[var(--separator)]">
              {/* Ranking */}
              <div className="mt-4">
                <p className="text-[11px] font-semibold text-[var(--foreground-tertiary)] uppercase tracking-wider mb-2">
                  Ranking
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterChip
                    label="All"
                    selected={rankingFilter === 'all'}
                    onClick={() => setRankingFilter('all')}
                  />
                  <FilterChip
                    label="Top 25"
                    selected={rankingFilter === 'top25'}
                    onClick={() => setRankingFilter('top25')}
                  />
                  <FilterChip
                    label="Top 50"
                    selected={rankingFilter === 'top50'}
                    onClick={() => setRankingFilter('top50')}
                  />
                  <FilterChip
                    label="Top 100"
                    selected={rankingFilter === 'top100'}
                    onClick={() => setRankingFilter('top100')}
                  />
                </div>
              </div>

              {/* Type */}
              <div className="mt-4">
                <p className="text-[11px] font-semibold text-[var(--foreground-tertiary)] uppercase tracking-wider mb-2">
                  Type
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterChip
                    label="All"
                    selected={typeFilter === 'all'}
                    onClick={() => setTypeFilter('all')}
                  />
                  <FilterChip
                    label="Public"
                    selected={typeFilter === 'public'}
                    onClick={() => setTypeFilter('public')}
                  />
                  <FilterChip
                    label="Private"
                    selected={typeFilter === 'private'}
                    onClick={() => setTypeFilter('private')}
                  />
                </div>
              </div>

              {/* Clear button */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 mt-4 text-[14px] font-medium text-[var(--primary)]"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="px-5 py-4 flex items-center justify-between">
        <span className="text-[15px] text-[var(--foreground-tertiary)]">
          {filteredCourses.length} courses
        </span>
        <span className="text-[15px] font-semibold text-[var(--success)]">
          {playedCount} played
        </span>
      </div>

      {/* Course list */}
      <div className="px-5">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="spinner" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-[var(--card)] rounded-xl p-8 text-center">
            <h3 className="text-[17px] font-semibold text-[var(--foreground)]">No courses found</h3>
            <p className="text-[15px] text-[var(--foreground-tertiary)] mt-2">
              Try adjusting your filters
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary mt-4"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="card-list">
            {filteredCourses.map((course) => (
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

function FilterChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-[14px] font-medium transition-colors ${
        selected
          ? 'bg-[var(--primary)] text-white'
          : 'bg-[var(--foreground)]/5 text-[var(--foreground-secondary)] hover:bg-[var(--foreground)]/10'
      }`}
    >
      {label}
    </button>
  );
}
