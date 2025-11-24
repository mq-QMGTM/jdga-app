import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { MapPin, Phone, Mail, Trophy, Users, Trash2, Edit } from 'lucide-react';
import type { GolfBuddy } from '@/types';
import { getContactById, deleteContact } from '@/lib/storage';
import { getInitials, formatPhoneNumber } from '@/lib/utils';
import { SKILL_LEVEL_LABELS, PLAY_FREQUENCY_LABELS } from '@/types/contact';
import { toast } from 'sonner';

export function BuddyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [buddy, setBuddy] = useState<GolfBuddy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadBuddy(id);
  }, [id]);

  const loadBuddy = async (buddyId: string) => {
    try {
      const data = await getContactById(buddyId);
      setBuddy(data);
    } catch (error) {
      console.error('Error loading buddy:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!buddy) return;

    if (confirm(`Are you sure you want to delete ${buddy.firstName} ${buddy.lastName}?`)) {
      try {
        await deleteContact(buddy.id);
        toast.success('Buddy deleted');
        navigate('/buddies');
      } catch (error) {
        toast.error('Failed to delete buddy');
      }
    }
  };

  if (loading) {
    return (
      <div className="pb-safe">
        <PageHeader title="Loading..." showBack />
        <div className="flex items-center justify-center py-16">
          <div className="text-[var(--foreground-muted)]">Loading...</div>
        </div>
      </div>
    );
  }

  if (!buddy) {
    return (
      <div className="pb-safe">
        <PageHeader title="Not Found" showBack />
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <p className="text-[var(--foreground-muted)]">This buddy could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-safe">
      <PageHeader
        title={`${buddy.firstName} ${buddy.lastName}`}
        showBack
        rightAction={
          <button
            onClick={handleDelete}
            className="p-2 text-[var(--destructive)]"
            aria-label="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        }
      />

      {/* Header card */}
      <div className="px-4 py-6 bg-[var(--background-secondary)]">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-[var(--primary)] flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {getInitials(buddy.firstName, buddy.lastName)}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">
              {buddy.firstName} {buddy.lastName}
            </h1>
            {buddy.nickname && (
              <p className="text-sm text-[var(--foreground-muted)]">"{buddy.nickname}"</p>
            )}
            <div className="flex items-center gap-1 mt-1 text-sm text-[var(--foreground-muted)]">
              <MapPin className="w-4 h-4" />
              <span>
                {buddy.homeCity}, {buddy.homeState}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info sections */}
      <div className="px-4 py-4 space-y-6">
        {/* Golf profile */}
        <section>
          <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wide mb-3">
            Golf Profile
          </h3>
          <div className="card p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-[var(--foreground-muted)]">Skill Level</span>
              <span className="text-sm font-medium text-[var(--foreground)]">
                {SKILL_LEVEL_LABELS[buddy.skillLevel]}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[var(--foreground-muted)]">Play Frequency</span>
              <span className="text-sm font-medium text-[var(--foreground)]">
                {PLAY_FREQUENCY_LABELS[buddy.playFrequency]}
              </span>
            </div>
            {buddy.handicap !== undefined && (
              <div className="flex justify-between">
                <span className="text-sm text-[var(--foreground-muted)]">Handicap</span>
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {buddy.handicap}
                </span>
              </div>
            )}
            {buddy.approximateAge && (
              <div className="flex justify-between">
                <span className="text-sm text-[var(--foreground-muted)]">Approx. Age</span>
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {buddy.approximateAge}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Contact info */}
        {(buddy.phone || buddy.email) && (
          <section>
            <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wide mb-3">
              Contact
            </h3>
            <div className="card p-4 space-y-3">
              {buddy.phone && (
                <a href={`tel:${buddy.phone}`} className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[var(--foreground-muted)]" />
                  <span className="text-sm text-[var(--primary)]">
                    {formatPhoneNumber(buddy.phone)}
                  </span>
                </a>
              )}
              {buddy.email && (
                <a href={`mailto:${buddy.email}`} className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[var(--foreground-muted)]" />
                  <span className="text-sm text-[var(--primary)]">{buddy.email}</span>
                </a>
              )}
            </div>
          </section>
        )}

        {/* Memberships */}
        {buddy.memberClubs.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wide mb-3">
              Club Memberships
            </h3>
            <div className="card p-4">
              <p className="text-sm text-[var(--foreground)]">
                Member at {buddy.memberClubs.length} club(s)
              </p>
            </div>
          </section>
        )}

        {/* Relationship status */}
        <section>
          <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wide mb-3">
            Relationship
          </h3>
          <div className="card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${buddy.hasPlayedWith ? 'bg-[var(--success)]' : 'bg-[var(--border)]'}`}
              />
              <span className="text-sm text-[var(--foreground)]">
                {buddy.hasPlayedWith ? 'Have played together' : "Haven't played together"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${buddy.wouldPlayWith ? 'bg-[var(--success)]' : 'bg-[var(--border)]'}`}
              />
              <span className="text-sm text-[var(--foreground)]">
                {buddy.wouldPlayWith ? 'Would play with' : 'Not marked as would play with'}
              </span>
            </div>
          </div>
        </section>

        {/* Notes */}
        {buddy.notes && (
          <section>
            <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wide mb-3">
              Notes
            </h3>
            <div className="card p-4">
              <p className="text-sm text-[var(--foreground)] whitespace-pre-wrap">{buddy.notes}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
