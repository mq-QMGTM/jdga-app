import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LargeHeader } from '@/components/layout/PageHeader';
import { Plus, Users, Search, MapPin, ChevronRight } from 'lucide-react';
import type { GolfBuddy } from '@/types';
import { getAllContacts } from '@/lib/storage';
import { getInitials } from '@/lib/utils';
import { SKILL_LEVEL_LABELS } from '@/types/contact';

type FilterOption = 'all' | 'played' | 'would_play' | 'members';

const styles = {
  page: {
    paddingBottom: 'calc(env(safe-area-inset-bottom) + 70px)',
    backgroundColor: '#000',
    minHeight: '100vh',
    WebkitFontSmoothing: 'antialiased' as const,
  },
  searchSection: {
    padding: '0 20px',
    marginTop: '16px',
  },
  filterSection: {
    padding: '0 20px',
    marginTop: '12px',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    backgroundColor: '#1c1c1e',
    borderRadius: '12px',
  },
  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    fontSize: '17px',
    color: '#fff',
    outline: 'none',
  },
  filterRow: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto' as const,
    paddingBottom: '4px',
  },
  filterChip: {
    padding: '12px 20px',
    borderRadius: '20px',
    fontSize: '15px',
    fontWeight: 600,
    whiteSpace: 'nowrap' as const,
    border: 'none',
    cursor: 'pointer',
    letterSpacing: '-0.2px',
  },
  filterActive: {
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: '#fff',
  },
  filterInactive: {
    backgroundColor: '#1c1c1e',
    color: '#9ca3af',
  },
  listSection: {
    padding: '0 20px',
    marginTop: '20px',
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  buddyCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: '14px',
    padding: '16px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    textDecoration: 'none',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
  },
  avatarText: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
  },
  buddyInfo: {
    flex: 1,
    minWidth: 0,
  },
  buddyName: {
    fontSize: '17px',
    fontWeight: 500,
    color: '#fff',
  },
  buddyNickname: {
    color: '#6b7280',
    fontWeight: 400,
  },
  buddyLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '4px',
    fontSize: '14px',
    color: '#6b7280',
  },
  buddyBadge: {
    marginTop: '8px',
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '100px',
    fontSize: '13px',
    fontWeight: 500,
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#9ca3af',
  },
  emptyState: {
    backgroundColor: '#1c1c1e',
    borderRadius: '14px',
    padding: '48px 24px',
    textAlign: 'center' as const,
  },
  emptyIcon: {
    width: '72px',
    height: '72px',
    borderRadius: '22px',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  emptyTitle: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '10px',
  },
  emptyDesc: {
    fontSize: '16px',
    color: '#6b7280',
    maxWidth: '300px',
    margin: '0 auto',
    lineHeight: 1.5,
  },
};

export function BuddiesPage() {
  const [contacts, setContacts] = useState<GolfBuddy[]>([]);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await getAllContacts();
      setContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        contact.firstName.toLowerCase().includes(query) ||
        contact.lastName.toLowerCase().includes(query) ||
        contact.homeCity.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    switch (filter) {
      case 'played':
        return contact.hasPlayedWith;
      case 'would_play':
        return contact.wouldPlayWith && !contact.hasPlayedWith;
      case 'members':
        return contact.memberClubs.length > 0;
      default:
        return true;
    }
  });

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'played', label: 'Played With' },
    { value: 'would_play', label: 'Would Play' },
    { value: 'members', label: 'Members' },
  ];

  return (
    <div style={styles.page}>
      <LargeHeader title="Golf Buddies" subtitle="Your golf contacts and playing partners">
        <Link to="/buddies/add" className="btn-primary">
          <Plus style={{ width: '20px', height: '20px' }} strokeWidth={2} />
          Add Buddy
        </Link>
      </LargeHeader>

      {/* Search */}
      <div style={styles.searchSection}>
        <div style={styles.searchBar}>
          <Search style={{ width: '20px', height: '20px', color: '#6b7280', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search by name or city"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filterSection}>
        <div style={styles.filterRow}>
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value as FilterOption)}
              style={{
                ...styles.filterChip,
                ...(filter === opt.value ? styles.filterActive : styles.filterInactive),
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contact list */}
      <div style={styles.listSection}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 0' }}>
            <div className="spinner" />
          </div>
        ) : filteredContacts.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <Users style={{ width: '32px', height: '32px', color: '#22c55e' }} strokeWidth={1.5} />
            </div>
            <h3 style={styles.emptyTitle}>
              {searchQuery ? 'No Results Found' : 'No Buddies Yet'}
            </h3>
            <p style={styles.emptyDesc}>
              {searchQuery
                ? 'Try a different search term'
                : 'Add your golf buddies to track who you play with.'}
            </p>
            {!searchQuery && (
              <Link to="/buddies/add" className="btn-primary" style={{ marginTop: '20px', display: 'inline-flex' }}>
                <Plus style={{ width: '20px', height: '20px' }} />
                Add Your First Buddy
              </Link>
            )}
          </div>
        ) : (
          <div style={styles.cardList}>
            {filteredContacts.map((contact) => (
              <BuddyRow key={contact.id} buddy={contact} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BuddyRow({ buddy }: { buddy: GolfBuddy }) {
  return (
    <Link to={`/buddies/${buddy.id}`} style={styles.buddyCard}>
      <div style={styles.avatar}>
        <span style={styles.avatarText}>
          {getInitials(buddy.firstName, buddy.lastName)}
        </span>
      </div>
      <div style={styles.buddyInfo}>
        <div style={styles.buddyName}>
          {buddy.firstName} {buddy.lastName}
          {buddy.nickname && (
            <span style={styles.buddyNickname}> ({buddy.nickname})</span>
          )}
        </div>
        <div style={styles.buddyLocation}>
          <MapPin style={{ width: '14px', height: '14px' }} />
          {buddy.homeCity}, {buddy.homeState}
        </div>
        <span style={styles.buddyBadge}>{SKILL_LEVEL_LABELS[buddy.skillLevel]}</span>
      </div>
      <ChevronRight style={{ width: '20px', height: '20px', color: '#4b5563', flexShrink: 0 }} />
    </Link>
  );
}
