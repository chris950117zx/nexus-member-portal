import { ArrowDownToLine, ArrowUpFromLine, ShieldCheck, WalletCards, Zap } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { GlowButton } from '../components/ui/GlowButton'
import { AnimatedMoney } from '../components/ui/AnimatedMoney'
import { NeonCard } from '../components/ui/NeonCard'
import { PageHeading } from '../components/ui/PageHeading'
import { useMemberStore } from '../store/useMemberStore'
import { formatDate, formatMoney } from '../utils/format'

export function WalletPage() {
  const { wallet, transactions, depositFunds, withdrawFunds } = useMemberStore()
  const [amount, setAmount] = useState(''); const [note, setNote] = useState(''); const [message, setMessage] = useState('')
  const submit = (event: FormEvent, type: 'deposit' | 'withdraw') => { event.preventDefault(); const value = Number(amount); if (!Number.isFinite(value) || value <= 0) { setMessage('Enter a valid amount greater than zero.'); return } const okay = type === 'deposit' ? (depositFunds(value, note), true) : withdrawFunds(value, note); setMessage(okay ? `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} simulated successfully.` : 'Insufficient wallet balance.'); if (okay) { setAmount(''); setNote('') } }
  return <div><PageHeading eyebrow="WALLET SIMULATION MODE" title="Power your" highlight="neon wallet." description="Deposit and withdraw mock funds stored only in this browser." icon={WalletCards} />
    <section className="wallet-page-grid"><NeonCard className="wallet-total"><div className="wallet-total__icon"><Zap /></div><span>AVAILABLE BALANCE</span><strong><AnimatedMoney value={wallet.balance} /></strong><p>Bonus balance <b>{formatMoney(wallet.bonusBalance)}</b></p><div><ShieldCheck size={14} /> Local-only wallet · No payment gateway connected</div></NeonCard>
      <NeonCard accent="violet" className="wallet-form"><div className="panel-heading"><div><span>LOCAL WALLET CONTROLS</span><h3>Simulate an action</h3></div><span className="simulation-badge">SIMULATION</span></div><form><label>AMOUNT (RM)<input className="neon-input" type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" /></label><label>NOTE / REFERENCE<input className="neon-input" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Optional local note" /></label><div className="wallet-form__actions"><GlowButton onClick={(event) => submit(event, 'deposit')}><ArrowDownToLine size={16} /> DEPOSIT</GlowButton><GlowButton tone="amber" onClick={(event) => submit(event, 'withdraw')}><ArrowUpFromLine size={16} /> WITHDRAW</GlowButton></div>{message && <p className="form-message">{message}</p>}</form></NeonCard></section>
    <NeonCard className="compact-activity"><div className="panel-heading"><div><span>WALLET LOG</span><h3>Recent simulated actions</h3></div></div>{transactions.slice(0,5).map((item) => <div className="compact-row" key={item.id}><span className={`activity-icon activity-icon--${item.type === 'Deposit' ? 'pink' : 'yellow'}`}>{item.type === 'Deposit' ? <ArrowDownToLine size={15} /> : <ArrowUpFromLine size={15} />}</span><div><strong>{item.type}</strong><small>{item.reference} · {formatDate(item.date)}</small></div><b className={item.type === 'Deposit' ? 'amount-positive' : 'amount-negative'}>{item.type === 'Deposit' ? '+' : '-'} {formatMoney(item.amount)}</b></div>)}</NeonCard>
  </div>
}
