import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import ToastStack from '../feedback/ToastStack'
import WorkspaceNotificationBridge from '../system/WorkspaceNotificationBridge'
import { medicineSchedule } from '../../data/dummyData'
import useNotifications from '../../hooks/useNotifications'
import { applyTheme, getStoredTheme, initThemeFromStorage, THEME_EVENT } from '../../utils/themeStorage'

function MainLayout() {
  const { triggerReminder } = useNotifications()

  useEffect(() => {
    initThemeFromStorage()
    const onTheme = () => applyTheme(getStoredTheme())
    window.addEventListener(THEME_EVENT, onTheme)
    return () => window.removeEventListener(THEME_EVENT, onTheme)
  }, [])

  useEffect(() => {
    const timers = medicineSchedule
      .filter((item) => item.status === 'Pending')
      .map((item, idx) =>
        setTimeout(() => {
          triggerReminder(item.name, item.time)
        }, 2500 + idx * 3000),
      )

    return () => timers.forEach((timer) => clearTimeout(timer))
  }, [triggerReminder])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <WorkspaceNotificationBridge />
      <Navbar />
      <Sidebar />
      <main className="pt-20 md:pl-64">
        <div className="mx-auto max-w-[1400px] p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
      <ToastStack />
    </div>
  )
}

export default MainLayout
