interface Database {
  balances: Dictionary<BalanceItem>
  prices: Dictionary<PriceItem>
  exchanges: Dictionary<ExchangeItem>

  deposits: Deposit[]
  depts: Depts

  tickers: Tickers
  wallets: Wallets

  updatedAt: number
}

type BalanceItem = Dictionary<Balance>
type PriceItem = Dictionary<Price>

type Depts = Dictionary<Dept>

type Tickers = Dictionary<Ticker>
type Wallets = Dictionary<string>

interface Balance {
  balance: number
  balanceKey: string
  tickerKey: string
  walletKey: string
}

interface Price {
  price: number
  tickerKey: string
}

interface ExchangeItem {
  USD: number
}

interface Deposit {
  date: string
  title: string
  amount: number
}

interface Dept {
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
  aim?: number
}

interface DayItem {
  balanceItem: BalanceItem
  priceItem: PriceItem
  exchangeItem: ExchangeItem
}
