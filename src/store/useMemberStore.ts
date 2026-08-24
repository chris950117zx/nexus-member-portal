import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { defaultActivities, defaultProfile, defaultPromotions, defaultRewards, defaultTransactions, defaultWallet } from '../data/memberData'
import type { Activity, MemberProfile, MemberTransaction, Promotion, Reward, WalletState } from '../types/member'

export type PortalTheme = 'neon-night' | 'black-yellow' | 'violet-haze'
interface MemberStore { profile: MemberProfile; wallet: WalletState; transactions: MemberTransaction[]; activities: Activity[]; promotions: Promotion[]; rewards: Reward[]; portalTheme: PortalTheme; isAuthenticated: boolean; login: (username: string, password: string) => boolean; logout: () => void; depositFunds: (amount: number, note: string) => void; withdrawFunds: (amount: number, note: string) => boolean; claimPromotion: (id: string) => void; claimReward: (id: string) => boolean; updateProfile: (profile: Partial<MemberProfile>) => void; setPortalTheme: (theme: PortalTheme) => void; resetDemo: () => void }
const freshDefaults = () => ({ profile: { ...defaultProfile }, wallet: { ...defaultWallet }, transactions: defaultTransactions.map((item) => ({ ...item })), activities: defaultActivities.map((item) => ({ ...item })), promotions: defaultPromotions.map((item) => ({ ...item })), rewards: defaultRewards.map((item) => ({ ...item })), portalTheme:'neon-night' as PortalTheme, isAuthenticated:false })
const makeId = () => `TX-${Math.random().toString(16).slice(2, 9).toUpperCase()}`
const makeActivityId = () => `ACT-${Date.now()}`

export const useMemberStore = create<MemberStore>()(persist((set, get) => ({
  ...freshDefaults(),
  login: (username, password) => { const valid = username === 'alex@nexus.demo' && password === 'NEXUS404'; if (valid) set({ isAuthenticated:true }); return valid },
  logout: () => set({ isAuthenticated:false }),
  depositFunds: (amount, note) => set((state) => { const date = new Date().toISOString(); const transaction: MemberTransaction = { id: makeId(), type:'Deposit', amount, date, status:'Success', reference:`SIM-${Date.now()}`, channel:'Local Simulator', remark:note || 'Wallet deposit' }; return { wallet:{ ...state.wallet, balance:state.wallet.balance + amount }, transactions:[transaction, ...state.transactions], activities:[{ id:makeActivityId(), title:'Wallet deposit completed', detail:`+ RM ${amount.toFixed(2)}`, date, tone:'pink' }, ...state.activities] } }),
  withdrawFunds: (amount, note) => { if (get().wallet.balance < amount) return false; set((state) => { const date = new Date().toISOString(); const transaction: MemberTransaction = { id:makeId(), type:'Withdrawal', amount, date, status:'Success', reference:`SIM-${Date.now()}`, channel:'Local Simulator', remark:note || 'Wallet withdrawal' }; return { wallet:{ ...state.wallet, balance:state.wallet.balance - amount }, transactions:[transaction, ...state.transactions], activities:[{ id:makeActivityId(), title:'Wallet withdrawal completed', detail:`- RM ${amount.toFixed(2)}`, date, tone:'amber' }, ...state.activities] } }); return true },
  claimPromotion: (id) => set((state) => ({ promotions:state.promotions.map((promo) => promo.id === id ? { ...promo, claimed:true } : promo), activities:[{ id:makeActivityId(), title:'Promotion joined', detail:state.promotions.find((promo) => promo.id === id)?.title ?? 'Promotion', date:new Date().toISOString(), tone:'pink' }, ...state.activities] })),
  claimReward: (id) => { const reward = get().rewards.find((item) => item.id === id); if (!reward || reward.claimed || get().wallet.rewardPoints < reward.cost) return false; set((state) => ({ wallet:{ ...state.wallet, rewardPoints:state.wallet.rewardPoints - reward.cost }, rewards:state.rewards.map((item) => item.id === id ? { ...item, claimed:true } : item), activities:[{ id:makeActivityId(), title:'Reward claimed', detail:reward.title, date:new Date().toISOString(), tone:'violet' }, ...state.activities] })); return true },
  updateProfile: (profile) => set((state) => ({ profile:{ ...state.profile, ...profile } })),
  setPortalTheme: (portalTheme) => set({ portalTheme }),
  resetDemo: () => set(freshDefaults()),
}), { name:'nexus-member-demo-v1' }))
