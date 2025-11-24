import { useState, useEffect } from 'react';
import { LargeHeader } from '@/components/layout/PageHeader';
import { Plus, Plane, Calendar, MapPin, Sun, ChevronRight } from 'lucide-react';
import type { GolfTrip } from '@/types';
import { getUpcomingTrips, getPastTrips } from '@/lib/storage';
import { formatDate } from '@/lib/utils';

const styles = {
  page: {
    paddingBottom: 'calc(env(safe-area-inset-bottom) + 70px)',
    backgroundColor: '#000',
    minHeight: '100vh',
    WebkitFontSmoothing: 'antialiased' as const,
  },
  featureCard: {
    margin: '16px 20px 0',
    backgroundColor: '#1c1c1e',
    borderRadius: '14px',
    padding: '20px',
  },
  featureRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  featureIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    backgroundColor: '#ff9500',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: '17px',
    fontWeight: 600,
    color: '#fff',
  },
  featureDesc: {
    fontSize: '15px',
    color: '#6b7280',
    marginTop: '4px',
    lineHeight: 1.4,
  },
  featureButton: {
    width: '100%',
    marginTop: '16px',
    padding: '14px 20px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    color: '#22c55e',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
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
  tripCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: '14px',
    padding: '16px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  tripIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
  },
  tripContent: {
    flex: 1,
    minWidth: 0,
  },
  tripName: {
    fontSize: '17px',
    fontWeight: 500,
    color: '#fff',
  },
  tripMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '6px',
    fontSize: '14px',
    color: '#6b7280',
  },
  tripMetaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  tripBadge: {
    marginTop: '8px',
    display: 'inline-block',
    padding: '4px 12px',
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
  infoCard: {
    margin: '24px 20px 0',
    backgroundColor: '#1c1c1e',
    borderRadius: '14px',
    padding: '20px',
  },
  infoTitle: {
    fontSize: '17px',
    fontWeight: 600,
    color: '#fff',
  },
  infoDesc: {
    fontSize: '15px',
    color: '#6b7280',
    marginTop: '8px',
    lineHeight: 1.4,
  },
};

export function TripsPage() {
  const [upcomingTrips, setUpcomingTrips] = useState<GolfTrip[]>([]);
  const [pastTrips, setPastTrips] = useState<GolfTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const [upcoming, past] = await Promise.all([getUpcomingTrips(), getPastTrips()]);
      setUpcomingTrips(upcoming);
      setPastTrips(past);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <LargeHeader title="Golf Trips" subtitle="Plan and track your golf adventures">
        <button className="btn-primary">
          <Plus style={{ width: '20px', height: '20px' }} strokeWidth={2} />
          Plan Trip
        </button>
      </LargeHeader>

      {/* Weather suggestion card */}
      <div style={styles.featureCard}>
        <div style={styles.featureRow}>
          <div style={styles.featureIcon}>
            <Sun style={{ width: '24px', height: '24px', color: '#fff' }} strokeWidth={1.5} />
          </div>
          <div style={styles.featureContent}>
            <h3 style={styles.featureTitle}>Weather-Aware Suggestions</h3>
            <p style={styles.featureDesc}>Get optimal courses based on current conditions</p>
          </div>
        </div>
        <button style={styles.featureButton}>Find Best Courses This Month</button>
      </div>

      {/* Upcoming trips */}
      <div style={styles.section}>
        <p style={styles.sectionHeader}>Upcoming Trips</p>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 0' }}>
            <div className="spinner" />
          </div>
        ) : upcomingTrips.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <Plane style={{ width: '32px', height: '32px', color: '#22c55e' }} strokeWidth={1.5} />
            </div>
            <h3 style={styles.emptyTitle}>No Upcoming Trips</h3>
            <p style={styles.emptyDesc}>
              Plan your next golf adventure and track all the details.
            </p>
            <button className="btn-primary" style={{ marginTop: '20px' }}>
              <Plus style={{ width: '20px', height: '20px' }} />
              Plan Your First Trip
            </button>
          </div>
        ) : (
          <div style={styles.cardList}>
            {upcomingTrips.map((trip) => (
              <TripRow key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>

      {/* Past trips */}
      {pastTrips.length > 0 && (
        <div style={styles.section}>
          <p style={styles.sectionHeader}>Past Trips</p>
          <div style={styles.cardList}>
            {pastTrips.slice(0, 5).map((trip) => (
              <TripRow key={trip.id} trip={trip} isPast />
            ))}
          </div>
        </div>
      )}

      {/* Non-golf trip card */}
      <div style={styles.infoCard}>
        <h4 style={styles.infoTitle}>Have a Non-Golf Trip Planned?</h4>
        <p style={styles.infoDesc}>
          Tell us where you're going and we'll suggest the best courses nearby.
        </p>
        <button style={{ ...styles.featureButton, marginTop: '16px' }}>Find Courses Near My Trip</button>
      </div>
    </div>
  );
}

function TripRow({ trip, isPast }: { trip: GolfTrip; isPast?: boolean }) {
  return (
    <div style={{ ...styles.tripCard, opacity: isPast ? 0.6 : 1 }}>
      <div style={styles.tripIcon}>
        <Plane style={{ width: '24px', height: '24px', color: '#fff' }} strokeWidth={1.5} />
      </div>
      <div style={styles.tripContent}>
        <div style={styles.tripName}>{trip.name}</div>
        <div style={styles.tripMeta}>
          <span style={styles.tripMetaItem}>
            <MapPin style={{ width: '14px', height: '14px' }} />
            {trip.destination}
          </span>
          <span style={styles.tripMetaItem}>
            <Calendar style={{ width: '14px', height: '14px' }} />
            {formatDate(trip.startDate)}
          </span>
        </div>
        <span style={styles.tripBadge}>
          {trip.plannedCourses.length} {trip.plannedCourses.length === 1 ? 'course' : 'courses'}
        </span>
      </div>
      <ChevronRight style={{ width: '20px', height: '20px', color: '#4b5563', flexShrink: 0 }} />
    </div>
  );
}
