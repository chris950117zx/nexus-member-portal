import { Radio, X, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useMemberStore } from '../../store/useMemberStore'

const playTone = (frequency: number, duration = .045) => {
  const AudioContextType = window.AudioContext ?? window.webkitAudioContext
  const context = new AudioContextType(); const oscillator = context.createOscillator(); const gain = context.createGain()
  oscillator.type = 'square'; oscillator.frequency.value = frequency; gain.gain.setValueAtTime(.025, context.currentTime); gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + duration)
  oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + duration)
}

declare global { interface Window { webkitAudioContext?: typeof AudioContext } }

export function CyberEffects() {
  const { pathname } = useLocation(); const soundEnabled = useMemberStore((state) => state.soundEnabled); const activities = useMemberStore((state) => state.activities)
  const [transitioning, setTransitioning] = useState(false); const [toast, setToast] = useState<(typeof activities)[number] | null>(null); const firstPath = useRef(true); const firstActivity = useRef(activities[0]?.id)
  useEffect(() => { if (firstPath.current) { firstPath.current = false; return } setTransitioning(true); if (soundEnabled) playTone(220, .08); const timer = window.setTimeout(() => setTransitioning(false), 620); return () => window.clearTimeout(timer) }, [pathname, soundEnabled])
  useEffect(() => { if (!activities[0] || activities[0].id === firstActivity.current) return; firstActivity.current = activities[0].id; setToast(activities[0]); if (soundEnabled) playTone(680, .1); const timer = window.setTimeout(() => setToast(null), 4200); return () => window.clearTimeout(timer) }, [activities, soundEnabled])
  useEffect(() => { const click = (event: MouseEvent) => { if (soundEnabled && (event.target as Element).closest('button,a')) playTone(340) }; document.addEventListener('click', click); return () => document.removeEventListener('click', click) }, [soundEnabled])
  useEffect(() => { const move = (event: PointerEvent) => { document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`); document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`) }; window.addEventListener('pointermove', move); return () => window.removeEventListener('pointermove', move) }, [])
  return <>{transitioning && <div className="route-signal"><div><Radio /><span>CONNECTING TO NODE</span><strong>{pathname === '/' ? 'HOME' : pathname.slice(1).toUpperCase()}</strong><i /></div></div>}{toast && <aside className={`cyber-toast cyber-toast--${toast.tone}`}><Zap size={17} /><div><span>SIGNAL RECEIVED</span><strong>{toast.title}</strong><small>{toast.detail}</small></div><button onClick={() => setToast(null)}><X size={14} /></button></aside>}<div className="cursor-aurora" aria-hidden="true" /></>
}
