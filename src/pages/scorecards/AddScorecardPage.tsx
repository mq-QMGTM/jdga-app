import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Camera, PenLine, FileText, ChevronRight, Search, MapPin, Check } from 'lucide-react';
import type { Course } from '@/types';
import { getAllCourses } from '@/lib/storage';

const styles = {
  page: {
    paddingBottom: 'env(safe-area-inset-bottom)',
    backgroundColor: '#000',
    minHeight: '100vh',
    WebkitFontSmoothing: 'antialiased' as const,
    MozOsxFontSmoothing: 'grayscale' as const,
  },
  content: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  sectionHeader: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
    marginBottom: '12px',
    paddingLeft: '4px',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    backgroundColor: '#1c1c1e',
    borderRadius: '12px',
    marginBottom: '12px',
  },
  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    fontSize: '17px',
    color: '#fff',
    outline: 'none',
  },
  courseList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    maxHeight: '400px',
    overflowY: 'auto' as const,
  },
  courseCard: {
    width: '100%',
    backgroundColor: '#1c1c1e',
    borderRadius: '12px',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left' as const,
  },
  courseCardSelected: {
    backgroundColor: '#1c1c1e',
    border: '2px solid #22c55e',
  },
  courseInfo: {
    flex: 1,
    minWidth: 0,
  },
  courseName: {
    fontSize: '16px',
    fontWeight: 500,
    color: '#fff',
    marginBottom: '2px',
  },
  courseLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    color: '#6b7280',
  },
  checkIcon: {
    width: '24px',
    height: '24px',
    borderRadius: '12px',
    backgroundColor: '#22c55e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  selectedCourseCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: '14px',
    padding: '16px 18px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  selectedCourseInfo: {
    flex: 1,
  },
  selectedCourseName: {
    fontSize: '17px',
    fontWeight: 600,
    color: '#fff',
  },
  selectedCourseLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '4px',
  },
  changeButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#60a5fa',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  card: {
    width: '100%',
    backgroundColor: '#1c1c1e',
    borderRadius: '14px',
    padding: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left' as const,
  },
  iconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconGreen: {
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
  },
  iconOrange: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  },
  iconGray: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: '17px',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '4px',
    letterSpacing: '-0.2px',
  },
  description: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#6b7280',
    lineHeight: 1.4,
  },
  chevron: {
    color: '#4b5563',
    flexShrink: 0,
  },
  footer: {
    padding: '8px 20px 20px',
  },
  footerCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: '12px',
    padding: '16px 20px',
  },
  footerText: {
    fontSize: '13px',
    fontWeight: 400,
    color: '#6b7280',
    textAlign: 'center' as const,
    lineHeight: 1.5,
  },
  emptyState: {
    padding: '32px 20px',
    textAlign: 'center' as const,
  },
  emptyText: {
    fontSize: '15px',
    color: '#6b7280',
  },
};

export function AddScorecardPage() {
  const { courseId } = useParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    // If courseId is provided in URL, pre-select that course
    if (courseId && courses.length > 0) {
      const course = courses.find(c => c.id === courseId);
      if (course) setSelectedCourse(course);
    }
  }, [courseId, courses]);

  const loadCourses = async () => {
    try {
      const allCourses = await getAllCourses();
      setCourses(allCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      course.name.toLowerCase().includes(query) ||
      course.city.toLowerCase().includes(query) ||
      course.state.toLowerCase().includes(query)
    );
  });

  // Step 1: Course Selection
  if (!selectedCourse) {
    return (
      <div style={styles.page}>
        <PageHeader title="Select Course" showBack />

        <div style={styles.content}>
          <p style={styles.sectionHeader}>Which course did you play?</p>

          <div style={styles.searchBar}>
            <Search style={{ width: '20px', height: '20px', color: '#6b7280', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 0' }}>
              <div className="spinner" />
            </div>
          ) : filteredCourses.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>
                {searchQuery ? 'No courses found' : 'No courses available'}
              </p>
            </div>
          ) : (
            <div style={styles.courseList}>
              {filteredCourses.slice(0, 20).map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  style={styles.courseCard}
                >
                  <div style={styles.courseInfo}>
                    <div style={styles.courseName}>{course.name}</div>
                    <div style={styles.courseLocation}>
                      <MapPin style={{ width: '12px', height: '12px' }} />
                      {course.city}, {course.state}
                    </div>
                  </div>
                  <ChevronRight style={{ width: '18px', height: '18px', color: '#4b5563' }} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 2: Entry Method Selection
  return (
    <div style={styles.page}>
      <PageHeader title="Add Scorecard" showBack />

      <div style={styles.content}>
        {/* Selected course display */}
        <div style={styles.selectedCourseCard}>
          <div style={styles.checkIcon}>
            <Check style={{ width: '14px', height: '14px', color: '#fff' }} strokeWidth={3} />
          </div>
          <div style={styles.selectedCourseInfo}>
            <div style={styles.selectedCourseName}>{selectedCourse.name}</div>
            <div style={styles.selectedCourseLocation}>
              <MapPin style={{ width: '12px', height: '12px' }} />
              {selectedCourse.city}, {selectedCourse.state}
            </div>
          </div>
          <button
            onClick={() => setSelectedCourse(null)}
            style={styles.changeButton}
          >
            Change
          </button>
        </div>

        <p style={styles.sectionHeader}>How would you like to enter your score?</p>

        {/* Manual entry option */}
        <button
          onClick={() => {/* TODO: Navigate to manual entry */}}
          style={styles.card}
        >
          <div style={{ ...styles.iconBox, ...styles.iconGreen }}>
            <PenLine style={{ width: '24px', height: '24px', color: '#fff' }} strokeWidth={2} />
          </div>
          <div style={styles.textContainer}>
            <h3 style={styles.title}>Manual Entry</h3>
            <p style={styles.description}>Enter your scores hole by hole</p>
          </div>
          <ChevronRight style={{ ...styles.chevron, width: '20px', height: '20px' }} />
        </button>

        {/* OCR option */}
        <button
          onClick={() => {/* TODO: Navigate to OCR capture */}}
          style={styles.card}
        >
          <div style={{ ...styles.iconBox, ...styles.iconOrange }}>
            <Camera style={{ width: '24px', height: '24px', color: '#fff' }} strokeWidth={2} />
          </div>
          <div style={styles.textContainer}>
            <h3 style={styles.title}>Scan Scorecard</h3>
            <p style={styles.description}>Take a photo and import scores automatically</p>
          </div>
          <ChevronRight style={{ ...styles.chevron, width: '20px', height: '20px' }} />
        </button>

        {/* Quick score option */}
        <button
          onClick={() => {/* TODO: Navigate to quick entry */}}
          style={styles.card}
        >
          <div style={{ ...styles.iconBox, ...styles.iconGray }}>
            <FileText style={{ width: '24px', height: '24px', color: '#9ca3af' }} strokeWidth={2} />
          </div>
          <div style={styles.textContainer}>
            <h3 style={styles.title}>Quick Entry</h3>
            <p style={styles.description}>Just enter your total score</p>
          </div>
          <ChevronRight style={{ ...styles.chevron, width: '20px', height: '20px' }} />
        </button>
      </div>

      <div style={styles.footer}>
        <div style={styles.footerCard}>
          <p style={styles.footerText}>
            Scorecard images will be stored locally on your device and can be viewed in your scorecard gallery.
          </p>
        </div>
      </div>
    </div>
  );
}
