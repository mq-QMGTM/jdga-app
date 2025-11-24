import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LargeHeader } from '@/components/layout/PageHeader';
import { Plus, ClipboardList, ChevronRight } from 'lucide-react';
import type { Scorecard } from '@/types';
import { getAllScorecards, getScorecardStats } from '@/lib/storage';
import { formatDate, formatScoreToPar } from '@/lib/utils';

export function ScorecardsPage() {
  const [scorecards, setScorecards] = useState<Scorecard[]>([]);
  const [stats, setStats] = useState<{
    totalRounds: number;
    averageScore: number;
    bestScore: number;
    roundsThisYear: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cards, scoreStats] = await Promise.all([getAllScorecards(), getScorecardStats()]);
      setScorecards(cards);
      setStats(scoreStats);
    } catch (error) {
      console.error('Error loading scorecards:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-safe">
      <LargeHeader title="Scorecards" subtitle="Track your rounds and scores">
        <Link to="/scorecards/add" className="btn-primary">
          <Plus className="w-5 h-5" strokeWidth={2} />
          Add Scorecard
        </Link>
      </LargeHeader>

      {/* Stats */}
      {stats && stats.totalRounds > 0 && (
        <div className="px-5 mt-4">
          <div className="grid grid-cols-4 gap-3">
            <div className="stat-card">
              <div className="stat-value">{stats.totalRounds}</div>
              <div className="stat-label">Rounds</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.averageScore}</div>
              <div className="stat-label">Average</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.bestScore}</div>
              <div className="stat-label">Best</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.roundsThisYear}</div>
              <div className="stat-label">This Year</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent scorecards */}
      <div className="px-5 mt-6">
        <p className="section-header px-0">Recent Rounds</p>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="spinner" />
          </div>
        ) : scorecards.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">
                <ClipboardList className="w-8 h-8 text-[var(--primary)]" strokeWidth={1.5} />
              </div>
              <h3 className="empty-state-title">No Scorecards Yet</h3>
              <p className="empty-state-description">
                Record your rounds to track progress and see your scoring history.
              </p>
              <Link to="/scorecards/add" className="btn-primary mt-5">
                <Plus className="w-5 h-5" />
                Add Your First Scorecard
              </Link>
            </div>
          </div>
        ) : (
          <div className="card-list">
            {scorecards.slice(0, 10).map((scorecard) => (
              <ScorecardRow key={scorecard.id} scorecard={scorecard} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ScorecardRow({ scorecard }: { scorecard: Scorecard }) {
  return (
    <Link to={`/scorecards/${scorecard.id}`} className="card-list-item">
      <div className="flex-1 min-w-0">
        <div className="text-[17px] font-medium text-[var(--foreground)]">{scorecard.courseName}</div>
        <div className="text-[14px] text-[var(--foreground-tertiary)] mt-1">{formatDate(scorecard.date)}</div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-[var(--foreground)]">{scorecard.totalScore}</div>
        <div className="text-[14px] font-medium text-[var(--primary)]">
          {formatScoreToPar(scorecard.scoreToPar)}
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-[var(--foreground-tertiary)] opacity-50" />
    </Link>
  );
}
