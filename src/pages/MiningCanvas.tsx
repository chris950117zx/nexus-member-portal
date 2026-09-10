import { useEffect, useRef, useState } from 'react'
import type { MiningSnapshot, BlockKind } from './miningEngine'
import { COLUMNS, MiningEngine, ORES } from './miningEngine'
import atlasUrl from '../assets/mining/voxel-mining-atlas.png'
import pickUrl from '../assets/mining/nexus-voxel-pickaxe.png'

const tiles: Record<BlockKind, [number, number]> = { dirt: [0, 0], stone: [1, 0], deep: [2, 0], copper: [0, 1], quartz: [1, 1], gold: [2, 1], violet: [3, 1], plasma: [0, 2], void: [1, 2], repair: [2, 2], mega: [3, 2], tnt: [1, 0] }
const loadImage = (url: string) => new Promise<HTMLImageElement>((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = url })

export function MiningCanvas({ engine, onChange, onReady }: { engine: MiningEngine; onChange: (state: MiningSnapshot) => void; onReady: (ready: boolean) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const callbacks = useRef({ onChange, onReady })
  callbacks.current = { onChange, onReady }
  const [error, setError] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let disposed = false, frame = 0, width = 0, height = 0, last = 0, accumulator = 0, published = -1, publishTime = 0
    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      width = bounds.width; height = bounds.height
      const ratio = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    callbacks.current.onReady(false)
    setError(false)
    Promise.all([loadImage(atlasUrl), loadImage(pickUrl)]).then(([atlas, pick]) => {
      if (disposed) return
      callbacks.current.onReady(true)
      resize()
      const draw = (stamp: number) => {
        if (disposed) return
        const dt = last ? Math.min((stamp - last) / 1000, .05) : 0
        last = stamp
        // Pause simulation while hidden; never charge missed background collisions.
        if (document.hidden) { accumulator = 0; frame = requestAnimationFrame(draw); return }
        accumulator += dt
        while (accumulator >= 1 / 240) { engine.step(1 / 240); accumulator -= 1 / 240 }
        if (engine.revision !== published && (stamp - publishTime > 70 || engine.state.status === 'complete')) {
          published = engine.revision; publishTime = stamp; callbacks.current.onChange(engine.snapshot())
        }
        const rail = Math.max(12, width * .035), cell = (width - rail * 2) / COLUMNS, surface = cell * 3.1
        const targetCamera = Math.max(0, surface / cell + engine.y - height / cell * .43)
        // A downward dead zone prevents the camera from bobbing with every bounce.
        engine.camera += (Math.max(engine.camera, targetCamera) - engine.camera) * (1 - Math.exp(-7 * dt))
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const shake = reduced ? 0 : engine.shake * cell
        const offsetY = surface - engine.camera * cell + Math.sin(engine.time * 81) * shake
        const offsetX = rail + Math.cos(engine.time * 67) * shake * .5
        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = '#080c10'; ctx.fillRect(0, 0, width, height)

        // Surface travels with the terrain; the open shaft underneath stays dark.
        if (offsetY > 0) {
          const sky = ctx.createLinearGradient(0, offsetY - surface, 0, offsetY)
          sky.addColorStop(0, '#172c3e'); sky.addColorStop(1, '#749385')
          ctx.fillStyle = sky; ctx.fillRect(rail, 0, width - rail * 2, offsetY)
          ctx.fillStyle = '#b2b89a'; ctx.beginPath(); ctx.arc(width * .77, offsetY - cell * 2.2, cell * .32, 0, Math.PI * 2); ctx.fill()
          for (let layer = 0; layer < 2; layer++) {
            ctx.fillStyle = layer ? '#2c4b43' : '#44645b'; ctx.beginPath(); ctx.moveTo(rail, offsetY)
            for (let i = 0; i <= 12; i++) ctx.lineTo(rail + i * cell, offsetY - cell * (.5 + Math.sin(i * 1.7 + layer) * .35 + layer * .4))
            ctx.lineTo(width - rail, offsetY); ctx.fill()
          }
        }
        ctx.save(); ctx.beginPath(); ctx.rect(rail, 0, width - rail * 2, height); ctx.clip()
        ctx.imageSmoothingEnabled = false
        const firstRow = Math.max(0, Math.floor(-offsetY / cell)), lastRow = Math.ceil((height - offsetY) / cell)
        for (let row = firstRow; row <= lastRow; row++) for (let col = 0; col < COLUMNS; col++) {
          if (!engine.solid(row, col)) continue
          const kind = engine.block(row, col), [tx, ty] = tiles[kind]
          const x = offsetX + col * cell, y = offsetY + row * cell
          ctx.drawImage(atlas, tx * atlas.width / 4, ty * atlas.height / 3, atlas.width / 4, atlas.height / 3, x, y, cell + .3, cell + .3)
          ctx.fillStyle = `rgba(0,0,0,${.13 + ((row * 7 + col * 3) % 4) * .025})`; ctx.fillRect(x, y, cell, cell)
          ctx.strokeStyle = 'rgba(0,0,0,.24)'; ctx.lineWidth = 1; ctx.strokeRect(x + .5, y + .5, cell - 1, cell - 1)
          if (row === 0) { ctx.fillStyle = '#749248'; ctx.fillRect(x, y, cell, 4); ctx.fillStyle = '#425b2b'; ctx.fillRect(x, y + 4, cell, 3) }
          if (kind === 'tnt' || kind === 'repair' || kind === 'mega') {
            const pad = cell * .17
            ctx.fillStyle = kind === 'tnt' ? '#ad3c2f' : kind === 'repair' ? '#315c36' : '#624786'
            ctx.fillRect(x + pad, y + pad, cell - pad * 2, cell - pad * 2)
            ctx.strokeStyle = kind === 'tnt' ? '#f39764' : kind === 'repair' ? '#a1d98b' : '#c5a3ee'
            ctx.strokeRect(x + pad + 1, y + pad + 1, cell - pad * 2 - 2, cell - pad * 2 - 2)
            ctx.font = `900 ${Math.max(10, cell * .23)}px monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
            ctx.fillStyle = '#fff4d5'; ctx.fillText(kind === 'tnt' ? 'TNT' : kind === 'repair' ? '+' : '↑', x + cell / 2, y + cell / 2)
          }
          const cracks = engine.cracks.get(row * COLUMNS + col) ?? 0
          if (cracks) {
            ctx.strokeStyle = '#100f0e'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + cell * .3, y); ctx.lineTo(x + cell * .56, y + cell * .4); ctx.lineTo(x + cell * .34, y + cell * .65); ctx.lineTo(x + cell * .55, y + cell); ctx.moveTo(x + cell * .56, y + cell * .4); ctx.lineTo(x + cell, y + cell * .3); ctx.stroke()
            if (cracks > 1) { ctx.beginPath(); ctx.moveTo(x, y + cell * .7); ctx.lineTo(x + cell * .6, y + cell * .6); ctx.lineTo(x + cell * .8, y); ctx.stroke() }
          }
        }
        // Warm local light gives depth without hiding the next rewards.
        const lightX = offsetX + engine.x * cell, lightY = offsetY + engine.y * cell
        const light = ctx.createRadialGradient(lightX, lightY, cell * .4, lightX, lightY, cell * 5)
        light.addColorStop(0, 'rgba(255,209,130,.09)'); light.addColorStop(.5, 'rgba(0,0,0,0)'); light.addColorStop(1, 'rgba(0,0,0,.18)')
        ctx.fillStyle = light; ctx.fillRect(rail, 0, width - rail * 2, height)
        for (const p of engine.particles) {
          ctx.globalAlpha = p.life / p.maxLife; ctx.fillStyle = p.color
          ctx.fillRect(offsetX + p.x * cell, offsetY + p.y * cell, p.size * cell, p.size * cell)
        }
        ctx.globalAlpha = 1
        const spriteSize = cell * .91 * Math.min(1.22, engine.state.size)
        ctx.save(); ctx.translate(lightX, lightY); ctx.rotate(engine.angle)
        ctx.shadowColor = '#000'; ctx.shadowBlur = 5; ctx.shadowOffsetY = 3
        ctx.imageSmoothingEnabled = true
        ctx.filter = 'brightness(1.6) contrast(1.05)'
        ctx.drawImage(pick, -spriteSize / 2, -spriteSize / 2, spriteSize, spriteSize)
        ctx.restore()
        if (engine.state.status !== 'idle') {
          const barWidth = Math.max(42, cell * 1.25), barY = lightY - cell * .87
          ctx.fillStyle = 'rgba(4,8,10,.85)'; ctx.fillRect(lightX - barWidth / 2 - 4, barY - 15, barWidth + 8, 25)
          ctx.font = `600 ${Math.max(10, cell * .24)}px monospace`; ctx.textAlign = 'center'; ctx.fillStyle = '#eaf1db'; ctx.fillText(`${engine.state.hp}/${engine.state.maxHp}`, lightX, barY - 5)
          ctx.fillStyle = '#2b3430'; ctx.fillRect(lightX - barWidth / 2, barY, barWidth, 4)
          ctx.fillStyle = engine.state.hp / engine.state.maxHp > .3 ? '#a3d684' : '#ed8c6d'; ctx.fillRect(lightX - barWidth / 2, barY, barWidth * engine.state.hp / engine.state.maxHp, 4)
        }
        for (const p of engine.popups) {
          ctx.globalAlpha = Math.min(1, p.life * 3); ctx.fillStyle = p.color
          ctx.font = `bold ${Math.max(12, cell * .28)}px monospace`; ctx.textAlign = 'center'; ctx.shadowColor = '#000'; ctx.shadowBlur = 4
          ctx.fillText(p.text, offsetX + p.x * cell, offsetY + p.y * cell - cell * .7)
        }
        ctx.shadowBlur = 0; ctx.globalAlpha = 1
        if (!reduced && engine.flash > .01) { ctx.fillStyle = `rgba(255,192,99,${engine.flash * .3})`; ctx.fillRect(0, 0, width, height) }
        ctx.restore()
        // Stone rails stay readable at the edge of the shaft.
        for (const edge of [0, width - rail]) {
          ctx.fillStyle = '#242a29'; ctx.fillRect(edge, 0, rail, height)
          ctx.fillStyle = '#41453c'; ctx.fillRect(edge + 2, 0, 2, height)
          ctx.strokeStyle = '#101616'; ctx.lineWidth = 2
          for (let y = (offsetY % (cell * .65)) - cell; y < height; y += cell * .65) { ctx.beginPath(); ctx.moveTo(edge, y); ctx.lineTo(edge + rail, y); ctx.stroke() }
        }
        frame = requestAnimationFrame(draw)
      }
      frame = requestAnimationFrame(draw)
    }).catch(() => { if (!disposed) { setError(true); callbacks.current.onReady(false) } })
    return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect() }
  }, [engine])

  return <><canvas ref={canvasRef} className="mining-canvas" aria-label="Live mining shaft: falling pickaxe, visible ores and power-ups" />{error && <div className="mining-load-error" role="alert">Couldn't load the mining textures. Refresh to retry.</div>}</>
}

export const mineralColor = (id: string) => ORES.find(o => o.id === id)?.color ?? '#d8b67b'
