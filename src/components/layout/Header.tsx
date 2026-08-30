import { Bell, LogOut, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMemberStore } from '../../store/useMemberStore'

interface HeaderProps { onMenuClick: () => void }
export function Header({ onMenuClick }: HeaderProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const logout = useMemberStore((state) => state.logout)
  const language = useMemberStore((state) => state.language)
  const [now, setNow] = useState(() => new Date())
  const englishTitle = pathname === '/games/core-drop' ? 'Core Drop' : pathname === '/' ? 'Home' : pathname.slice(1).replace(/^./, (letter) => letter.toUpperCase())
  const chineseTitles: Record<string,string> = { '/':'首页', '/wallet':'钱包', '/transactions':'交易记录', '/games':'游戏大厅', '/games/core-drop':'核心挖矿', '/promotions':'优惠活动', '/rewards':'会员奖励', '/profile':'个人资料', '/settings':'设置' }
  const title = language === 'zh' ? chineseTitles[pathname] ?? englishTitle : englishTitle
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(timer) }, [])
  return <header className="topbar"><div className="topbar__title"><button className="menu-button" onClick={onMenuClick} aria-label="Open navigation"><Menu /></button><div><span>{language === 'zh' ? '会员入口 /' : 'MEMBER PORTAL /'}</span><h1>{title}</h1></div></div><div className="topbar__controls"><div className="welcome-chip"><span>{language === 'zh' ? '欢迎回来' : 'WELCOME BACK'}</span><strong>Alex</strong></div><div className="member-id"><span>{language === 'zh' ? '会员编号' : 'MEMBER ID'}</span><strong>MBR-NEON-001</strong></div><div className="vip-badge">VIP <strong>03</strong></div><div className="simulation-badge"><i /> {language === 'zh' ? '模拟' : 'SIMULATION'}</div><time><span>{language === 'zh' ? '本地时间' : 'LOCAL TIME'}</span><strong>{now.toLocaleTimeString('en-MY', { hour12: false })}</strong></time><button className="icon-button" aria-label="Notifications"><Bell size={19} /><i /></button><button className="icon-button logout-button" aria-label="Log out" title="Log out" onClick={() => { logout(); navigate('/login') }}><LogOut size={18} /></button><div className="avatar" aria-label="Member profile">AT</div></div></header>
}
