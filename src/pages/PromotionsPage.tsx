import { BadgePercent, CalendarDays, Sparkles } from 'lucide-react'
import { GlowButton } from '../components/ui/GlowButton'
import { NeonCard } from '../components/ui/NeonCard'
import { PageHeading } from '../components/ui/PageHeading'
import { useMemberStore } from '../store/useMemberStore'

export function PromotionsPage() { const { promotions, claimPromotion } = useMemberStore(); return <div><PageHeading eyebrow="ACTIVE BONUS" title="Enter the" highlight="neon drop." description="Explore mock member promotions and locally mark the ones you want." icon={BadgePercent} /><section className="promo-grid">{promotions.map((promo, index) => <NeonCard key={promo.id} accent={promo.accent} className={`promo-card promo-card--${promo.accent}`}><div className="promo-card__number">0{index + 1}</div><span className={`promo-card__tag promo-card__tag--${promo.accent}`}>{promo.tag}</span><Sparkles className="promo-card__icon" /><h3>{promo.title}</h3><p>{promo.description}</p><div className="promo-card__period"><CalendarDays size={13} /> {promo.period}</div><GlowButton tone={promo.accent} onClick={() => claimPromotion(promo.id)} disabled={promo.claimed}>{promo.claimed ? 'JOINED' : 'CLAIM / JOIN'}</GlowButton></NeonCard>)}</section></div> }
