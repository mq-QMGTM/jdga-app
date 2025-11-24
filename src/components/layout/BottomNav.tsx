import { NavLink, useLocation } from 'react-router-dom';
import { Flag, ClipboardList, Users, Plane, User } from 'lucide-react';

const navItems = [
  { label: 'Courses', icon: Flag, path: '/courses' },
  { label: 'Scorecards', icon: ClipboardList, path: '/scorecards' },
  { label: 'People', icon: Users, path: '/buddies' },
  { label: 'Trips', icon: Plane, path: '/trips' },
  { label: 'Me', icon: User, path: '/profile' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon strokeWidth={isActive ? 2.5 : 1.5} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
