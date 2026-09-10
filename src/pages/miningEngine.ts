export const COLUMNS = 10
export const PICKS = [
  { id: 'spark', name: 'WOOD PICK', price: 5, hp: 72, power: 1, tone: 'pink' as const },
  { id: 'neon', name: 'IRON PICK', price: 15, hp: 125, power: 2, tone: 'violet' as const },
  { id: 'plasma', name: 'GOLD PICK', price: 30, hp: 190, power: 3, tone: 'amber' as const },
  { id: 'titan', name: 'NEXUS PICK', price: 60, hp: 290, power: 5, tone: 'pink' as const },
]
export type MiningPick = typeof PICKS[number]
export const ORES = [
  { id: 'copper', name: 'COPPER', value: 1.2, color: '#e99751' },
  { id: 'quartz', name: 'ROSE QUARTZ', value: 3.5, color: '#ee8bbc' },
  { id: 'gold', name: 'GOLD', value: 8, color: '#f5cf60' },
  { id: 'violet', name: 'AMETHYST', value: 16, color: '#b393ee' },
  { id: 'plasma', name: 'PLASMA', value: 32, color: '#85dedd' },
  { id: 'void', name: 'VOID DIAMOND', value: 75, color: '#e6e5ff' },
]
export type BlockKind = 'dirt' | 'stone' | 'deep' | 'repair' | 'mega' | 'tnt' | 'copper' | 'quartz' | 'gold' | 'violet' | 'plasma' | 'void'
export interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string; size: number }
export interface Popup { x: number; y: number; text: string; color: string; life: number }
export interface Impact { row: number; col: number; axis: 'x' | 'y'; broken: number[]; sideStreak: number }
export interface MiningSnapshot { status: 'idle' | 'running' | 'complete'; hp: number; maxHp: number; value: number; depth: number; hits: number; cleared: number; size: number; counts: Record<string, number>; event: string }

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))
const hash = (n: number) => { let x = Math.imul(n ^ (n >>> 16), 0x45d9f3b); x = Math.imul(x ^ (x >>> 16), 0x45d9f3b); return ((x ^ (x >>> 16)) >>> 0) / 4294967296 }

export class MiningEngine {
  readonly pick: MiningPick
  readonly seed: number
  state: MiningSnapshot
  removed = new Set<number>()
  cracks = new Map<number, number>()
  particles: Particle[] = []
  popups: Popup[] = []
  x = 4.5
  y = -1.9
  vx = .75
  vy = 0
  angle = -.5
  spin = 2.3
  radius = .23
  camera = 0
  shake = 0
  flash = 0
  time = 0
  revision = 0
  lastImpact: Impact | null = null
  sideStreak = 0
  private lastSide = -1
  private cooldown = 0
  private deepest = 0
  private randomCounter = 0
  private dropColumn: number | null = null

  constructor(pick: MiningPick, seed = 42) {
    this.pick = pick
    this.seed = seed
    this.state = { status: 'idle', hp: pick.hp, maxHp: pick.hp, value: 0, depth: 0, hits: 0, cleared: 0, size: 1, counts: {}, event: 'Ready for the drop' }
  }
  private random() { return hash(this.seed + ++this.randomCounter * 7919) }
  block(row: number, col: number): BlockKind {
    // Fixed from the start of each run: render and collision use exactly this map.
    const p = hash(this.seed + row * 977 + col * 131)
    if (p < .025) return 'tnt'
    if (p < .083) return 'repair'
    if (p < .102) return 'mega'
    if (p < .16) return 'copper'
    if (p < .21) return 'quartz'
    if (p < .245 && row > 5) return 'gold'
    if (p < .272 && row > 12) return 'violet'
    if (p < .291 && row > 20) return 'plasma'
    if (p < .302 && row > 29) return 'void'
    return row < 4 ? 'dirt' : row < 18 ? 'stone' : 'deep'
  }
  solid(row: number, col: number) { return row >= 0 && col >= 0 && col < COLUMNS && !this.removed.has(row * COLUMNS + col) }
  start() { this.state.status = 'running'; this.state.event = 'Gravity online'; this.revision++ }
  snapshot(): MiningSnapshot { return { ...this.state, counts: { ...this.state.counts } } }

  private burst(row: number, col: number, kind: BlockKind, count: number) {
    const color = ORES.find(o => o.id === kind)?.color ?? (kind === 'repair' ? '#9cdd80' : kind === 'tnt' ? '#ffa05b' : '#a18b70')
    for (let i = 0; i < count; i++) {
      const life = .25 + this.random() * .4
      this.particles.push({ x: col + .5, y: row + .5, vx: (this.random() - .5) * 5, vy: -this.random() * 5 - .5, life, maxLife: life, color, size: .035 + this.random() * .07 })
    }
    if (this.particles.length > 150) this.particles.splice(0, this.particles.length - 150)
  }
  private collect(row: number, col: number, kind: BlockKind) {
    const ore = ORES.find(o => o.id === kind)
    if (ore) {
      const amount = Math.round(ore.value * this.state.size * 100) / 100
      this.state.value = Math.round((this.state.value + amount) * 100) / 100
      this.state.counts[ore.id] = (this.state.counts[ore.id] ?? 0) + 1
      this.state.event = `${ore.name} + RM ${amount.toFixed(2)}`
      this.popups.push({ x: col + .5, y: row, text: `+${amount.toFixed(2)}`, color: ore.color, life: 1.1 })
    } else if (kind === 'repair') {
      const before = this.state.hp
      this.state.hp = Math.min(this.state.maxHp, before + Math.round(this.state.maxHp * .25))
      this.state.event = `Repair +${this.state.hp - before} HP`
      this.popups.push({ x: col + .5, y: row, text: `+${this.state.hp - before} HP`, color: '#a3ee91', life: 1.2 })
    } else if (kind === 'mega') {
      this.state.size = Math.min(1.45, this.state.size + .12)
      this.state.event = 'Pickaxe upgraded'
      this.popups.push({ x: col + .5, y: row, text: 'SIZE UP', color: '#dfb5ff', life: 1.2 })
    }
  }
  private hit(row: number, col: number, axis: 'x' | 'y') {
    const index = row * COLUMNS + col
    if (this.cooldown > 0 || this.removed.has(index)) return
    this.cooldown = .085
    const kind = this.block(row, col)
    const damage = Math.max(2, Math.round((3.2 + row * .13) / (1 + (this.pick.power - 1) * .17)))
    this.state.hp = Math.max(0, this.state.hp - damage)
    this.state.hits++
    const cracks = (this.cracks.get(index) ?? 0) + 1
    this.cracks.set(index, cracks)
    const hardness = kind === 'deep' ? 3 : kind === 'stone' ? 2 : 1
    const broken: number[] = []
    this.state.event = 'Mining deeper'
    this.shake = .045
    this.burst(row, col, kind, 4)
    if (cracks >= hardness) {
      const cells = kind === 'tnt' ? [-1, 0, 1].flatMap(dy => [-1, 0, 1].map(dx => [row + dy, col + dx])) : [[row, col]]
      for (const [r, c] of cells) {
        if (!this.solid(r, c)) continue
        const id = r * COLUMNS + c
        this.removed.add(id)
        this.cracks.delete(id)
        broken.push(id)
        this.collect(r, c, this.block(r, c))
        this.burst(r, c, this.block(r, c), kind === 'tnt' ? 9 : 8)
      }
      this.state.cleared += broken.length
      if (kind === 'tnt') { this.shake = .2; this.flash = .65; this.state.event = 'TNT • blast cleared'; this.popups.push({ x: col + .5, y: row, text: 'BOOM!', color: '#ffcb7c', life: .8 }) }
      if (axis === 'x' && index !== this.lastSide) {
        this.sideStreak++
        this.lastSide = index
        if (this.sideStreak >= 2) this.dropColumn = Math.floor(this.x)
      }
      if (axis === 'y') { this.sideStreak = 0; this.lastSide = -1; this.dropColumn = null }
    }
    if (this.state.hp <= 0) { this.state.status = 'complete'; this.state.event = 'Extraction complete' }
    this.lastImpact = { row, col, axis, broken, sideStreak: this.sideStreak }
    this.revision++
  }

  step(dt: number) {
    this.time += dt
    this.cooldown = Math.max(0, this.cooldown - dt)
    this.shake *= Math.exp(-15 * dt)
    this.flash *= Math.exp(-8 * dt)
    this.particles = this.particles.filter(p => { p.life -= dt; p.vy += 16 * dt; p.x += p.vx * dt; p.y += p.vy * dt; return p.life > 0 })
    this.popups = this.popups.filter(p => { p.life -= dt; p.y -= dt * .7; return p.life > 0 })
    if (this.state.status !== 'running') return
    // Fixed small steps + axis collision: a solid block cannot be tunnelled through.
    this.vy = Math.min(11, this.vy + 24 * dt)
    this.vx *= Math.exp(-.12 * dt)
    if (this.dropColumn !== null) {
      this.vx += ((this.dropColumn + .5 - this.x) * 25 - this.vx * 10) * dt
    }
    this.x += this.vx * dt
    if (this.x < this.radius || this.x > COLUMNS - this.radius) {
      this.x = clamp(this.x, this.radius, COLUMNS - this.radius)
      this.vx *= -.75
      this.spin *= -.8
    }
    const sideCol = Math.floor(this.x + Math.sign(this.vx) * this.radius)
    for (let row = Math.floor(this.y - this.radius + .025); row <= Math.floor(this.y + this.radius - .025); row++) {
      if (!this.solid(row, sideCol)) continue
      const dir = Math.sign(this.vx)
      this.x = dir > 0 ? sideCol - this.radius - .001 : sideCol + 1 + this.radius + .001
      this.vx = -dir * (1.4 + this.random() * 1.1)
      this.vy = Math.min(this.vy, -2.6 - this.random() * 1.6)
      this.spin = -dir * (4 + this.random() * 5)
      this.hit(row, sideCol, 'x')
      break
    }
    this.y += this.vy * dt
    const floor = Math.floor(this.y + Math.sign(this.vy) * this.radius)
    for (let col = Math.floor(this.x - this.radius + .025); col <= Math.floor(this.x + this.radius - .025); col++) {
      if (!this.solid(floor, col)) continue
      if (this.vy > 0) {
        const speed = this.vy
        this.y = floor - this.radius - .001
        this.vy = -clamp(speed * (.4 + this.random() * .12), 2.8, 5.5)
        if (this.dropColumn === null) {
          const direction = this.vx === 0 ? (this.random() < .5 ? -1 : 1) : Math.sign(this.vx)
          this.vx = direction * (1.4 + this.random() * 1.9)
        }
        this.spin += (this.vx > 0 ? 1 : -1) * (2.5 + this.random() * 3)
        this.hit(floor, col, 'y')
      } else {
        this.y = floor + 1 + this.radius + .001
        this.vy = Math.abs(this.vy) * .4
        this.spin *= -.55
      }
      break
    }
    this.spin = clamp(this.spin * Math.exp(-.38 * dt), -11, 11)
    this.angle += this.spin * dt
    this.deepest = Math.max(this.deepest, this.y)
    const depth = Math.max(0, Math.floor(this.deepest * 44))
    if (depth !== this.state.depth) { this.state.depth = depth; this.revision++ }
  }
}
