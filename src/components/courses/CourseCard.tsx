import { MapPin, Check } from 'lucide-react';
import type { Course, UserCourseRecord } from '@/types';

interface CourseCardProps {
  course: Course;
  userRecord?: UserCourseRecord;
  showRanking?: boolean;
  compact?: boolean;
}

export function CourseCard({ course, userRecord, showRanking = false, compact = false }: CourseCardProps) {
  const hasPlayed = userRecord?.hasPlayed || false;
  const bestScore = userRecord?.bestScore;
  const timesPlayed = userRecord?.timesPlayed || 0;

  return (
    <div
      className={`card-list-item ${
        hasPlayed ? 'ring-2 ring-[var(--success)]' : ''
      }`}
    >
      {/* Ranking badge */}
      {showRanking && course.usRanking && (
        <div
          className="w-12 h-12 flex-shrink-0 rounded-xl flex flex-col items-center justify-center"
          style={{ backgroundColor: '#d4a634' }}
        >
          <span className="text-[10px] font-medium text-black/60">#</span>
          <span className="text-lg font-bold text-black -mt-1">{course.usRanking}</span>
        </div>
      )}

      {/* Course info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className={`font-semibold text-[var(--foreground)] truncate ${compact ? 'text-[15px]' : 'text-[17px]'}`}>
              {course.name}
            </h3>
            {course.clubName !== course.name && (
              <p className="text-[13px] text-[var(--foreground-tertiary)] truncate">
                {course.clubName}
              </p>
            )}
          </div>

          {/* Played indicator */}
          {hasPlayed && (
            <div
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--success)' }}
            >
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 mt-1.5 text-[13px] text-[var(--foreground-tertiary)]">
          <MapPin className="w-3.5 h-3.5" />
          <span>
            {course.city}, {course.state}
          </span>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 mt-2 text-[13px] text-[var(--foreground-tertiary)]">
          <span>{course.courseType}</span>
          {!compact && course.designer && (
            <>
              <span className="opacity-40">·</span>
              <span className="truncate">{course.designer}</span>
            </>
          )}
        </div>

        {/* User stats */}
        {hasPlayed && !compact && (bestScore || timesPlayed > 0) && (
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--separator)]">
            {bestScore && (
              <div className="text-[13px]">
                <span className="text-[var(--foreground-tertiary)]">Best: </span>
                <span className="font-semibold text-[var(--foreground)]">{bestScore}</span>
              </div>
            )}
            {timesPlayed > 0 && (
              <div className="text-[13px]">
                <span className="text-[var(--foreground-tertiary)]">Played: </span>
                <span className="font-semibold text-[var(--foreground)]">{timesPlayed}x</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
