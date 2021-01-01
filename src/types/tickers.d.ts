interface TickerBalance extends Ticker {
  wallets: TickerWallet[]
  balance: number
}

interface TickerWallet {
  name: string
  balance: number
}

interface TickerValue extends TickerBalance {
  price: number
  change?: number
  value: number
}

interface TickerRatio extends TickerValue {
  ratio: number
  rebalance: number
}
