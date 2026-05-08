import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-9 h-9 rounded-sm transition-colors duration-150 hover:bg-[var(--color-graphite)]"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="h-4.5 w-4.5" style={{ color: 'var(--color-silver)' }} size={18} />
      ) : (
        <Moon className="h-4.5 w-4.5" style={{ color: 'var(--color-silver)' }} size={18} />
      )}
    </button>
  );
}
