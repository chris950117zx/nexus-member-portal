import type { Activity, MemberProfile, MemberTransaction, Promotion, Reward, WalletState } from '../types/member'

export const defaultProfile: MemberProfile = { id: 'MBR-NEON-001', name: 'Alex Tan', email: 'alex.tan@example.test', phone: '+60 12-000 8801', currency: 'MYR', theme: 'Neon Night', vipLevel: 3 }
export const defaultWallet: WalletState = { balance: 12850.4, bonusBalance: 880, pendingWithdrawal: 1200, rewardPoints: 1280 }
const types: MemberTransaction['type'][] = ['Deposit', 'Withdrawal', 'Bonus', 'Reward', 'Adjustment']
const statuses: MemberTransaction['status'][] = ['Success', 'Success', 'Success', 'Pending', 'Failed']
const channels = ['NEXUS Wallet', 'Local Simulator', 'Promo Engine', 'Reward Vault']
export const defaultTransactions: MemberTransaction[] = Array.from({ length: 20 }, (_, index) => ({
  id: `TX-${['8F21A93','72C9B10','A13E8D2','FF901C4','39AB781','B87D210','61EC4A8','D10F573','90C8E42','4AC71D9','E23B518','783AD02','C9F120E','11DA983','F742BC0','A88E301','5C21DF8','7B90AE4','D451C20','2F81B70'][index]}`,
  type: types[index % types.length], amount: [500, 180, 120, 80, 45, 1200, 260, 320, 60, 700][index % 10],
  date: new Date(Date.now() - index * 7_650_000).toISOString(), status: statuses[index % statuses.length],
  reference: `NXS-${String(2401 + index).padStart(5, '0')}`, channel: channels[index % channels.length], remark: index % 3 === 0 ? 'Member wallet activity' : 'Local simulation',
}))
export const defaultActivities: Activity[] = Array.from({ length: 10 }, (_, index) => ({ id: `ACT-${index + 1}`, title: ['Weekend bonus unlocked', 'Wallet deposit completed', 'Reward points received', 'VIP progress updated'][index % 4], detail: ['+ RM 120.00 bonus credit', '+ RM 500.00', '+ 80 points', 'Closer to VIP 04'][index % 4], date: new Date(Date.now() - index * 4_200_000).toISOString(), tone: (['pink', 'amber', 'violet'] as const)[index % 3] }))
export const defaultPromotions: Promotion[] = [
  { id:'PROMO-1', title:'First Deposit Overdrive', description:'Charge your wallet and unlock a boosted welcome credit.', period:'24 Aug — 30 Sep', tag:'HOT', accent:'pink', claimed:false },
  { id:'PROMO-2', title:'Weekend Reload Bonus', description:'Every weekend top-up carries an extra neon kick.', period:'Every Fri — Sun', tag:'LIMITED', accent:'amber', claimed:false },
  { id:'PROMO-3', title:'Cashback Night', description:'A late-night cashback drop for active members.', period:'8 PM — 2 AM', tag:'NEW', accent:'violet', claimed:false },
  { id:'PROMO-4', title:'VIP Booster', description:'Accelerate your path toward the next VIP tier.', period:'Until 15 Sep', tag:'VIP', accent:'amber', claimed:false },
  { id:'PROMO-5', title:'Lucky Spin Credit', description:'Claim a complimentary spin credit from the vault.', period:'Daily', tag:'NEW', accent:'pink', claimed:false },
  { id:'PROMO-6', title:'Midnight Multiplier', description:'Double reward points during the midnight window.', period:'12 AM — 1 AM', tag:'HOT', accent:'violet', claimed:false },
]
export const defaultRewards: Reward[] = [
  { id:'REWARD-1', title:'RM 10 Bonus Credit', description:'Instant bonus wallet credit.', cost:300, claimed:false, accent:'pink' },
  { id:'REWARD-2', title:'VIP Progress Boost', description:'Add 100 points toward VIP 04.', cost:450, claimed:false, accent:'amber' },
  { id:'REWARD-3', title:'Neon Mystery Drop', description:'Open a member-only surprise.', cost:600, claimed:false, accent:'violet' },
]
