import { Activity, BadgePercent, Gamepad2, Gift, House, Settings, UserRound, WalletCards, X, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'

const navigation = [
  { label: 'Home', to: '/', icon: House }, { label: 'Wallet', to: '/wallet', icon: WalletCards },
  { label: 'Transactions', to: '/transactions', icon: Activity }, { label: 'Games', to: '/games', icon: Gamepad2 }, { label: 'Promotions', to: '/promotions', icon: BadgePercent },
  { label: 'Rewards', to: '/rewards', icon: Gift }, { label: 'Profile', to: '/profile', icon: UserRound }, { label: 'Settings', to: '/settings', icon: Settings },
]

interface SidebarProps { open: boolean; onClose: () => void }

export function Sidebar({ open, onClose }: SidebarProps) {
  return <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
    <div className="sidebar__brand"><div className="brand-mark"><Zap size={22} fill="currentColor" /></div><div><strong data-text="NEXUS">NEXUS</strong><span>MEMBER PORTAL</span></div><button className="sidebar__close" onClick={onClose} aria-label="Close navigation"><X /></button></div>
    <div className="sidebar__label">MY NEXUS</div>
    <nav className="sidebar__nav">{navigation.map(({ label, to, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}>{({ isActive }) => <>{isActive && <motion.span layoutId="active-nav" className="nav-item__rail" />}<Icon size={18} strokeWidth={1.8} /><span>{label}</span>{isActive && <span className="nav-item__signal" />}</>}</NavLink>)}</nav>
    <div className="system-status"><div className="system-status__heading"><Activity size={14} /> MEMBER STATUS</div><div className="status-row"><span>Mode</span><strong className="text-amber">SIMULATION</strong></div><div className="status-row"><span>Account</span><strong className="text-pink"><i /> ONLINE</strong></div><div className="status-row"><span>Version</span><strong>v0.1.0</strong></div></div>
  </aside>
}
