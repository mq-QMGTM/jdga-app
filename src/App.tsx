import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { BottomNav } from '@/components/layout/BottomNav';
import { LandingPage } from '@/pages/LandingPage';
import { CoursesHomePage } from '@/pages/courses/CoursesHomePage';
import { TopUSCoursesPage } from '@/pages/courses/TopUSCoursesPage';
import { InternationalCoursesPage } from '@/pages/courses/InternationalCoursesPage';
import { CourseDetailPage } from '@/pages/courses/CourseDetailPage';
import { MyPlayedCoursesPage } from '@/pages/courses/MyPlayedCoursesPage';
import { ScorecardsPage } from '@/pages/scorecards/ScorecardsPage';
import { AddScorecardPage } from '@/pages/scorecards/AddScorecardPage';
import { BuddiesPage } from '@/pages/buddies/BuddiesPage';
import { BuddyDetailPage } from '@/pages/buddies/BuddyDetailPage';
import { AddBuddyPage } from '@/pages/buddies/AddBuddyPage';
import { TripsPage } from '@/pages/trips/TripsPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { SettingsPage } from '@/pages/profile/SettingsPage';
import { MembershipsPage } from '@/pages/profile/MembershipsPage';
import { TournamentHistoryPage } from '@/pages/profile/TournamentHistoryPage';
import { FavoritesPage } from '@/pages/profile/FavoritesPage';
import { useInitializeData } from '@/hooks/useInitializeData';

function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  // Initialize app data (load courses into IndexedDB)
  const { isLoading } = useInitializeData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-[var(--background)]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">JD</span>
          </div>
          <p className="text-[var(--foreground-muted)] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--background)]">
      <main className={`flex-1 ${!isLandingPage ? 'pb-20' : ''}`}>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Courses */}
          <Route path="/courses" element={<CoursesHomePage />} />
          <Route path="/courses/top-us" element={<TopUSCoursesPage />} />
          <Route path="/courses/international" element={<InternationalCoursesPage />} />
          <Route path="/courses/played" element={<MyPlayedCoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />

          {/* Scorecards */}
          <Route path="/scorecards" element={<ScorecardsPage />} />
          <Route path="/scorecards/add" element={<AddScorecardPage />} />
          <Route path="/scorecards/add/:courseId" element={<AddScorecardPage />} />

          {/* Buddies */}
          <Route path="/buddies" element={<BuddiesPage />} />
          <Route path="/buddies/add" element={<AddBuddyPage />} />
          <Route path="/buddies/:id" element={<BuddyDetailPage />} />

          {/* Trips */}
          <Route path="/trips" element={<TripsPage />} />

          {/* Profile */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/settings" element={<SettingsPage />} />
          <Route path="/profile/memberships" element={<MembershipsPage />} />
          <Route path="/profile/tournaments" element={<TournamentHistoryPage />} />
          <Route path="/profile/favorites" element={<FavoritesPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isLandingPage && <BottomNav />}
    </div>
  );
}

export default App;
