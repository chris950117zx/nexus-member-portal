import { Bell, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

interface HeaderProps { onMenuClick: () => void }
export function Header({ onMenuClick }: HeaderProps) {
  const { pathname } = useLocation()
  const [now, setNow] = useState(() => new Date())
  const title = pathname === '/' ? 'Home' : pathname.slice(1).replace(/^./, (letter) => letter.toUpperCase())
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(timer) }, [])
  return <header className="topbar"><div className="topbar__title"><button className="menu-button" onClick={onMenuClick} aria-label="Open navigation"><Menu /></button><div><span>MEMBER PORTAL /</span><h1>{title}</h1></div></div><div className="topbar__controls"><div className="welcome-chip"><span>WELCOME BACK</span><strong>Alex</strong></div><div className="member-id"><span>MEMBER ID</span><strong>MBR-NEON-001</strong></div><div className="vip-badge">VIP <strong>03</strong></div><div className="simulation-badge"><i /> SIMULATION</div><time><span>LOCAL TIME</span><strong>{now.toLocaleTimeString('en-MY', { hour12: false })}</strong></time><button className="icon-button" aria-label="Notifications"><Bell size={19} /><i /></button><div className="avatar" aria-label="Member profile">AT</div></div></header>
}
