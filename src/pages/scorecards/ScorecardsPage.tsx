import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LargeHeader } from '@/components/layout/PageHeader';
import { Plus, ClipboardList, ChevronRight } from 'lucide-react';
import type { Scorecard } from '@/types';
import { getAllScorecards, getScorecardStats } from '@/lib/storage';
import { formatDate, formatScoreToPar } from '@/lib/utils';

const styles = {
  page: {
    paddingBottom: 'calc(env(safe-area-inset-bottom) + 70px)',
    backgroundColor: '#000',
    minHeight: '100vh',
    WebkitFontSmoothing: 'antialiased' as const,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    margin: '16px 20px 0',
  },
  statCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: '14px',
    padding: '16px 12px',
    textAlign: 'center' as const,
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-0.5px',
  },
  statLabel: {
    fontSize: '11px',
    color: '#6b7280',
    marginTop: '4px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  section: {
    padding: '0 20px',
    marginTop: '24px',
  },
  sectionHeader: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
    marginBottom: '12px',
    paddingLeft: '4px',
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  scorecardRow: {
    backgroundColor: '#1c1c1e',
    borderRadius: '14px',
    padding: '16px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    textDecoration: 'none',
  },
  rowContent: {
    flex: 1,
    minWidth: 0,
  },
  courseName: {
    fontSize: '17px',
    fontWeight: 500,
    color: '#fff',
  },
  courseDate: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '4px',
  },
  scoreSection: {
    textAlign: 'right' as const,
  },
  totalScore: {
    fontSize: '26px',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-0.5px',
  },
  scoreToPar: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#22c55e',
    marginTop: '2px',
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
    <div style={styles.page}>
      <LargeHeader title="Scorecards" subtitle="Track your rounds and scores">
        <Link to="/scorecards/add" className="btn-primary">
          <Plus style={{ width: '20px', height: '20px' }} strokeWidth={2} />
          Add Scorecard
        </Link>
      </LargeHeader>

      {/* Stats */}
      {stats && stats.totalRounds > 0 && (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.totalRounds}</div>
            <div style={styles.statLabel}>Rounds</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.averageScore}</div>
            <div style={styles.statLabel}>Average</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.bestScore}</div>
            <div style={styles.statLabel}>Best</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.roundsThisYear}</div>
            <div style={styles.statLabel}>This Year</div>
          </div>
        </div>
      )}

      {/* Recent scorecards */}
      <div style={styles.section}>
        <p style={styles.sectionHeader}>Recent Rounds</p>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 0' }}>
            <div className="spinner" />
          </div>
        ) : scorecards.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <ClipboardList style={{ width: '32px', height: '32px', color: '#22c55e' }} strokeWidth={1.5} />
            </div>
            <h3 style={styles.emptyTitle}>No Scorecards Yet</h3>
            <p style={styles.emptyDesc}>
              Record your rounds to track progress and see your scoring history.
            </p>
            <Link to="/scorecards/add" className="btn-primary" style={{ marginTop: '20px', display: 'inline-flex' }}>
              <Plus style={{ width: '20px', height: '20px' }} />
              Add Your First Scorecard
            </Link>
          </div>
        ) : (
          <div style={styles.cardList}>
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
    <Link to={`/scorecards/${scorecard.id}`} style={styles.scorecardRow}>
      <div style={styles.rowContent}>
        <div style={styles.courseName}>{scorecard.courseName}</div>
        <div style={styles.courseDate}>{formatDate(scorecard.date)}</div>
      </div>
      <div style={styles.scoreSection}>
        <div style={styles.totalScore}>{scorecard.totalScore}</div>
        <div style={styles.scoreToPar}>{formatScoreToPar(scorecard.scoreToPar)}</div>
      </div>
      <ChevronRight style={{ width: '20px', height: '20px', color: '#4b5563', flexShrink: 0 }} />
    </Link>
  );
}
