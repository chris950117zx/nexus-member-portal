import type { TransactionStatus } from '../../types/member'
export function StatusBadge({ status }: { status: TransactionStatus }) { return <span className={`status-badge status-badge--${status.toLowerCase()}`}><i />{status}</span> }
