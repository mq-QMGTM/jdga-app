import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { FilterPills } from '@/components/shared/FilterPills';
import { Trophy, Calendar, MapPin } from 'lucide-react';
import { MAJOR_CHAMPIONSHIPS, type MajorChampionship } from '@/types/tournament';

type MajorFilter = 'all' | MajorChampionship;

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'Masters', label: 'Masters' },
  { value: 'US Open', label: 'US Open' },
  { value: 'PGA Championship', label: 'PGA' },
  { value: 'The Open Championship', label: 'The Open' },
];

export function TournamentHistoryPage() {
  const [filter, setFilter] = useState<MajorFilter>('all');

  return (
    <div className="pb-safe">
      <PageHeader title="Tournament History" showBack />

      {/* Filters */}
      <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
        <FilterPills
          options={filterOptions}
          value={filter}
          onChange={(value) => setFilter(value as MajorFilter)}
        />
      </div>

      {/* Major championships overview */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3 mb-6">
          {Object.entries(MAJOR_CHAMPIONSHIPS).map(([key, major]) => (
            <div
              key={key}
              className="card p-4 cursor-pointer"
              style={{ borderLeftColor: major.color, borderLeftWidth: 4 }}
              onClick={() => setFilter(key as MajorChampionship)}
            >
              <h4 className="font-semibold text-[var(--foreground)] text-sm">{major.shortName}</h4>
              <p className="text-xs text-[var(--foreground-muted)] mt-1">{major.typicalMonth}</p>
            </div>
          ))}
        </div>

        {/* Placeholder for tournament data */}
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-16 h-16 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-[var(--foreground-muted)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Major Championship History</h3>
          <p className="text-sm text-[var(--foreground-muted)] text-center mt-2 max-w-xs">
            Historical records of host courses and top finishers will be loaded soon.
          </p>
        </div>

        {/* Info about what will be included */}
        <div className="card p-4 bg-[var(--background-secondary)] mt-4">
          <h4 className="font-medium text-[var(--foreground)] mb-2">Coming Soon</h4>
          <ul className="text-sm text-[var(--foreground-muted)] space-y-1">
            <li>- Historical host courses for each major</li>
            <li>- Top 3 finishers each year</li>
            <li>- Future confirmed host courses</li>
            <li>- Quick link to course details</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
