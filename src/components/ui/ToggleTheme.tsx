import { useTheme } from '../../hooks/useTheme'; // Assuming you have this hook
import { Moon, Sun } from 'lucide-react'; // Assuming you're using lucide-react
import { motion } from 'framer-motion'; // Import motion for animations

export default function ToggleTheme() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
    >
      <motion.div
        key={theme} // Triggers animation on theme change
        initial={{ rotate: -20, scale: 0.8 }}  // Initial state (slightly rotated and smaller)
        animate={{ rotate: 0, scale: 1 }}      // Final state (straight and normal size)
        transition={{ type: 'spring', stiffness: 300, damping: 20 }} // Spring animation for smooth bounce
      >
        {theme === 'light' ? (
          <Moon size={20} className="text-black" />
        ) : (
          <Sun size={20} className="text-white" />
        )}
      </motion.div>
    </button>
  );
}
