import { ArrowDown, Bomb, Coins, Heart, Maximize2, Pickaxe, RotateCcw, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { MiningCanvas, mineralColor } from './MiningCanvas'
import { MiningEngine, ORES, PICKS } from './miningEngine'
import type { MiningPick, MiningSnapshot } from './miningEngine'
import pickaxeImage from '../assets/mining/nexus-voxel-pickaxe.png'
import { GlowButton } from '../components/ui/GlowButton'
import { useMemberStore } from '../store/useMemberStore'
import './mining.css'

const money = (value: number) => `RM ${value.toFixed(2)}`
const zone = (depth: number) => depth < 180 ? 'THE OVERBURDEN' : depth < 750 ? 'STONE HOLLOW' : 'THE DEEP'
const seed = () => Math.floor(Math.random() * 0x7fffffff)

export function CoreDropPage() {
  const { wallet, withdrawFunds, depositFunds } = useMemberStore()
  const [engine, setEngine] = useState(() => new MiningEngine(PICKS[1], seed()))
  const [run, setRun] = useState<MiningSnapshot>(() => engine.snapshot())
  const [ready, setReady] = useState(false)
  const [notice, setNotice] = useState('')
  const settled = useRef<MiningEngine | null>(null)
  const selected = engine.pick
  const running = run.status === 'running'

  useEffect(() => {
    if (run.status !== 'complete' || settled.current === engine) return
    settled.current = engine
    if (run.value > 0) depositFunds(run.value, 'NEXUS: CORE DROP extraction')
  }, [engine, run.status, run.value, depositFunds])

  const choose = (pick: MiningPick) => {
    if (engine.state.status === 'running') return
    const next = new MiningEngine(pick, seed())
    setReady(false)
    setEngine(next)
    setRun(next.snapshot())
    setNotice('')
  }
  const start = () => {
    if (!ready || engine.state.status !== 'idle') return
    if (!withdrawFunds(selected.price, 'NEXUS: CORE DROP tool deployment')) {
      setNotice('Not enough demo balance for this pickaxe.')
      return
    }
    engine.start()
    setRun(engine.snapshot())
    setNotice('')
    if (window.matchMedia('(max-width: 760px)').matches) {
      document.querySelector('.mining-stage')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return <div className="core-drop mining-v2">
    <header className="mining-heading">
      <div><span className="mining-eyebrow">NEXUS ORIGINALS <i /> NO. 001</span><h1>CORE<span>DROP</span><small>↓</small></h1><p>A little luck. A long way down.</p></div>
      <div className="mining-balance"><span>DEMO WALLET</span><strong>{money(wallet.balance)}</strong><small>PLAY WITH DEMO FUNDS</small></div>
    </header>

    <section className="mining-layout">
      <aside className="mining-loadout">
        <div className="mining-section-label"><span>01 / GEAR UP</span><Pickaxe size={15} /></div>
        <h2>Choose your pick.</h2><p className="mining-muted">Drop in. Let gravity do its thing.</p>
        <div className="mining-picks">
          {PICKS.map((pick, i) => <button key={pick.id} className={`mining-pick ${pick.id === selected.id ? 'is-selected' : ''}`} onClick={() => choose(pick)} disabled={running} aria-pressed={pick.id === selected.id}>
            <span className={`mining-pick-art mining-pick-art--${i}`}><img src={pickaxeImage} alt="" /></span>
            <span><strong>{pick.name}</strong><small><Heart size={10} /> {pick.hp} HP <b>•</b> POWER {pick.power}</small></span>
            <em>{money(pick.price)}</em>
          </button>)}
        </div>
        <div className="mining-selected-spec"><span>YOUR LOADOUT<strong>{selected.name}</strong></span><span>INTEGRITY<strong>{selected.hp}<small> HP</small></strong></span></div>
        <GlowButton tone="amber" onClick={run.status === 'complete' ? () => choose(selected) : start} disabled={running || !ready}>
          {running ? <><Sparkles size={16} /> EXPLORING…</> : run.status === 'complete' ? <><RotateCcw size={16} /> ANOTHER DROP</> : <><ArrowDown size={16} /> DROP IN · {money(selected.price)}</>}
        </GlowButton>
        {!ready && <p className="mining-muted">Loading your gear…</p>}
        {notice && <p role="alert" className="mining-notice">{notice}</p>}
        <div className="mining-how"><span>THE WAY DOWN</span><p>Every hit costs integrity. Find minerals, catch a repair, and see how deep you go.</p><small>One block per hit. Up to two sideways breaks before dropping.</small></div>
        <div className="mining-specials">
          <div><Bomb /><span>TNT<small>Clears nearby blocks</small></span></div>
          <div><Heart /><span>REPAIR<small>Restores 25% max HP</small></span></div>
          <div><Maximize2 /><span>SIZE UP<small>A bigger pick, richer finds</small></span></div>
        </div>
      </aside>

      <main className="mining-stage">
        <div className="mining-stage-top"><span><i className={running ? 'is-live' : ''} /> {running ? 'LIVE DROP' : run.status === 'complete' ? 'DROP COMPLETE' : 'READY TO DROP'}</span><span>{zone(run.depth)}</span><strong>{run.depth}<small> m</small></strong></div>
        <div className="mining-viewport">
          <MiningCanvas engine={engine} onChange={setRun} onReady={setReady} />
          {run.status === 'idle' && <div className="mining-idle-sign"><span>↓</span><strong>THE DEEP IS CALLING</strong><small>Choose your pickaxe & drop in</small></div>}
          {run.status === 'complete' && <div className="mining-finish"><span>EXPEDITION COMPLETE</span><h2>Back from the deep.</h2><strong>{money(run.value)}</strong><p>{run.depth} m explored · {run.cleared} blocks cleared</p><button onClick={() => choose(selected)}><RotateCcw size={15} /> PREPARE NEXT DROP</button></div>}
          <div className="mining-event-feed" aria-live="polite">{run.event}</div>
        </div>
        <div className="mining-integrity"><div><span><Heart size={12} /> PICKAXE INTEGRITY</span><strong>{run.hp} <small>/ {run.maxHp}</small></strong></div><div role="progressbar" aria-label="Pickaxe integrity" aria-valuemin={0} aria-valuemax={run.maxHp} aria-valuenow={run.hp}><i style={{ width: `${run.hp / run.maxHp * 100}%`, background: run.hp / run.maxHp < .3 ? '#db8966' : undefined }} /></div></div>
      </main>

      <aside className="mining-haul">
        <div className="mining-section-label"><span>02 / THE HAUL</span><Coins size={15} /></div>
        <div className="mining-total"><span>COLLECTED THIS DROP</span><strong>{money(run.value)}</strong><small>{run.status === 'complete' ? 'Added to your demo wallet' : 'Every find counts.'}</small></div>
        <div className="mining-stats"><div><span>DEPTH</span><strong>{run.depth}<small> m</small></strong></div><div><span>BLOCKS</span><strong>{run.cleared}</strong></div><div><span>HITS</span><strong>{run.hits}</strong></div><div><span>PICK SIZE</span><strong>{run.size.toFixed(2)}<small>×</small></strong></div></div>
        <div className="mining-section-label mining-discoveries"><span>YOUR DISCOVERIES</span><span>{Object.values(run.counts).reduce((a, b) => a + b, 0)}</span></div>
        {ORES.map(ore => <div className="mining-ore" key={ore.id} style={{ '--ore-color': mineralColor(ore.id) } as CSSProperties}><i /><span>{ore.name}<small>FROM {money(ore.value)}</small></span><strong>{run.counts[ore.id] ?? 0}</strong></div>)}
        <div className="mining-tip"><span>FIELD NOTE / 001</span><p>The brightest finds are buried a little deeper.</p><div>↓ ↓ ↓</div></div>
      </aside>
    </section>
    <footer className="mining-footer"><span><i /> ENDLESS EXPLORATION</span><span>Demo play · Ordinary stone has no payout</span><span>NEXUS MINING DIVISION</span></footer>
  </div>
}
