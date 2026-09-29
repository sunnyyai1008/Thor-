import { create } from 'zustand'

interface ThemeStore {
  theme: 'dark' | 'light'
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'dark',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('light', newTheme === 'light')
    return { theme: newTheme }
  }),
}))
