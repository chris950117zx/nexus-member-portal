import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useMemberStore } from '../../store/useMemberStore'
import { AnimatedBackground } from './AnimatedBackground'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { CyberEffects } from './CyberEffects'

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const portalTheme = useMemberStore((state) => state.portalTheme)
  useEffect(() => {
    document.documentElement.dataset.theme = portalTheme
  }, [portalTheme])
  return <div className="app-shell"><AnimatedBackground /><CyberEffects /><Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />{menuOpen && <button className="sidebar-backdrop" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}<div className="app-shell__main"><Header onMenuClick={() => setMenuOpen(true)} /><main className="page-content"><Outlet /></main></div></div>
}
