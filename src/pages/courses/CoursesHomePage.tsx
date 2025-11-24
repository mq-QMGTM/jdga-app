import { Link } from 'react-router-dom';
import { LargeHeader } from '@/components/layout/PageHeader';
import { Flag, Globe, CheckCircle, Trophy, Star, ChevronRight } from 'lucide-react';

const styles = {
  page: {
    paddingBottom: 'calc(env(safe-area-inset-bottom) + 70px)',
    backgroundColor: '#000',
    minHeight: '100vh',
    WebkitFontSmoothing: 'antialiased' as const,
  },
  content: {
    padding: '0 20px',
    marginTop: '12px',
  },
  listGroup: {
    backgroundColor: '#1c1c1e',
    borderRadius: '14px',
    overflow: 'hidden',
  },
  navRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 18px',
    gap: '14px',
    textDecoration: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  navRowLast: {
    borderBottom: 'none',
  },
  navIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  navContent: {
    flex: 1,
    minWidth: 0,
  },
  navTitle: {
    fontSize: '17px',
    fontWeight: 400,
    color: '#fff',
    lineHeight: 1.3,
  },
  navSubtitle: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '3px',
    lineHeight: 1.3,
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '100px',
    fontSize: '13px',
    fontWeight: 500,
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#9ca3af',
  },
  sectionHeader: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
    padding: '28px 4px 12px',
  },
  section: {
    marginTop: '0',
  },
};

interface NavRowProps {
  to: string;
  icon: React.ElementType;
  iconBg: string;
  label: string;
  subtitle?: string;
  badge?: string;
  isLast?: boolean;
}

function NavRow({ to, icon: Icon, iconBg, label, subtitle, badge, isLast = false }: NavRowProps) {
  return (
    <Link to={to} style={{ ...styles.navRow, ...(isLast ? styles.navRowLast : {}) }}>
      <div style={{ ...styles.navIcon, backgroundColor: iconBg }}>
        <Icon style={{ width: '20px', height: '20px', color: '#fff' }} strokeWidth={1.5} />
      </div>
      <div style={styles.navContent}>
        <div style={styles.navTitle}>{label}</div>
        {subtitle && <div style={styles.navSubtitle}>{subtitle}</div>}
      </div>
      {badge && <span style={styles.badge}>{badge}</span>}
      <ChevronRight style={{ width: '20px', height: '20px', color: '#4b5563', flexShrink: 0 }} />
    </Link>
  );
}

export function CoursesHomePage() {
  return (
    <div style={styles.page}>
      <LargeHeader
        title="Courses"
        subtitle="Explore and track the best courses"
      />

      <div style={styles.content}>
        {/* Main course lists */}
        <div style={styles.listGroup}>
          <NavRow
            to="/courses/top-us"
            icon={Flag}
            iconBg="#1d6f42"
            label="Top US Courses"
            subtitle="America's Top 250 ranked by prestige"
          />
          <NavRow
            to="/courses/international"
            icon={Globe}
            iconBg="#007aff"
            label="International"
            subtitle="Best courses in Europe, Asia & beyond"
          />
          <NavRow
            to="/courses/played"
            icon={CheckCircle}
            iconBg="#34c759"
            label="My Played Courses"
            badge="0"
            isLast
          />
        </div>

        {/* More options */}
        <div style={styles.section}>
          <p style={styles.sectionHeader}>More</p>
          <div style={styles.listGroup}>
            <NavRow
              to="/profile/tournaments"
              icon={Trophy}
              iconBg="#d4a634"
              label="Major Championship Hosts"
              subtitle="US Open, Masters, PGA & The Open venues"
            />
            <NavRow
              to="/profile/favorites"
              icon={Star}
              iconBg="#ff9500"
              label="My Favorites"
              subtitle="Favorite holes, clubhouse items & more"
              isLast
            />
          </div>
        </div>
      </div>
    </div>
  );
}
