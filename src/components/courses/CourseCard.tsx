import { MapPin, Check } from 'lucide-react';
import type { Course, UserCourseRecord, Club } from '@/types';

interface CourseCardProps {
  course: Course;
  club?: Club | null; // The club this course belongs to, if any
  userRecord?: UserCourseRecord;
  showRanking?: boolean;
  compact?: boolean;
}

export function CourseCard({ course, club, userRecord, showRanking = false, compact = false }: CourseCardProps) {
  const hasPlayed = userRecord?.hasPlayed || false;
  const bestScore = userRecord?.bestScore;
  const timesPlayed = userRecord?.timesPlayed || 0;

  // Determine display name
  const displayName = course.fullName;
  const showClubName = club && club.name !== course.fullName;

  // Location: use club location if part of a club, otherwise course location
  const city = club ? club.city : course.city;
  const state = club ? club.state : course.state;

  // Course type: use club's type if part of a club, otherwise course's type
  const courseType = club ? club.courseType : course.courseType;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        backgroundColor: 'var(--background-secondary)',
        borderRadius: '12px',
        border: hasPlayed ? '2px solid var(--success)' : 'none',
        cursor: 'pointer',
      }}
    >
      {/* Ranking badge */}
      {showRanking && course.usRanking && (
        <div
          style={{
            width: '48px',
            height: '48px',
            flexShrink: 0,
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#d4a634',
          }}
        >
          <span style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(0,0,0,0.6)' }}>#</span>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#000', marginTop: '-4px' }}>
            {course.usRanking}
          </span>
        </div>
      )}

      {/* Course info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3
              style={{
                fontWeight: 600,
                color: 'var(--foreground)',
                fontSize: compact ? '15px' : '17px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {displayName}
            </h3>
            {showClubName && (
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--foreground-tertiary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginTop: '2px',
                }}
              >
                at {club.name}
              </p>
            )}
          </div>

          {/* Played indicator */}
          {hasPlayed && (
            <div
              style={{
                flexShrink: 0,
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--success)',
              }}
            >
              <Check style={{ width: '16px', height: '16px', color: '#fff', strokeWidth: 3 }} />
            </div>
          )}
        </div>

        {/* Location */}
        {city && state && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '6px',
              fontSize: '13px',
              color: 'var(--foreground-tertiary)',
            }}
          >
            <MapPin style={{ width: '14px', height: '14px' }} />
            <span>
              {city}, {state}
            </span>
          </div>
        )}

        {/* Meta row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '8px',
            fontSize: '13px',
            color: 'var(--foreground-tertiary)',
          }}
        >
          {courseType && <span>{courseType}</span>}
          {!compact && course.designer && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {course.designer}
              </span>
            </>
          )}
        </div>

        {/* User stats */}
        {hasPlayed && !compact && (bestScore || timesPlayed > 0) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid var(--separator)',
            }}
          >
            {bestScore && (
              <div style={{ fontSize: '13px' }}>
                <span style={{ color: 'var(--foreground-tertiary)' }}>Best: </span>
                <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>{bestScore}</span>
              </div>
            )}
            {timesPlayed > 0 && (
              <div style={{ fontSize: '13px' }}>
                <span style={{ color: 'var(--foreground-tertiary)' }}>Played: </span>
                <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>{timesPlayed}x</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
