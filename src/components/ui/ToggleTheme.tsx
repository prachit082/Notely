import { useTheme } from '@/hooks/useTheme';
import { SunIcon, MoonIcon } from 'lucide-react';

export default function ToggleTheme() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
      {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
    </button>
  );
}
