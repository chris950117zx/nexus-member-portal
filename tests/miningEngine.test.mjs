import assert from 'node:assert/strict'
import { MiningEngine, PICKS, COLUMNS } from '../src/pages/miningEngine.ts'

// Deterministic worlds let us replay physics and catch double rewards or tunnelling.
let contacts = 0, blasts = 0, sides = 0
for (const pick of PICKS) {
  for (let seed = 1; seed <= 40; seed++) {
    const engine = new MiningEngine(pick, seed)
    engine.step(1 / 240)
    assert.equal(engine.state.hp, pick.hp, 'idle must not spend HP')
    assert.equal(engine.state.hits, 0)
    engine.start()
    let oldHits = 0, oldRemoved = new Set(), seconds = 0
    for (; seconds < 180 && engine.state.status === 'running'; seconds += 1 / 240) {
      engine.step(1 / 240)
      assert.ok(Number.isFinite(engine.x) && Number.isFinite(engine.y))
      assert.ok(engine.x >= 0 && engine.x <= COLUMNS, 'shaft boundaries')
      assert.ok(engine.state.hp >= 0 && engine.state.hp <= pick.hp, 'HP bounds')
      assert.ok(engine.sideStreak <= 2, 'two sideways breaks maximum')
      if (oldHits === engine.state.hits) continue
      oldHits = engine.state.hits
      contacts++
      const hit = engine.lastImpact
      assert.ok(hit.row >= 0 && hit.col >= 0 && hit.col < COLUMNS)
      if (hit.axis === 'x') sides++
      if (engine.block(hit.row, hit.col) !== 'tnt') assert.ok(hit.broken.length <= 1, 'normal hits break only one block')
      else if (hit.broken.length) blasts++
      for (const index of hit.broken) assert.ok(!oldRemoved.has(index), 'a removed block can never pay twice')
      if (hit.broken.length) {
        const reachable = hit.row === 0 || [
          (hit.row - 1) * COLUMNS + hit.col,
          ...(hit.col > 0 ? [hit.row * COLUMNS + hit.col - 1] : []),
          ...(hit.col < COLUMNS - 1 ? [hit.row * COLUMNS + hit.col + 1] : []),
        ].some(index => oldRemoved.has(index))
        assert.ok(reachable, 'contact must touch the surface or a connected opening, never skip a solid block')
      }
      oldRemoved = new Set(engine.removed)
      assert.equal(engine.state.cleared, engine.removed.size)
    }
    assert.equal(engine.state.status, 'complete', `run must finish without getting stuck: ${pick.id}/${seed}`)
    assert.ok(engine.state.depth > 0)
    const value = engine.state.value, hits = engine.state.hits
    engine.step(1 / 240)
    assert.equal(engine.state.value, value, 'completed run cannot award more')
    assert.equal(engine.state.hits, hits)
  }
}
assert.ok(blasts > 0 && sides > 0)
console.log(`160 complete runs passed: ${contacts} contacts, ${sides} side impacts, ${blasts} TNT blasts. No skipped solid blocks, duplicate rewards, stuck runs or sideways-limit failures.`)
