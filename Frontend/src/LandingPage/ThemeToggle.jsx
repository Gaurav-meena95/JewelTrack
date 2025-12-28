import React from 'react'
import { useTheme } from '../Context/ThemeContext'
import { Moon, Sun } from 'lucide-react'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full transition-all duration-300 hover:bg-goldglow"
    >
      <Sun
        className={`absolute h-5 w-5 transition-all duration-300 ${
          theme === 'dark'
            ? 'rotate-90 scale-0'
            : 'rotate-0 scale-100'
        }`}
      />

      <Moon
        className={`absolute h-5 w-5 transition-all duration-300 ${
          theme === 'dark'
            ? 'rotate-0 scale-100'
            : 'rotate-90 scale-0'
        }`}
      />

      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

export default ThemeToggle
