export const formatMoney = (amount: number) => new Intl.NumberFormat('en-MY', { style:'currency', currency:'MYR' }).format(amount)
export const formatDate = (date: string) => new Intl.DateTimeFormat('en-MY', { dateStyle:'medium', timeStyle:'short' }).format(new Date(date))
