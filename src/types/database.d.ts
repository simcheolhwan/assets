interface Database {
  balances: Balances
  prices: Prices
  exchanges: Exchanges

  deposits: Deposit[]
  debts: Debts

  assets: Assets
  tickers: Tickers
  wallets: Wallets

  updatedAt: number

  branch?: Balances
}

type Balances = Dictionary<BalanceItem>
type Prices = Dictionary<PriceItem>
type Exchanges = Dictionary<number>

type BalanceItem = Dictionary<number>
type PriceItem = Dictionary<number>

type Debts = Dictionary<Debt>

type Tickers = Dictionary<Ticker>
type Wallets = Dictionary<string>
type Assets = Dictionary<Asset>

interface Deposit {
  date: string
  title: string
  amount?: number
  memo?: string
}

interface Debt {
  amount: number
  borrowedAt: string
  returnedAt?: string
}

type CurrencyTicker = "KRW" | "USD"
interface Ticker {
  tickerKey: string
  currency: CurrencyTicker
  name: string
  icon?: string
  color?: string
  aim?: number
  hidden?: boolean
}

interface Asset {
  balanceKey: string
  tickerKey: string
  walletKey: string
  hidden?: string
}
