import { Link } from 'react-router-dom';
import { LargeHeader } from '@/components/layout/PageHeader';
import { Settings, Trophy, Star, Flag, Moon, Sun, ChevronRight } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ProfilePage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="pb-safe">
      <LargeHeader title="Profile" subtitle="Manage your golf life" />

      {/* User card */}
      <div className="px-5 mt-2">
        <div className="card p-5">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <span className="text-xl font-bold text-white">JD</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">JDGA Member</h2>
              <p className="text-[15px] text-[var(--foreground-tertiary)]">The JDGA Official App</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="px-5 mt-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Courses</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Rounds</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Buddies</div>
          </div>
        </div>
      </div>

      {/* Golf section */}
      <p className="section-header">Golf</p>
      <div className="px-5">
        <div className="list-group">
          <NavRow to="/profile/memberships" icon={Flag} iconBg="#1d6f42" label="My Memberships" />
          <NavRow to="/profile/favorites" icon={Star} iconBg="#ff9500" label="Favorites" />
          <NavRow to="/profile/tournaments" icon={Trophy} iconBg="#d4a634" label="Tournament History" />
        </div>
      </div>

      {/* Settings section */}
      <p className="section-header">Settings</p>
      <div className="px-5">
        <div className="list-group">
          <NavRow to="/profile/settings" icon={Settings} iconBg="#8e8e93" label="Settings" />

          {/* Theme toggle */}
          <div className="nav-row" style={{ cursor: 'default' }}>
            <div
              className="nav-row-icon"
              style={{ backgroundColor: theme === 'dark' ? '#5856d6' : '#007aff' }}
            >
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-white" strokeWidth={1.5} />
              ) : (
                <Sun className="w-5 h-5 text-white" strokeWidth={1.5} />
              )}
            </div>
            <div className="nav-row-content">
              <div className="nav-row-title">Theme</div>
            </div>
            <div className="flex gap-1 bg-[var(--separator)] rounded-lg p-1">
              {(['light', 'dark', 'system'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all capitalize ${
                    theme === t
                      ? 'bg-[var(--card)] shadow-sm text-[var(--foreground)]'
                      : 'text-[var(--foreground-tertiary)]'
                  }`}
                >
                  {t === 'system' ? 'Auto' : t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* App info */}
      <div className="px-5 py-8 text-center">
        <p className="text-[15px] font-medium text-[var(--foreground-tertiary)]">
          The JDGA Official App
        </p>
        <p className="text-[13px] text-[var(--foreground-tertiary)] mt-1">
          v1.0.0 &middot; Built for the serious golf enthusiast
        </p>
      </div>
    </div>
  );
}

function NavRow({
  to,
  icon: Icon,
  iconBg,
  label,
}: {
  to: string;
  icon: React.ElementType;
  iconBg: string;
  label: string;
}) {
  return (
    <Link to={to} className="nav-row">
      <div className="nav-row-icon" style={{ backgroundColor: iconBg }}>
        <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
      </div>
      <div className="nav-row-content">
        <div className="nav-row-title">{label}</div>
      </div>
      <ChevronRight className="w-5 h-5 nav-row-chevron" />
    </Link>
  );
}
