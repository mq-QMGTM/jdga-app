import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { FilterPills } from '@/components/shared/FilterPills';
import { Star, Flag, Coffee, ShoppingBag, GripVertical } from 'lucide-react';
import type { FavoriteHole } from '@/types';
import { getAllFavoriteHoles } from '@/lib/storage';

type FavoriteTab = 'holes' | 'clubhouse' | 'merch';

const tabOptions = [
  { value: 'holes', label: 'Favorite Holes' },
  { value: 'clubhouse', label: 'Clubhouse' },
  { value: 'merch', label: 'Merch' },
];

export function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<FavoriteTab>('holes');
  const [favoriteHoles, setFavoriteHoles] = useState<FavoriteHole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const holes = await getAllFavoriteHoles();
      setFavoriteHoles(holes);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-safe">
      <PageHeader title="My Favorites" showBack />

      {/* Tabs */}
      <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
        <FilterPills
          options={tabOptions}
          value={activeTab}
          onChange={(value) => setActiveTab(value as FavoriteTab)}
        />
      </div>

      <div className="px-4 py-4">
        {activeTab === 'holes' && (
          <FavoriteHolesSection holes={favoriteHoles} loading={loading} />
        )}
        {activeTab === 'clubhouse' && <ClubhouseSection />}
        {activeTab === 'merch' && <MerchSection />}
      </div>
    </div>
  );
}

function FavoriteHolesSection({ holes, loading }: { holes: FavoriteHole[]; loading: boolean }) {
  if (loading) {
    return <div className="text-center py-8 text-[var(--foreground-muted)]">Loading...</div>;
  }

  if (holes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-4">
          <Flag className="w-8 h-8 text-[var(--foreground-muted)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--foreground)]">No Favorite Holes Yet</h3>
        <p className="text-sm text-[var(--foreground-muted)] text-center mt-2 max-w-xs">
          Mark your favorite holes from course detail pages to build your global ranking.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {holes.map((hole) => (
        <div key={hole.id} className="card p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-[var(--accent-foreground)]">
              {hole.globalRank}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-[var(--foreground)] truncate">
              Hole {hole.holeNumber}
            </h4>
            <p className="text-xs text-[var(--foreground-muted)] truncate">{hole.courseName}</p>
          </div>
          <GripVertical className="w-4 h-4 text-[var(--foreground-muted)]" />
        </div>
      ))}
    </div>
  );
}

function ClubhouseSection() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-4">
        <Coffee className="w-8 h-8 text-[var(--foreground-muted)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--foreground)]">Clubhouse Favorites</h3>
      <p className="text-sm text-[var(--foreground-muted)] text-center mt-2 max-w-xs">
        Record your favorite drinks and menu items at each clubhouse.
      </p>

      <div className="w-full mt-6 card p-4 bg-[var(--background-secondary)]">
        <h4 className="font-medium text-[var(--foreground)] mb-2">How It Works</h4>
        <ul className="text-sm text-[var(--foreground-muted)] space-y-1">
          <li>- Visit a course detail page</li>
          <li>- Add your favorite drink or food item</li>
          <li>- View all favorites here</li>
        </ul>
      </div>
    </div>
  );
}

function MerchSection() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-4">
        <ShoppingBag className="w-8 h-8 text-[var(--foreground-muted)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--foreground)]">Merch Wishlist</h3>
      <p className="text-sm text-[var(--foreground-muted)] text-center mt-2 max-w-xs">
        Track apparel and souvenirs you want to buy at each club.
      </p>

      <div className="w-full mt-6 card p-4 bg-[var(--background-secondary)]">
        <h4 className="font-medium text-[var(--foreground)] mb-2">Features</h4>
        <ul className="text-sm text-[var(--foreground-muted)] space-y-1">
          <li>- Items for yourself</li>
          <li>- Gift ideas for others</li>
          <li>- Mark items as purchased</li>
        </ul>
      </div>
    </div>
  );
}
