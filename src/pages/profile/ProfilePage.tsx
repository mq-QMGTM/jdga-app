import { Link } from 'react-router-dom';
import { LargeHeader } from '@/components/layout/PageHeader';
import { Settings, Trophy, Star, Flag, Moon, Sun, ChevronRight } from 'lucide-react';
import { useTheme } from 'next-themes';

const styles = {
  page: {
    paddingBottom: 'calc(env(safe-area-inset-bottom) + 70px)',
    backgroundColor: '#000',
    minHeight: '100vh',
    WebkitFontSmoothing: 'antialiased' as const,
  },
  userCard: {
    margin: '12px 20px 0',
    backgroundColor: '#1c1c1e',
    borderRadius: '14px',
    padding: '20px',
  },
  userRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#fff',
  },
  userName: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#fff',
    letterSpacing: '-0.3px',
  },
  userSubtitle: {
    fontSize: '15px',
    color: '#6b7280',
    marginTop: '4px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    margin: '16px 20px 0',
  },
  statCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: '14px',
    padding: '18px 16px',
    textAlign: 'center' as const,
  },
  statValue: {
    fontSize: '26px',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-0.5px',
  },
  statLabel: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '6px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  sectionHeader: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
    padding: '28px 24px 12px',
  },
  listGroup: {
    margin: '0 20px',
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
  navTitle: {
    flex: 1,
    fontSize: '17px',
    fontWeight: 400,
    color: '#fff',
  },
  themeToggle: {
    display: 'flex',
    gap: '4px',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: '8px',
    padding: '4px',
  },
  themeButton: {
    padding: '8px 12px',
    fontSize: '14px',
    fontWeight: 500,
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    textTransform: 'capitalize' as const,
  },
  themeActive: {
    backgroundColor: '#2c2c2e',
    color: '#fff',
  },
  themeInactive: {
    backgroundColor: 'transparent',
    color: '#6b7280',
  },
  footer: {
    padding: '32px 20px',
    textAlign: 'center' as const,
  },
  footerTitle: {
    fontSize: '15px',
    fontWeight: 500,
    color: '#6b7280',
  },
  footerSub: {
    fontSize: '13px',
    color: '#4b5563',
    marginTop: '4px',
  },
};

export function ProfilePage() {
  const { theme, setTheme } = useTheme();

  return (
    <div style={styles.page}>
      <LargeHeader title="Profile" subtitle="Manage your golf life" />

      {/* User card */}
      <div style={styles.userCard}>
        <div style={styles.userRow}>
          <div style={styles.avatar}>
            <span style={styles.avatarText}>JD</span>
          </div>
          <div>
            <h2 style={styles.userName}>JDGA Member</h2>
            <p style={styles.userSubtitle}>The JDGA Official App</p>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>0</div>
          <div style={styles.statLabel}>Courses</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>0</div>
          <div style={styles.statLabel}>Rounds</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>0</div>
          <div style={styles.statLabel}>Buddies</div>
        </div>
      </div>

      {/* Golf section */}
      <p style={styles.sectionHeader}>Golf</p>
      <div style={styles.listGroup}>
        <NavRow to="/profile/memberships" icon={Flag} iconBg="#1d6f42" label="My Memberships" />
        <NavRow to="/profile/favorites" icon={Star} iconBg="#ff9500" label="Favorites" />
        <NavRow to="/profile/tournaments" icon={Trophy} iconBg="#d4a634" label="Tournament History" isLast />
      </div>

      {/* Settings section */}
      <p style={styles.sectionHeader}>Settings</p>
      <div style={styles.listGroup}>
        <NavRow to="/profile/settings" icon={Settings} iconBg="#8e8e93" label="Settings" />

        {/* Theme toggle */}
        <div style={{ ...styles.navRow, ...styles.navRowLast, cursor: 'default' }}>
          <div style={{ ...styles.navIcon, backgroundColor: theme === 'dark' ? '#5856d6' : '#007aff' }}>
            {theme === 'dark' ? (
              <Moon style={{ width: '20px', height: '20px', color: '#fff' }} strokeWidth={1.5} />
            ) : (
              <Sun style={{ width: '20px', height: '20px', color: '#fff' }} strokeWidth={1.5} />
            )}
          </div>
          <span style={styles.navTitle}>Theme</span>
          <div style={styles.themeToggle}>
            {(['light', 'dark', 'system'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                style={{
                  ...styles.themeButton,
                  ...(theme === t ? styles.themeActive : styles.themeInactive),
                }}
              >
                {t === 'system' ? 'Auto' : t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* App info */}
      <div style={styles.footer}>
        <p style={styles.footerTitle}>The JDGA Official App</p>
        <p style={styles.footerSub}>v1.0.0 · Built for the serious golf enthusiast</p>
      </div>
    </div>
  );
}

function NavRow({
  to,
  icon: Icon,
  iconBg,
  label,
  isLast = false,
}: {
  to: string;
  icon: React.ElementType;
  iconBg: string;
  label: string;
  isLast?: boolean;
}) {
  return (
    <Link to={to} style={{ ...styles.navRow, ...(isLast ? styles.navRowLast : {}) }}>
      <div style={{ ...styles.navIcon, backgroundColor: iconBg }}>
        <Icon style={{ width: '20px', height: '20px', color: '#fff' }} strokeWidth={1.5} />
      </div>
      <span style={styles.navTitle}>{label}</span>
      <ChevronRight style={{ width: '20px', height: '20px', color: '#4b5563' }} />
    </Link>
  );
}
