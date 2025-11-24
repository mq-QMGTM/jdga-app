import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LargeHeader } from '@/components/layout/PageHeader';
import { Plus, Users, Search, MapPin, ChevronRight } from 'lucide-react';
import type { GolfBuddy } from '@/types';
import { getAllContacts } from '@/lib/storage';
import { getInitials } from '@/lib/utils';
import { SKILL_LEVEL_LABELS } from '@/types/contact';

type FilterOption = 'all' | 'played' | 'would_play' | 'members';

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
    <div className="pb-safe">
      <LargeHeader title="Golf Buddies" subtitle="Your golf contacts and playing partners">
        <Link to="/buddies/add" className="btn-primary">
          <Plus className="w-5 h-5" strokeWidth={2} />
          Add Buddy
        </Link>
      </LargeHeader>

      {/* Search */}
      <div className="px-5 mt-3">
        <div className="search-bar">
          <Search className="w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or city"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-5 mt-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value as FilterOption)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === opt.value
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--separator)] text-[var(--foreground-secondary)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contact list */}
      <div className="px-5 mt-5">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="spinner" />
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">
                <Users className="w-8 h-8 text-[var(--primary)]" strokeWidth={1.5} />
              </div>
              <h3 className="empty-state-title">
                {searchQuery ? 'No Results Found' : 'No Buddies Yet'}
              </h3>
              <p className="empty-state-description">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Add your golf buddies to track who you play with.'}
              </p>
              {!searchQuery && (
                <Link to="/buddies/add" className="btn-primary mt-5">
                  <Plus className="w-5 h-5" />
                  Add Your First Buddy
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="card-list">
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
    <Link to={`/buddies/${buddy.id}`} className="card-list-item">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: 'var(--primary)' }}
      >
        <span className="text-base font-semibold text-white">
          {getInitials(buddy.firstName, buddy.lastName)}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[17px] font-medium text-[var(--foreground)]">
          {buddy.firstName} {buddy.lastName}
          {buddy.nickname && (
            <span className="text-[var(--foreground-tertiary)] font-normal"> ({buddy.nickname})</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-1 text-[14px] text-[var(--foreground-tertiary)]">
          <MapPin className="w-3.5 h-3.5" />
          {buddy.homeCity}, {buddy.homeState}
        </div>
        <div className="mt-2">
          <span className="badge badge-muted">{SKILL_LEVEL_LABELS[buddy.skillLevel]}</span>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-[var(--foreground-tertiary)] opacity-50 mt-1" />
    </Link>
  );
}
