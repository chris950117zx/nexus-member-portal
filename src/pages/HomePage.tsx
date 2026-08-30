import { ArrowDownToLine, ArrowUpFromLine, Coins, Gift, History, Radio, Send, Sparkles, Star, Ticket, TrendingUp, WalletCards, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { NeonCard } from '../components/ui/NeonCard'
import { AnimatedMoney } from '../components/ui/AnimatedMoney'
import { useMemberStore } from '../store/useMemberStore'
import { formatMoney } from '../utils/format'

const quickActions = [
  { label:'Deposit', icon:ArrowDownToLine, tone:'pink', path:'/wallet' }, { label:'Withdraw', icon:ArrowUpFromLine, tone:'amber', path:'/wallet' },
  { label:'Transactions', icon:Send, tone:'violet', path:'/transactions' }, { label:'Claim Reward', icon:Gift, tone:'yellow', path:'/rewards' },
]
export function HomePage() {
  const navigate = useNavigate(); const { wallet, activities, transactions } = useMemberStore()
  const stats = [
    { label:'TOTAL DEPOSITS', value:formatMoney(transactions.filter((item) => item.type === 'Deposit' && item.status === 'Success').reduce((sum,item) => sum + item.amount,0)), detail:'+12.8%', icon:ArrowDownToLine, tone:'pink' },
    { label:'TOTAL WITHDRAWALS', value:formatMoney(transactions.filter((item) => item.type === 'Withdrawal' && item.status === 'Success').reduce((sum,item) => sum + item.amount,0)), detail:'Local history', icon:ArrowUpFromLine, tone:'amber' },
    { label:'REWARD POINTS', value:wallet.rewardPoints.toLocaleString(), detail:'+120 pts', icon:Star, tone:'yellow' }, { label:'VIP PROGRESS', value:'80%', detail:'320 to VIP 04', icon:TrendingUp, tone:'violet' },
    { label:'PROMO CREDIT', value:formatMoney(240), detail:'2 active', icon:Ticket, tone:'pink' }, { label:'RECENT ACTIVITY', value:String(activities.length), detail:'Local log', icon:History, tone:'amber' },
  ]
  return <motion.div className="dashboard member-home" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ duration:.45 }}>
    <div className="page-intro"><div><div className="eyebrow"><Radio size={13} /> NEXUS NIGHT ACCESS</div><h2>Your world. Your wallet. <em>Fully charged.</em></h2><p>Welcome back, Alex. Your member space is glowing.</p></div><div className="secure-label"><Zap size={16} /> LOCAL SIMULATION <span>NO REAL FUNDS</span></div></div>
    <section className="member-hero-grid"><NeonCard className="wallet-hero"><div className="wallet-hero__reflection" /><div className="wallet-hero__sweep" /><div className="balance-card__header"><span>MY WALLET BALANCE</span><span className="balance-card__status"><i /> READY</span></div><div className="balance-card__value"><AnimatedMoney value={wallet.balance} /></div><div className="wallet-subbalances"><span><i>BONUS BALANCE</i><strong>{formatMoney(wallet.bonusBalance)}</strong></span><span><i>PENDING WITHDRAWAL</i><strong>{formatMoney(wallet.pendingWithdrawal)}</strong></span><span><i>LAST ACTIVITY</i><strong>Just now</strong></span></div><div className="wallet-id"><WalletCards size={14} /> NEXUS WALLET ·•• 001</div></NeonCard><NeonCard accent="violet" className="vip-card"><div className="vip-card__halo" /><div className="panel-heading"><div><span>VIP STATUS</span><h3>Neon Elite</h3></div><Star size={19} fill="currentColor" /></div><div className="vip-level"><small>LEVEL</small><strong>03</strong></div><div className="vip-progress"><span><i style={{ width:'80%' }} /></span><div><b>{wallet.rewardPoints.toLocaleString()} POINTS</b><b>320 TO VIP 04</b></div></div><p>Next level unlocks boosted rewards and exclusive drops.</p></NeonCard></section>
    <section className="quick-actions" aria-label="Quick actions">{quickActions.map(({ label,icon:Icon,tone,path },index) => <motion.button key={label} className={`quick-action quick-action--${tone}`} whileHover={{ y:-3 }} whileTap={{ scale:.98 }} onClick={() => navigate(path)}><span><Icon size={19} /></span><strong>{label}</strong><i className="quick-action__number">0{index + 1}</i></motion.button>)}</section>
    <section className="member-stats">{stats.map(({ label,value,detail,icon:Icon,tone }) => <NeonCard key={label} accent={tone === 'violet' ? 'violet' : tone === 'amber' || tone === 'yellow' ? 'amber' : 'pink'} className={`member-stat member-stat--${tone}`}><div><Icon size={17} /><span>{label}</span></div><strong>{value}</strong><small>{detail}</small></NeonCard>)}</section>
    <section className="home-lower-grid"><NeonCard className="activity-panel"><div className="panel-heading"><div><span>LIVE ACTIVITY</span><h3>Recent Activity</h3></div><span className="live-pill"><i /> LIVE</span></div><div className="activity-list">{activities.slice(0,3).map((item) => <div className="activity-item" key={item.id}><span className={`activity-icon activity-icon--${item.tone}`}><Sparkles size={16} /></span><div><strong>{item.title}</strong><small>{item.detail}</small></div><time>{new Date(item.date).toLocaleTimeString('en-MY',{ hour:'2-digit',minute:'2-digit' })}</time></div>)}</div></NeonCard><NeonCard accent="amber" className="promo-preview"><div className="promo-preview__flare" /><span className="promo-tag">HOT DROP</span><Coins size={28} /><h3>Cashback Night</h3><p>A late-night cashback drop is waiting in Promotions.</p><div>UP TO <strong>18%</strong> BACK</div><button onClick={() => navigate('/promotions')}>EXPLORE PROMOTIONS</button></NeonCard></section>
  </motion.div>
}
