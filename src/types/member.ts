export type TransactionType = 'Deposit' | 'Withdrawal' | 'Bonus' | 'Reward' | 'Adjustment'
export type TransactionStatus = 'Success' | 'Pending' | 'Failed'

export interface MemberProfile { id: string; name: string; email: string; phone: string; currency: string; theme: string; vipLevel: number }
export interface WalletState { balance: number; bonusBalance: number; pendingWithdrawal: number; rewardPoints: number }
export interface MemberTransaction { id: string; type: TransactionType; amount: number; date: string; status: TransactionStatus; reference: string; channel: string; remark: string }
export interface Activity { id: string; title: string; detail: string; date: string; tone: 'pink' | 'amber' | 'violet' }
export interface Promotion { id: string; title: string; description: string; period: string; tag: 'HOT' | 'NEW' | 'VIP' | 'LIMITED'; accent: 'pink' | 'amber' | 'violet'; claimed: boolean }
export interface Reward { id: string; title: string; description: string; cost: number; claimed: boolean; accent: 'pink' | 'amber' | 'violet' }
