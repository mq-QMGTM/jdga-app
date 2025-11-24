import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backPath?: string;
  rightAction?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  showBack = false,
  backPath,
  rightAction,
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--background)]">
      <div className="flex items-center justify-between h-12 px-4 max-w-lg mx-auto">
        <div className="w-12 flex items-center">
          {showBack && (
            <button
              onClick={handleBack}
              className="flex items-center gap-0.5 text-[var(--primary)] font-normal text-[17px]"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={2} />
              <span>Back</span>
            </button>
          )}
        </div>
        <h1 className="text-[17px] font-semibold text-[var(--foreground)]">{title}</h1>
        <div className="w-12 flex items-center justify-end">{rightAction}</div>
      </div>
      {subtitle && (
        <p className="text-center text-sm text-[var(--foreground-tertiary)] pb-2">{subtitle}</p>
      )}
    </header>
  );
}

// Large header for main section pages (iOS-style)
interface LargeHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function LargeHeader({ title, subtitle, children }: LargeHeaderProps) {
  return (
    <div className="page-header">
      <h1 className="page-header-title">{title}</h1>
      {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
