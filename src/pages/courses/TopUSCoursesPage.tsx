import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { CourseCard } from '@/components/courses/CourseCard';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Course, UserCourseRecord } from '@/types';
import { getAllCourses, getAllUserCourseRecords } from '@/lib/storage';

type RankingFilter = 'all' | 'top25' | 'top50' | 'top100';
type TypeFilter = 'all' | 'public' | 'private';
type StatusFilter = 'all' | 'played' | 'planning' | 'wishlist' | 'not-interested';

// Consistent styles matching CourseDetailPage
const styles = {
  page: {
    paddingBottom: 'env(safe-area-inset-bottom)',
    backgroundColor: '#000',
    minHeight: '100vh',
    WebkitFontSmoothing: 'antialiased' as const,
    MozOsxFontSmoothing: 'grayscale' as const,
  },
  filterCard: {
    margin: '12px 20px 0',
    backgroundColor: '#1c1c1e',
    borderRadius: '14px',
    overflow: 'hidden',
  },
  filterHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  filterTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#fff',
    margin: 0,
    letterSpacing: '-0.2px',
  },
  collapseButton: {
    padding: '8px',
    borderRadius: '8px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContent: {
    padding: '20px',
  },
  filterSection: {
    marginBottom: '24px',
  },
  filterSectionLast: {
    marginBottom: 0,
  },
  filterLabel: {
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
    color: '#6b7280',
    marginBottom: '12px',
    paddingLeft: '2px',
  },
  filterChips: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '10px',
  },
  chip: {
    padding: '12px 20px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    letterSpacing: '-0.2px',
  },
  chipSelected: {
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: '#fff',
  },
  chipSelectedAlt: {
    background: '#fbbf24',
    color: '#000',
  },
  chipUnselected: {
    background: 'rgba(255,255,255,0.08)',
    color: '#9ca3af',
  },
  clearSection: {
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  clearButton: {
    background: 'none',
    border: 'none',
    fontSize: '15px',
    fontWeight: 600,
    color: '#60a5fa',
    cursor: 'pointer',
    padding: '8px 16px',
    borderRadius: '8px',
  },
  statsBar: {
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsCount: {
    fontSize: '15px',
    fontWeight: 500,
    color: '#6b7280',
  },
  statsPlayed: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#22c55e',
  },
  listContainer: {
    padding: '0 20px',
  },
  emptyState: {
    backgroundColor: '#1c1c1e',
    borderRadius: '14px',
    padding: '48px 24px',
    textAlign: 'center' as const,
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '15px',
    color: '#6b7280',
    marginBottom: '20px',
  },
  emptyButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 28px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  collapsedChips: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap' as const,
  },
  collapsedChip: {
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
  },
  collapsedRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  collapsedLabel: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#fff',
    letterSpacing: '-0.2px',
  },
};

export function TopUSCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userRecords, setUserRecords] = useState<UserCourseRecord[]>([]);
  const [rankingFilter, setRankingFilter] = useState<RankingFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
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
    if (rankingFilter === 'top25' && rank > 25) return false;
    if (rankingFilter === 'top50' && rank > 50) return false;
    if (rankingFilter === 'top100' && rank > 100) return false;
    if (typeFilter === 'public' && course.courseType !== 'Public' && course.courseType !== 'Resort') return false;
    if (typeFilter === 'private' && course.courseType !== 'Private') return false;

    // Status filter
    if (statusFilter !== 'all') {
      const record = userRecords.find((r) => r.courseId === course.id);
      if (statusFilter === 'played' && (!record || !record.hasPlayed)) return false;
      if (statusFilter === 'planning' && (!record || record.status !== 'planning')) return false;
      if (statusFilter === 'wishlist' && (!record || record.status !== 'wishlist')) return false;
      if (statusFilter === 'not-interested' && (!record || record.status !== 'not-interested')) return false;
    }
    return true;
  });

  const getUserRecord = (courseId: string) => userRecords.find((r) => r.courseId === courseId);

  const playedCount = filteredCourses.filter((c) =>
    userRecords.some((r) => r.courseId === c.id && r.hasPlayed)
  ).length;

  const hasActiveFilters = rankingFilter !== 'all' || typeFilter !== 'all' || statusFilter !== 'all';

  const clearFilters = () => {
    setRankingFilter('all');
    setTypeFilter('all');
    setStatusFilter('all');
  };

  const getChipStyle = (isSelected: boolean, isAll: boolean) => {
    if (isSelected) {
      return isAll ? { ...styles.chip, ...styles.chipSelected } : { ...styles.chip, ...styles.chipSelectedAlt };
    }
    return { ...styles.chip, ...styles.chipUnselected };
  };

  const getCollapsedChipStyle = (isAll: boolean, isActive: boolean) => ({
    ...styles.collapsedChip,
    background: isActive
      ? (isAll ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : '#fbbf24')
      : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: isActive && !isAll ? '#000' : '#fff',
  });

  return (
    <div style={styles.page}>
      <PageHeader title="Top US Courses" showBack />

      {/* Filters Card */}
      <div style={styles.filterCard}>
        {/* Collapsed state */}
        {!filtersOpen && (
          <button
            onClick={() => setFiltersOpen(true)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <div style={styles.collapsedChips}>
              <span style={getCollapsedChipStyle(rankingFilter === 'all', rankingFilter !== 'all')}>
                {rankingFilter === 'all' ? 'All' : rankingFilter === 'top25' ? 'Top 25' : rankingFilter === 'top50' ? 'Top 50' : 'Top 100'}
              </span>
              <span style={getCollapsedChipStyle(typeFilter === 'all', typeFilter !== 'all')}>
                {typeFilter === 'all' ? 'All' : typeFilter === 'public' ? 'Public' : 'Private'}
              </span>
              <span style={getCollapsedChipStyle(statusFilter === 'all', statusFilter !== 'all')}>
                {statusFilter === 'all' ? 'All' : statusFilter === 'played' ? "Played" : statusFilter === 'planning' ? 'Planning' : statusFilter === 'wishlist' ? 'Wishlist' : 'Not Interested'}
              </span>
            </div>
            <div style={styles.collapsedRight}>
              <span style={styles.collapsedLabel}>Filters</span>
              <ChevronDown style={{ width: '20px', height: '20px', color: '#6b7280' }} />
            </div>
          </button>
        )}

        {/* Expanded state */}
        {filtersOpen && (
          <>
            {/* Header */}
            <div style={styles.filterHeader}>
              <h3 style={styles.filterTitle}>Filters</h3>
              <button onClick={() => setFiltersOpen(false)} style={styles.collapseButton}>
                <ChevronUp style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            {/* Filter Content */}
            <div style={styles.filterContent}>
              {/* Ranking */}
              <div style={styles.filterSection}>
                <div style={styles.filterLabel}>Ranking</div>
                <div style={styles.filterChips}>
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'top25', label: 'Top 25' },
                    { value: 'top50', label: 'Top 50' },
                    { value: 'top100', label: 'Top 100' },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setRankingFilter(filter.value as RankingFilter)}
                      style={getChipStyle(rankingFilter === filter.value, filter.value === 'all')}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div style={styles.filterSection}>
                <div style={styles.filterLabel}>Type</div>
                <div style={styles.filterChips}>
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'public', label: 'Public' },
                    { value: 'private', label: 'Private' },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setTypeFilter(filter.value as TypeFilter)}
                      style={getChipStyle(typeFilter === filter.value, filter.value === 'all')}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div style={styles.filterSectionLast}>
                <div style={styles.filterLabel}>Status</div>
                <div style={styles.filterChips}>
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'played', label: "I've Played" },
                    { value: 'planning', label: 'Actively Planning' },
                    { value: 'wishlist', label: 'Wishlist' },
                    { value: 'not-interested', label: 'Not Interested' },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setStatusFilter(filter.value as StatusFilter)}
                      style={getChipStyle(statusFilter === filter.value, filter.value === 'all')}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear */}
              {hasActiveFilters && (
                <div style={styles.clearSection}>
                  <button onClick={clearFilters} style={styles.clearButton}>
                    Clear
                  </button>
                </div>
              )}

              {/* Bottom collapse button */}
              <div style={{
                marginTop: hasActiveFilters ? '12px' : '20px',
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <button onClick={() => setFiltersOpen(false)} style={styles.collapseButton}>
                  <ChevronUp style={{ width: '20px', height: '20px' }} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Stats bar */}
      <div style={styles.statsBar}>
        <span style={styles.statsCount}>{filteredCourses.length} courses</span>
        <span style={styles.statsPlayed}>{playedCount} played</span>
      </div>

      {/* Course list */}
      <div style={styles.listContainer}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 0' }}>
            <div className="spinner" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div style={styles.emptyState}>
            <h3 style={styles.emptyTitle}>No courses found</h3>
            <p style={styles.emptyText}>Try adjusting your filters</p>
            <button onClick={clearFilters} style={styles.emptyButton}>
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
