import { NavLink } from 'react-router-dom'

const links = [
  { to: '/home', label: 'Home' },
  { to: '/booking', label: 'Booking' },
  { to: '/pharmacy', label: 'Pharmacy' },
  { to: '/personal-health', label: 'Personal Health' },
  { to: '/ai-chat', label: 'AI Chat' },
  { to: '/messages', label: 'Messages' },
  { to: '/settings', label: 'Settings' },
]

function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 hidden h-[calc(100vh-4rem)] w-64 border-r border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 md:block">
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
