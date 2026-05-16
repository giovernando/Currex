import { motion, AnimatePresence } from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import { useTheme } from '@/app/providers/ThemeProvider'
import { APP_NAME } from '@/constants/app'
import type { ReactNode } from 'react'

interface NavItemProps {
  to: string
  icon: ReactNode
  label: string
}

function NavItem({ to, icon, label }: NavItemProps) {
  return (
    <NavLink to={to} className="group flex-1">
      {({ isActive }) => (
        <motion.div
          whileTap={{ scale: 0.9 }}
          className={`
            flex flex-col items-center gap-1 py-2 rounded-xl transition-all duration-200
            ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}
          `}
        >
          <div className={`relative ${isActive ? 'text-[var(--accent)]' : ''}`}>
            {icon}
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--accent)]"
              />
            )}
          </div>
          <span className={`text-[10px] font-semibold ${isActive ? 'text-[var(--accent)]' : ''}`}>
            {label}
          </span>
        </motion.div>
      )}
    </NavLink>
  )
}

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation()
  const { isInstallable, install } = usePWAInstall()
  const { theme, toggleTheme } = useTheme()

  return (
    <div
      className="flex flex-col min-h-dvh max-w-2xl mx-auto"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Sticky Navbar */}
      <header
        className="
          sticky top-0 z-40 px-4 py-3
          glass border-b border-[var(--border-color)]
          backdrop-blur-xl
        "
      >
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--violet)] flex items-center justify-center shadow-[0_0_12px_var(--accent-glow)]">
              <span className="text-white text-sm font-bold">⊞</span>
            </div>
            <span className="text-base font-semibold text-[var(--text-primary)]">{APP_NAME}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* PWA Install */}
            <AnimatePresence>
              {isInstallable && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={install}
                  className="
                    flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                    text-xs font-semibold text-white
                    bg-gradient-to-r from-[var(--accent)] to-[var(--violet)]
                    shadow-[0_0_12px_var(--accent-glow)]
                    hover:shadow-[0_0_20px_var(--accent-glow)]
                    transition-all duration-200
                  "
                >
                  <span>⬇</span>
                  <span className="hidden sm:block">Install App</span>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Theme toggle */}
            <motion.button
              whileTap={{ scale: 0.9, rotate: 180 }}
              onClick={toggleTheme}
              title="Toggle theme"
              className="
                w-8 h-8 rounded-xl glass border border-[var(--border-color)]
                flex items-center justify-center text-sm
                hover:border-[var(--border-color-strong)] transition-all
              "
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Desktop layout: two-column */}
      <main className="flex-1 flex overflow-hidden">
        {/* Desktop sidebar nav */}
        <nav className="hidden lg:flex flex-col gap-1 p-4 w-[180px] shrink-0 sticky top-16 self-start">
          {[
            { to: '/', label: 'Calculator', icon: <span className="text-lg">⊞</span> },
            { to: '/converter', label: 'Converter', icon: <span className="text-lg">💱</span> },
            { to: '/history', label: 'History', icon: <span className="text-lg">🕐</span> },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/20'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
                }
              `}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto pb-24 lg:pb-4">
          <AnimatePresence mode="wait" initial={false}>
            <div key={location.pathname} className="h-full">
              {children}
            </div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="
          lg:hidden fixed bottom-0 left-0 right-0 z-40
          glass border-t border-[var(--border-color)]
          backdrop-blur-xl px-6 pb-safe
        "
      >
        <div className="flex items-center max-w-2xl mx-auto">
          <NavItem
            to="/"
            label="Calculator"
            icon={<span className="text-xl">⊞</span>}
          />
          <NavItem
            to="/converter"
            label="Converter"
            icon={<span className="text-xl">💱</span>}
          />
          <NavItem
            to="/history"
            label="History"
            icon={<span className="text-xl">🕐</span>}
          />
        </div>
      </nav>
    </div>
  )
}
