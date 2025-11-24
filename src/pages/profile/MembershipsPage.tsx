import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Plus, Flag, Users, Calendar } from 'lucide-react';
import type { UserMembership } from '@/types';
import { getAllMemberships } from '@/lib/storage';
import { formatDate } from '@/lib/utils';

export function MembershipsPage() {
  const [memberships, setMemberships] = useState<UserMembership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemberships();
  }, []);

  const loadMemberships = async () => {
    try {
      const data = await getAllMemberships();
      setMemberships(data);
    } catch (error) {
      console.error('Error loading memberships:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-safe">
      <PageHeader
        title="My Memberships"
        showBack
        rightAction={
          <button className="p-2 text-[var(--primary)]">
            <Plus className="w-5 h-5" />
          </button>
        }
      />

      <div className="px-4 py-4">
        {loading ? (
          <div className="text-center py-8 text-[var(--foreground-muted)]">Loading...</div>
        ) : memberships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-4">
              <Flag className="w-8 h-8 text-[var(--foreground-muted)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">No Memberships</h3>
            <p className="text-sm text-[var(--foreground-muted)] text-center mt-2 max-w-xs">
              Add your club memberships to track guests and manage your golf life.
            </p>
            <button className="mt-4 px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Membership
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {memberships.map((membership) => (
              <MembershipCard key={membership.id} membership={membership} />
            ))}
          </div>
        )}

        {/* Info card */}
        <div className="mt-6 card p-4 bg-[var(--background-secondary)]">
          <h4 className="font-medium text-[var(--foreground)] mb-2">Membership Features</h4>
          <ul className="text-sm text-[var(--foreground-muted)] space-y-1">
            <li>- Track guests you've invited</li>
            <li>- Manage sponsored guests (play without you)</li>
            <li>- Record regular playing partners</li>
            <li>- Keep notes about your membership</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function MembershipCard({ membership }: { membership: UserMembership }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-[var(--foreground)]">{membership.clubName}</h3>
          <p className="text-sm text-[var(--foreground-muted)]">{membership.courseName}</p>
        </div>
        {membership.membershipType && (
          <span className="badge badge-outline text-xs">{membership.membershipType}</span>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)]">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>Since {formatDate(membership.memberSince)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span>{membership.guestHistory.length} guests hosted</span>
        </div>
      </div>

      {membership.sponsoredGuests.filter((g) => g.isActive).length > 0 && (
        <div className="mt-2 pt-2 border-t border-[var(--border-subtle)]">
          <p className="text-xs text-[var(--primary)]">
            {membership.sponsoredGuests.filter((g) => g.isActive).length} active sponsored guest(s)
          </p>
        </div>
      )}
    </div>
  );
}
