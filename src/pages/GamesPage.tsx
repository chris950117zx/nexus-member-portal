import { Gamepad2, Play, Search, Sparkles, Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import { GlowButton } from '../components/ui/GlowButton'
import { NeonCard } from '../components/ui/NeonCard'
import { PageHeading } from '../components/ui/PageHeading'

interface DemoGame { id: string; title: string; provider: string; category: 'Slots' | 'Arcade' | 'Table' | 'Live'; tag?: string; accent: 'pink' | 'amber' | 'violet' }
const providers = ['All', 'NOVA PLAY', 'PIXELFORGE', 'NEON ARC', 'VOID LABS'] as const
const games: DemoGame[] = [
  { id:'GAME-01', title:'Neon Fortune', provider:'NOVA PLAY', category:'Slots', tag:'HOT', accent:'pink' }, { id:'GAME-02', title:'Cyber Roulette', provider:'VOID LABS', category:'Table', tag:'NEW', accent:'violet' },
  { id:'GAME-03', title:'Midnight Run', provider:'PIXELFORGE', category:'Arcade', accent:'amber' }, { id:'GAME-04', title:'Holo Baccarat', provider:'NEON ARC', category:'Live', tag:'VIP', accent:'pink' },
  { id:'GAME-05', title:'Quantum Spin', provider:'NOVA PLAY', category:'Slots', accent:'violet' }, { id:'GAME-06', title:'Gold Circuit', provider:'PIXELFORGE', category:'Arcade', tag:'HOT', accent:'amber' },
  { id:'GAME-07', title:'Night City Poker', provider:'VOID LABS', category:'Table', accent:'pink' }, { id:'GAME-08', title:'Prism Live', provider:'NEON ARC', category:'Live', tag:'NEW', accent:'violet' },
]

export function GamesPage() {
  const [provider, setProvider] = useState<(typeof providers)[number]>('All'); const [search, setSearch] = useState(''); const [notice, setNotice] = useState('')
  const filtered = useMemo(() => games.filter((game) => (provider === 'All' || game.provider === provider) && game.title.toLowerCase().includes(search.toLowerCase())), [provider, search])
  return <div><PageHeading eyebrow="GAME NETWORK" title="Choose your" highlight="next world." description="A frontend-only provider lobby. No real provider session is connected." icon={Gamepad2} /><NeonCard className="provider-strip"><span>PROVIDER NETWORK</span><div>{providers.map((item) => <button key={item} className={provider === item ? 'active' : ''} onClick={() => setProvider(item)}>{item}</button>)}</div><label><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search games" /></label></NeonCard>{notice && <div className="page-message">{notice}</div>}<section className="games-grid">{filtered.map((game, index) => <NeonCard key={game.id} accent={game.accent} className={`game-card game-card--${game.accent}`}><div className="game-art"><span className="game-art__grid" /><span className="game-art__orb">{String(index + 1).padStart(2,'0')}</span>{game.tag && <b>{game.tag}</b>}<Gamepad2 /></div><div className="game-card__body"><span>{game.provider}</span><h3>{game.title}</h3><div><small>{game.category}</small><small><Star size={11} fill="currentColor" /> DEMO</small></div><GlowButton tone={game.accent} onClick={() => setNotice(`${game.title} is a mock tile. Provider launch API is not connected yet.`)}><Play size={14} fill="currentColor" /> DEMO PLAY</GlowButton></div></NeonCard>)}</section><div className="provider-disclaimer"><Sparkles size={14} /> MOCK CATALOG · NO REAL GAME SESSION · NO PROVIDER API CONNECTED</div></div>
}
