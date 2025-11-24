import { useState, useEffect } from 'react';
import { LargeHeader } from '@/components/layout/PageHeader';
import { Plus, Plane, Calendar, MapPin, Sun, ChevronRight } from 'lucide-react';
import type { GolfTrip } from '@/types';
import { getUpcomingTrips, getPastTrips } from '@/lib/storage';
import { formatDate } from '@/lib/utils';

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
    <div className="pb-safe">
      <LargeHeader title="Golf Trips" subtitle="Plan and track your golf adventures">
        <button className="btn-primary">
          <Plus className="w-5 h-5" strokeWidth={2} />
          Plan Trip
        </button>
      </LargeHeader>

      {/* Weather suggestion card */}
      <div className="px-5 mt-4">
        <div className="card p-5">
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#ff9500' }}
            >
              <Sun className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-[17px] font-semibold text-[var(--foreground)]">
                Weather-Aware Suggestions
              </h3>
              <p className="text-[15px] text-[var(--foreground-tertiary)] mt-1">
                Get optimal courses based on current conditions
              </p>
            </div>
          </div>
          <button className="btn-secondary w-full mt-4">Find Best Courses This Month</button>
        </div>
      </div>

      {/* Upcoming trips */}
      <div className="px-5 mt-6">
        <p className="section-header px-0">Upcoming Trips</p>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="spinner" />
          </div>
        ) : upcomingTrips.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">
                <Plane className="w-8 h-8 text-[var(--primary)]" strokeWidth={1.5} />
              </div>
              <h3 className="empty-state-title">No Upcoming Trips</h3>
              <p className="empty-state-description">
                Plan your next golf adventure and track all the details.
              </p>
              <button className="btn-primary mt-5">
                <Plus className="w-5 h-5" />
                Plan Your First Trip
              </button>
            </div>
          </div>
        ) : (
          <div className="card-list">
            {upcomingTrips.map((trip) => (
              <TripRow key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>

      {/* Past trips */}
      {pastTrips.length > 0 && (
        <div className="px-5 mt-6">
          <p className="section-header px-0">Past Trips</p>
          <div className="card-list">
            {pastTrips.slice(0, 5).map((trip) => (
              <TripRow key={trip.id} trip={trip} isPast />
            ))}
          </div>
        </div>
      )}

      {/* Non-golf trip card */}
      <div className="px-5 mt-6">
        <div className="card p-5">
          <h4 className="text-[17px] font-semibold text-[var(--foreground)]">
            Have a Non-Golf Trip Planned?
          </h4>
          <p className="text-[15px] text-[var(--foreground-tertiary)] mt-2">
            Tell us where you're going and we'll suggest the best courses nearby.
          </p>
          <button className="btn-secondary mt-4">Find Courses Near My Trip</button>
        </div>
      </div>
    </div>
  );
}

function TripRow({ trip, isPast }: { trip: GolfTrip; isPast?: boolean }) {
  return (
    <div className={`card-list-item ${isPast ? 'opacity-60' : ''}`}>
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: 'var(--primary)' }}
      >
        <Plane className="w-6 h-6 text-white" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[17px] font-medium text-[var(--foreground)]">{trip.name}</div>
        <div className="flex items-center gap-4 mt-1.5 text-[14px] text-[var(--foreground-tertiary)]">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {trip.destination}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(trip.startDate)}
          </span>
        </div>
        <div className="mt-2">
          <span className="badge badge-muted">
            {trip.plannedCourses.length} {trip.plannedCourses.length === 1 ? 'course' : 'courses'}
          </span>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-[var(--foreground-tertiary)] opacity-50 mt-1" />
    </div>
  );
}
