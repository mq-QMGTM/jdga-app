import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  MapPin,
  Phone,
  Globe,
  Calendar,
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

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [userRecord, setUserRecord] = useState<UserCourseRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadCourse(id);
  }, [id]);

  const loadCourse = async (courseId: string) => {
    try {
      const [courseData, record] = await Promise.all([
        getCourseById(courseId),
        getUserCourseRecord(courseId),
      ]);
      setCourse(courseData);
      setUserRecord(record);
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
      <div className="pb-safe">
        <PageHeader title="" showBack />
        <div className="flex items-center justify-center py-16">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="pb-safe">
        <PageHeader title="Not Found" showBack />
        <div className="card mx-5 mt-4">
          <div className="empty-state">
            <h3 className="empty-state-title">Course Not Found</h3>
            <p className="empty-state-description">This course could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const hasPlayed = userRecord?.hasPlayed || false;

  return (
    <div className="pb-safe bg-[var(--background)]">
      <PageHeader title="" showBack />

      {/* Hero Section */}
      <div className="px-5">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] p-6">
          {/* Ranking badge */}
          {course.usRanking && (
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-1.5 bg-[#d4a634] rounded-full px-3 py-1.5">
                <span className="text-[13px] font-bold text-black">#{course.usRanking}</span>
              </div>
            </div>
          )}

          {/* Course info */}
          <div className="pr-16">
            <h1 className="text-2xl font-bold text-white leading-tight">{course.name}</h1>
            {course.clubName !== course.name && (
              <p className="text-[15px] text-white/60 mt-1">{course.clubName}</p>
            )}
            <div className="flex items-center gap-2 text-white/70 text-[15px] mt-3">
              <MapPin className="w-4 h-4" strokeWidth={1.5} />
              <span>{course.city}, {course.state}</span>
            </div>
          </div>

          {/* Type & Year */}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-[13px] font-medium text-white/50 bg-white/10 px-3 py-1 rounded-full">
              {course.courseType}
            </span>
            <span className="text-[13px] text-white/50">Est. {course.yearOpened}</span>
          </div>

          {/* Played badge */}
          {hasPlayed && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
              <div className="w-5 h-5 rounded-full bg-[var(--success)] flex items-center justify-center">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
              <span className="text-[14px] font-medium text-[var(--success)]">You've played here</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 mt-5 flex gap-3">
        {!hasPlayed ? (
          <button onClick={handleMarkPlayed} className="btn-primary flex-1">
            <Check className="w-5 h-5" strokeWidth={2} />
            Mark as Played
          </button>
        ) : (
          <button
            onClick={() => navigate(`/scorecards/add/${course.id}`)}
            className="btn-primary flex-1"
          >
            <PenLine className="w-5 h-5" strokeWidth={2} />
            Add Scorecard
          </button>
        )}
      </div>

      {/* Your Stats - only show if played */}
      {hasPlayed && userRecord && (userRecord.bestScore || userRecord.timesPlayed > 0) && (
        <div className="px-5 mt-6">
          <div className="grid grid-cols-2 gap-3">
            {userRecord.bestScore && (
              <div className="bg-[var(--card)] rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-[var(--foreground)]">{userRecord.bestScore}</div>
                <div className="text-[13px] text-[var(--foreground-tertiary)] mt-1">Best Score</div>
              </div>
            )}
            <div className="bg-[var(--card)] rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-[var(--foreground)]">
                {userRecord.timesPlayed}
                {userRecord.estimatedTimesPlayed && <span className="text-lg">~</span>}
              </div>
              <div className="text-[13px] text-[var(--foreground-tertiary)] mt-1">Times Played</div>
            </div>
          </div>
        </div>
      )}

      {/* Course Details */}
      <div className="px-5 mt-6">
        <h3 className="text-[13px] font-semibold text-[var(--foreground-tertiary)] uppercase tracking-wide mb-3">
          Details
        </h3>
        <div className="bg-[var(--card)] rounded-xl overflow-hidden divide-y divide-[var(--separator)]">
          <DetailRow icon={User} label="Designer" value={course.designer} />
          {course.par && <DetailRow icon={Flag} label="Par" value={course.par.toString()} />}
        </div>
      </div>

      {/* Contact */}
      <div className="px-5 mt-6">
        <h3 className="text-[13px] font-semibold text-[var(--foreground-tertiary)] uppercase tracking-wide mb-3">
          Contact
        </h3>
        <div className="bg-[var(--card)] rounded-xl overflow-hidden divide-y divide-[var(--separator)]">
          <DetailRow icon={MapPin} label="Address" value={course.address} />
          <DetailRow icon={Phone} label="Phone" value={formatPhoneNumber(course.phone)} />
          {course.website && (
            <a
              href={course.website.startsWith('http') ? course.website : `https://${course.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-4 py-3.5 active:bg-[var(--separator)]"
            >
              <div className="w-9 h-9 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                <Globe className="w-[18px] h-[18px] text-[var(--primary)]" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-[var(--foreground-tertiary)]">Website</div>
                <div className="text-[15px] text-[var(--primary)] truncate">{course.website}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--foreground-tertiary)] opacity-50" />
            </a>
          )}
        </div>
      </div>

      {/* Major Championships */}
      {course.majorTournaments.length > 0 && (
        <div className="px-5 mt-6">
          <h3 className="text-[13px] font-semibold text-[var(--foreground-tertiary)] uppercase tracking-wide mb-3">
            Major Championships
          </h3>
          <div className="bg-[var(--card)] rounded-xl overflow-hidden divide-y divide-[var(--separator)]">
            {course.majorTournaments.map((tournament, index) => (
              <div key={index} className="flex items-center gap-4 px-4 py-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#d4a634]/15 flex items-center justify-center">
                  <Trophy className="w-[18px] h-[18px] text-[#d4a634]" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <div className="text-[15px] font-medium text-[var(--foreground)]">
                    {tournament.tournamentName}
                  </div>
                  <div className="text-[13px] text-[var(--foreground-tertiary)]">
                    {tournament.year}
                    {tournament.isFuture && (
                      <span className="ml-2 text-[var(--primary)]">Upcoming</span>
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
        <div className="px-5 mt-6 mb-6">
          <h3 className="text-[13px] font-semibold text-[var(--foreground-tertiary)] uppercase tracking-wide mb-3">
            Travel
          </h3>
          <div className="bg-[var(--card)] rounded-xl overflow-hidden divide-y divide-[var(--separator)]">
            {course.closestPublicAirport && (
              <div className="flex items-center gap-4 px-4 py-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#5856d6]/10 flex items-center justify-center">
                  <Plane className="w-[18px] h-[18px] text-[#5856d6]" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] text-[var(--foreground-tertiary)]">Commercial Airport</div>
                  <div className="text-[15px] text-[var(--foreground)]">
                    {course.closestPublicAirport.code} · {course.closestPublicAirport.distanceMiles} mi
                  </div>
                </div>
              </div>
            )}
            {course.closestPrivateAirport && (
              <div className="flex items-center gap-4 px-4 py-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#5856d6]/10 flex items-center justify-center">
                  <Plane className="w-[18px] h-[18px] text-[#5856d6]" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] text-[var(--foreground-tertiary)]">Private Airport</div>
                  <div className="text-[15px] text-[var(--foreground)]">
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
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5">
      <div className="w-9 h-9 rounded-lg bg-[var(--foreground)]/5 flex items-center justify-center">
        <Icon className="w-[18px] h-[18px] text-[var(--foreground-secondary)]" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] text-[var(--foreground-tertiary)]">{label}</div>
        <div className="text-[15px] text-[var(--foreground)]">{value}</div>
      </div>
    </div>
  );
}
