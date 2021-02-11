interface Database {
  balances: Balances
  prices: Prices
  exchanges: Exchanges

  deposits: Deposit[]
  debts: Debts

  tickers: Tickers
  wallets: Wallets

  updatedAt: number

  branch?: Balances
}

type Balances = Dictionary<BalanceItem>
type Prices = Dictionary<PriceItem>
type Exchanges = Dictionary<ExchangeItem>

type BalanceItem = Dictionary<Balance>
type PriceItem = Dictionary<Price>

type Debts = Dictionary<Debt>

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

interface DayItem {
  balanceItem: BalanceItem
  priceItem: PriceItem
  exchangeItem: ExchangeItem
}
