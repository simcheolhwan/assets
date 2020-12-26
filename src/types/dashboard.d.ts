interface Dashboard {
  tickerKey: string
  wallets: DashboardWallet[]
  balance: number
}

interface DashboardWallet {
  name: string
  balance: number
}
