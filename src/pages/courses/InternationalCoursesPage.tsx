import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Globe } from 'lucide-react';

type ContinentFilter = 'all' | 'europe' | 'asia' | 'oceania' | 'africa' | 'south_america';

const continentOptions: { value: ContinentFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'europe', label: 'Europe' },
  { value: 'asia', label: 'Asia' },
  { value: 'oceania', label: 'Oceania' },
  { value: 'africa', label: 'Africa' },
  { value: 'south_america', label: 'S. America' },
];

export function InternationalCoursesPage() {
  const [filter, setFilter] = useState<ContinentFilter>('all');

  return (
    <div className="pb-safe">
      <PageHeader title="International Courses" showBack />

      {/* Filters */}
      <div className="px-5 py-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {continentOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
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

      {/* Empty state */}
      <div className="px-5">
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Globe className="w-8 h-8 text-[var(--primary)]" strokeWidth={1.5} />
            </div>
            <h3 className="empty-state-title">International Courses</h3>
            <p className="empty-state-description">
              Top courses from Europe, Asia, Oceania, and beyond will be added soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
