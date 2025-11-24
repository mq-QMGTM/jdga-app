import { Link } from 'react-router-dom';
import { LargeHeader } from '@/components/layout/PageHeader';
import { Flag, Globe, CheckCircle, Trophy, Star, ChevronRight } from 'lucide-react';

interface NavRowProps {
  to: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  subtitle?: string;
  badge?: string;
}

function NavRow({ to, icon: Icon, iconBg, iconColor, label, subtitle, badge }: NavRowProps) {
  return (
    <Link to={to} className="nav-row">
      <div className="nav-row-icon" style={{ backgroundColor: iconBg }}>
        <Icon className="w-5 h-5" style={{ color: iconColor }} strokeWidth={1.5} />
      </div>
      <div className="nav-row-content">
        <div className="nav-row-title">{label}</div>
        {subtitle && <div className="nav-row-subtitle">{subtitle}</div>}
      </div>
      {badge && <span className="badge badge-muted">{badge}</span>}
      <ChevronRight className="w-5 h-5 nav-row-chevron" />
    </Link>
  );
}

export function CoursesHomePage() {
  return (
    <div className="pb-safe">
      <LargeHeader
        title="Courses"
        subtitle="Explore and track the best courses"
      />

      <div className="px-5 space-y-6 mt-2">
        {/* Main course lists */}
        <div className="list-group">
          <NavRow
            to="/courses/top-us"
            icon={Flag}
            iconBg="#1d6f42"
            iconColor="white"
            label="Top US Courses"
            subtitle="America's Top 250 ranked by prestige"
          />
          <NavRow
            to="/courses/international"
            icon={Globe}
            iconBg="#007aff"
            iconColor="white"
            label="International"
            subtitle="Best courses in Europe, Asia & beyond"
          />
          <NavRow
            to="/courses/played"
            icon={CheckCircle}
            iconBg="#34c759"
            iconColor="white"
            label="My Played Courses"
            badge="0"
          />
        </div>

        {/* More options */}
        <div>
          <p className="section-header">More</p>
          <div className="list-group">
            <NavRow
              to="/profile/tournaments"
              icon={Trophy}
              iconBg="#d4a634"
              iconColor="white"
              label="Major Championship Hosts"
              subtitle="US Open, Masters, PGA & The Open venues"
            />
            <NavRow
              to="/profile/favorites"
              icon={Star}
              iconBg="#ff9500"
              iconColor="white"
              label="My Favorites"
              subtitle="Favorite holes, clubhouse items & more"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
