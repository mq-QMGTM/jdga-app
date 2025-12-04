import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  MapPin,
  Phone,
  Globe,
  User,
  Check,
  Trophy,
  Plane,
  PenLine,
  ChevronRight,
  Flag,
} from 'lucide-react';
import type { Course, UserCourseRecord } from '@/types';
import { getCourseById, getUserCourseRecord, markCourseAsPlayed } from '@/lib/storage';
import { formatPhoneNumber } from '@/lib/utils';
import { toast } from 'sonner';

// Shared styles for consistent typography
const styles = {
  page: {
    paddingBottom: 'env(safe-area-inset-bottom)',
    backgroundColor: '#000',
    minHeight: '100vh',
    WebkitFontSmoothing: 'antialiased' as const,
    MozOsxFontSmoothing: 'grayscale' as const,
  },
  heroCard: {
    margin: '12px 20px 0',
    padding: '24px',
    borderRadius: '16px',
    background: 'linear-gradient(145deg, #1c1c1e 0%, #2c2c2e 100%)',
  },
  rankBadge: {
    position: 'absolute' as const,
    top: '20px',
    right: '20px',
    backgroundColor: '#d4a634',
    borderRadius: '20px',
    padding: '6px 14px',
  },
  rankText: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#000',
    letterSpacing: '-0.3px',
  },
  courseName: {
    fontSize: '26px',
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1.2,
    letterSpacing: '-0.5px',
    marginBottom: '4px',
  },
  clubName: {
    fontSize: '16px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '12px',
  },
  locationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  locationText: {
    fontSize: '15px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.6)',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  typeBadge: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.7)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: '6px 14px',
    borderRadius: '8px',
  },
  yearText: {
    fontSize: '13px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.4)',
  },
  playedBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  playedIcon: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: '#22c55e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playedText: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#22c55e',
  },
  actionSection: {
    margin: '20px 20px 0',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  actionButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '16px 24px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: '#fff',
    fontSize: '17px',
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '-0.3px',
  },
  actionButtonSmall: {
    width: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 20px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '-0.3px',
  },
  sectionWrapper: {
    margin: '28px 20px 0',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
    marginBottom: '12px',
    paddingLeft: '4px',
  },
  card: {
    backgroundColor: '#1c1c1e',
    borderRadius: '14px',
    overflow: 'hidden',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 18px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  rowLast: {
    borderBottom: 'none',
  },
  iconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconBoxGold: {
    backgroundColor: 'rgba(212, 166, 52, 0.15)',
  },
  iconBoxPurple: {
    backgroundColor: 'rgba(88, 86, 214, 0.15)',
  },
  rowContent: {
    flex: 1,
    minWidth: 0,
  },
  rowLabel: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#6b7280',
    marginBottom: '2px',
  },
  rowValue: {
    fontSize: '16px',
    fontWeight: 500,
    color: '#fff',
  },
  rowValueLink: {
    fontSize: '16px',
    fontWeight: 500,
    color: '#60a5fa',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    margin: '20px 20px 0',
  },
  statCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: '14px',
    padding: '20px',
    textAlign: 'center' as const,
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-1px',
  },
  statLabel: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#6b7280',
    marginTop: '4px',
  },
};

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [club, setClub] = useState<any | null>(null);
  const [userRecord, setUserRecord] = useState<UserCourseRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadCourse(id);
  }, [id]);

  const loadCourse = async (courseId: string) => {
    try {
      console.log('Loading course:', courseId);
      const courseData = await getCourseById(courseId);
      console.log('Course data loaded:', courseData);

      if (!courseData) {
        console.error('No course data found for ID:', courseId);
        setLoading(false);
        return;
      }

      const record = await getUserCourseRecord(courseId);
      console.log('User record loaded:', record);

      setCourse(courseData);
      setUserRecord(record);

      // Load club data if course is part of a club
      if (courseData?.clubId) {
        console.log('Loading club data for clubId:', courseData.clubId);
        const { getClubById } = await import('@/lib/storage/clubStorage');
        const clubData = await getClubById(courseData.clubId);
        console.log('Club data loaded:', clubData);
        setClub(clubData);
      }
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPlayed = async () => {
    if (!course) return;
    try {
      const record = await markCourseAsPlayed(course.id);
      setUserRecord(record);
      toast.success(`${course.name} marked as played!`);
    } catch (error) {
      toast.error('Failed to update course');
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <PageHeader title="" showBack />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 0' }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div style={styles.page}>
        <PageHeader title="Not Found" showBack />
        <div style={{ ...styles.sectionWrapper, marginTop: '20px' }}>
          <div style={{ ...styles.card, padding: '40px 20px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
              Course Not Found
            </h3>
            <p style={{ fontSize: '15px', color: '#6b7280' }}>
              This course could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasPlayed = userRecord?.hasPlayed || false;

  return (
    <div style={styles.page}>
      <PageHeader title="" showBack />

      {/* Hero Section */}
      <div style={{ ...styles.heroCard, position: 'relative' }}>
        {/* Ranking badge */}
        {course.usRanking && (
          <div style={styles.rankBadge}>
            <span style={styles.rankText}>#{course.usRanking}</span>
          </div>
        )}

        {/* Course info */}
        <div style={{ paddingRight: course.usRanking ? '70px' : '0' }}>
          <h1 style={styles.courseName}>{course.fullName || course.name}</h1>
          {club && (
            <p style={styles.clubName}>{club.name}</p>
          )}
          <div style={styles.locationRow}>
            <MapPin style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.5)' }} strokeWidth={2} />
            <span style={styles.locationText}>
              {club ? `${club.city}, ${club.state}` : `${course.city || ''}, ${course.state || ''}`}
            </span>
          </div>
        </div>

        {/* Type & Year */}
        <div style={styles.metaRow}>
          <span style={styles.typeBadge}>{club?.courseType || course.courseType}</span>
          {course.yearOpened && <span style={styles.yearText}>Est. {course.yearOpened}</span>}
        </div>

        {/* Played badge */}
        {hasPlayed && (
          <div style={styles.playedBadge}>
            <div style={styles.playedIcon}>
              <Check style={{ width: '14px', height: '14px', color: '#fff' }} strokeWidth={3} />
            </div>
            <span style={styles.playedText}>You've played here</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div style={styles.actionSection}>
        {!hasPlayed ? (
          <button onClick={handleMarkPlayed} style={styles.actionButton}>
            <Check style={{ width: '20px', height: '20px' }} strokeWidth={2.5} />
            Mark as Played
          </button>
        ) : (
          <button
            onClick={() => navigate(`/scorecards/add/${course.id}`)}
            style={styles.actionButtonSmall}
          >
            <PenLine style={{ width: '18px', height: '18px' }} strokeWidth={2} />
            Add Scorecard
          </button>
        )}
      </div>

      {/* Your Stats - only show if played */}
      {hasPlayed && userRecord && (userRecord.bestScore || userRecord.timesPlayed > 0) && (
        <div style={styles.statsGrid}>
          {userRecord.bestScore && (
            <div style={styles.statCard}>
              <div style={styles.statValue}>{userRecord.bestScore}</div>
              <div style={styles.statLabel}>Best Score</div>
            </div>
          )}
          <div style={styles.statCard}>
            <div style={styles.statValue}>
              {userRecord.timesPlayed}
              {userRecord.estimatedTimesPlayed && <span style={{ fontSize: '20px' }}>~</span>}
            </div>
            <div style={styles.statLabel}>Times Played</div>
          </div>
        </div>
      )}

      {/* Course Details */}
      <div style={styles.sectionWrapper}>
        <h3 style={styles.sectionTitle}>Details</h3>
        <div style={styles.card}>
          <DetailRow icon={User} label="Designer" value={course.designer} />
          {course.par && <DetailRow icon={Flag} label="Par" value={course.par.toString()} isLast={!course.par} />}
        </div>
      </div>

      {/* Contact */}
      <div style={styles.sectionWrapper}>
        <h3 style={styles.sectionTitle}>Contact</h3>
        <div style={styles.card}>
          <DetailRow icon={MapPin} label="Address" value={club?.address || course.address} />
          <DetailRow icon={Phone} label="Phone" value={formatPhoneNumber(club?.phone || course.phone)} isLast={!(club?.website || course.website)} />
          {(club?.website || course.website) && (
            <a
              href={(club?.website || course.website || '').startsWith('http') ? (club?.website || course.website) : `https://${club?.website || course.website}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...styles.row, ...styles.rowLast, textDecoration: 'none' }}
            >
              <div style={styles.iconBox}>
                <Globe style={{ width: '18px', height: '18px', color: '#9ca3af' }} strokeWidth={1.5} />
              </div>
              <div style={styles.rowContent}>
                <div style={styles.rowLabel}>Website</div>
                <div style={{ ...styles.rowValueLink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {club?.website || course.website}
                </div>
              </div>
              <ChevronRight style={{ width: '20px', height: '20px', color: '#4b5563', flexShrink: 0 }} />
            </a>
          )}
        </div>
      </div>

      {/* Major Championships */}
      {course.majorTournaments.length > 0 && (
        <div style={styles.sectionWrapper}>
          <h3 style={styles.sectionTitle}>Major Championships</h3>
          <div style={styles.card}>
            {course.majorTournaments.map((tournament, index) => (
              <div
                key={index}
                style={{
                  ...styles.row,
                  ...(index === course.majorTournaments.length - 1 ? styles.rowLast : {}),
                }}
              >
                <div style={{ ...styles.iconBox, ...styles.iconBoxGold }}>
                  <Trophy style={{ width: '18px', height: '18px', color: '#d4a634' }} strokeWidth={1.5} />
                </div>
                <div style={styles.rowContent}>
                  <div style={{ ...styles.rowValue, marginBottom: '2px' }}>
                    {tournament.tournamentName}
                  </div>
                  <div style={styles.rowLabel}>
                    {tournament.year}
                    {tournament.isFuture && (
                      <span style={{ marginLeft: '8px', color: '#60a5fa' }}>Upcoming</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Travel */}
      {(course.closestPublicAirport || course.closestPrivateAirport) && (
        <div style={{ ...styles.sectionWrapper, marginBottom: '32px' }}>
          <h3 style={styles.sectionTitle}>Travel</h3>
          <div style={styles.card}>
            {course.closestPublicAirport && (
              <div style={{
                ...styles.row,
                ...(!course.closestPrivateAirport ? styles.rowLast : {}),
              }}>
                <div style={{ ...styles.iconBox, ...styles.iconBoxPurple }}>
                  <Plane style={{ width: '18px', height: '18px', color: '#8b5cf6' }} strokeWidth={1.5} />
                </div>
                <div style={styles.rowContent}>
                  <div style={styles.rowLabel}>Commercial Airport</div>
                  <div style={styles.rowValue}>
                    {course.closestPublicAirport.code} · {course.closestPublicAirport.distanceMiles} mi
                  </div>
                </div>
              </div>
            )}
            {course.closestPrivateAirport && (
              <div style={{ ...styles.row, ...styles.rowLast }}>
                <div style={{ ...styles.iconBox, ...styles.iconBoxPurple }}>
                  <Plane style={{ width: '18px', height: '18px', color: '#8b5cf6' }} strokeWidth={1.5} />
                </div>
                <div style={styles.rowContent}>
                  <div style={styles.rowLabel}>Private Airport</div>
                  <div style={styles.rowValue}>
                    {course.closestPrivateAirport.code} · {course.closestPrivateAirport.distanceMiles} mi
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  isLast = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <div style={{ ...styles.row, ...(isLast ? styles.rowLast : {}) }}>
      <div style={styles.iconBox}>
        <Icon style={{ width: '18px', height: '18px', color: '#9ca3af' }} strokeWidth={1.5} />
      </div>
      <div style={styles.rowContent}>
        <div style={styles.rowLabel}>{label}</div>
        <div style={styles.rowValue}>{value}</div>
      </div>
    </div>
  );
}
