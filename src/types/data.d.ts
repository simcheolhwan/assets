type State = "loading" | "hasValue"
type CurrencyTicker = "KRW" | "USD"

/* database */
interface Database {
  tickers: Tickers
  wallets: Wallets

  exchanges: Dictionary<ExchangeItem>
  prices: Dictionary<PriceItem>
  balances: Dictionary<BalanceItem>

  deposits: Deposit[]
  depts: Depts
}

type Tickers = Dictionary<Ticker>
type Wallets = Dictionary<Wallet>
type PriceItem = Dictionary<Price>
type BalanceItem = Dictionary<Balance>
type Depts = Dictionary<Dept>

interface Ticker {
  tickerKey: string
  currency: CurrencyTicker
  name: string
  icon?: string
  aim?: number
}

interface ExchangeItem {
  USD: number
}

interface Price {
  price: number
  tickerKey: string
}

interface Balance {
  balance: number
  balanceKey: string
  tickerKey: string
  walletKey: string
}

interface Deposit {
  date: string
  title: string
  amount: number
}

interface Dept {
  amount: number
}

interface DayItem {
  balanceItem: BalanceItem
  priceItem: PriceItem
  exchangeItem: ExchangeItem
}

/* history */
interface DepositsHistoryItem extends Deposit {
  balance: number
}

interface BalancesHistoryItem {
  date: string
}
