import { Link } from 'react-router-dom';
import { Flag, ClipboardList, Users, Plane, User, Settings } from 'lucide-react';

interface NavIconProps {
  to: string;
  icon: React.ElementType;
  label: string;
  className?: string;
}

function NavIcon({ to, icon: Icon, label, className = '' }: NavIconProps) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-2 transition-all hover:scale-110 active:scale-95 ${className}`}
    >
      <Icon className="w-12 h-12 text-[var(--foreground)]" strokeWidth={1} />
      <span className="text-sm text-[var(--foreground-muted)]">{label}</span>
    </Link>
  );
}

export function LandingPage() {
  return (
    <div className="h-dvh bg-[var(--background)] relative">
      {/* Logo - centered on screen */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="w-44 h-44 rounded-full bg-[var(--primary)] flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Flag className="w-20 h-20 text-white" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-wide">
          JDGA
        </h1>
      </div>

      {/* Icons - 120px from bottom */}
      <div className="absolute bottom-[120px] left-1/2 -translate-x-1/2">
        <div className="grid grid-cols-3 gap-x-12 gap-y-8">
          <NavIcon to="/courses" icon={Flag} label="Courses" />
          <NavIcon to="/scorecards" icon={ClipboardList} label="Scorecards" />
          <NavIcon to="/buddies" icon={Users} label="People" />
          <NavIcon to="/trips" icon={Plane} label="Trips" />
          <NavIcon to="/profile" icon={User} label="Me" />
          <NavIcon to="/profile/settings" icon={Settings} label="Settings" />
        </div>
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-[var(--foreground-muted)]">
        Last updated: {new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        })}{' '}
        {new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })}
      </p>
    </div>
  );
}
