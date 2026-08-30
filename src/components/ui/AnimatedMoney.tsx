import { useEffect, useRef, useState } from 'react'
import { formatMoney } from '../../utils/format'

export function AnimatedMoney({ value }: { value: number }) {
  const previous = useRef(value); const [display, setDisplay] = useState(value)
  useEffect(() => { const start = previous.current; const delta = value - start; const started = performance.now(); let frame = 0; const tick = (now: number) => { const progress = Math.min((now - started) / 700, 1); const eased = 1 - Math.pow(1 - progress, 3); setDisplay(start + delta * eased); if (progress < 1) frame = requestAnimationFrame(tick); else previous.current = value }; frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame) }, [value])
  return <>{formatMoney(display)}</>
}
