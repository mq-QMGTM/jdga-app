import { cn } from '@/lib/utils';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterPillsProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterPills({ options, value, onChange }: FilterPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all',
            value === option.value
              ? 'bg-[var(--primary)] text-white'
              : 'bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:bg-[var(--border)]'
          )}
        >
          {option.label}
          {option.count !== undefined && (
            <span className="ml-1 opacity-70">({option.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}
