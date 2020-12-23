import { selector, useRecoilValue } from "recoil"
import { equals, last } from "ramda"
import { formatDate } from "../utils/format"
import { prev } from "../utils/history"
import { updateToday, contentsState } from "./database"
import { lunaPriceQuery, ustBalanceQuery } from "./terra"
import { lpBalanceQuery, symbolPriceQuery } from "./mirror"
import { stockPriceQuery } from "./polygon"
import { yesterdayExchangeQuery } from "./exchange"

export const todayQuery = selector({
  key: "today",
  get: async ({ get }) => {
    const { balances, prices, tickers, wallets } = get(contentsState)
    const prevBalances = prev(balances)
    const prevPrices = prev(prices)

    /* Get balances and prices */
    const ustBalance = get(ustBalanceQuery)
    const lpBalanceMIR = get(lpBalanceQuery("MIR"))
    const lpBalancemQQQ = get(lpBalanceQuery("mQQQ"))
    const stockPriceTQQQ = get(stockPriceQuery("TQQQ"))
    const stockPriceQQQ = get(stockPriceQuery("QQQ"))
    const lunaPrice = get(lunaPriceQuery)
    const MIRPrice = get(symbolPriceQuery("MIR"))

    /* Get key */
    const findTickerKey = (ticker: string) =>
      Object.values(tickers).find(({ name }) => name === ticker)?.tickerKey ??
      ""

    const findWalletKey = (wallet: string) =>
      Object.keys(wallets).find((key) => wallets[key] === wallet) ?? ""

    const findBalanceKey = (ticker: string, wallet: string) => {
      const match = (balance: Balance) =>
        balance.tickerKey === tickerKey && balance.walletKey === walletKey

      const tickerKey = findTickerKey(ticker)
      const walletKey = findWalletKey(wallet)

      return Object.values(prevBalances).find(match)?.balanceKey ?? ""
    }

    const balanceDict = {
      [findBalanceKey("UST", "스테이션")]: ustBalance,
      [findBalanceKey("MIR-UST LP", "미러")]: lpBalanceMIR,
      [findBalanceKey("mQQQ-UST LP", "미러")]: lpBalancemQQQ,
    }

    const priceDict = {
      [findTickerKey("QQQ")]: stockPriceQQQ,
      [findTickerKey("TQQQ")]: stockPriceTQQQ,
      [findTickerKey("LUNA")]: lunaPrice,
      [findTickerKey("MIR")]: MIRPrice,
    }

    const balanceItem = merge(prevBalances, balanceDict, "balance")
    const priceItem = merge(prevPrices, priceDict, "price")
    const updates = { balanceItem, priceItem }

    const isTodayExists = [balances, prices].every(
      (group) => last(Object.keys(group).sort()) === formatDate()
    )

    !isTodayExists && (await updateToday(formatDate(), updates))

    return updates
  },
})

export const useUpdateToday = () => {
  const today = useRecoilValue(todayQuery)
  const { balances, prices } = useRecoilValue(contentsState)
  const yesterday = { balanceItem: prev(balances), priceItem: prev(prices) }
  const isChanged = !equals(today, yesterday)

  const update = async () => {
    await updateToday(formatDate(), today)
  }

  return { isChanged, update }
}

export const todayBalancesQuery = selector({
  key: "todayBalances",
  get: ({ get }) => {
    const { tickers, wallets, depts } = get(contentsState)
    const today = get(todayQuery)
    const exchange = get(yesterdayExchangeQuery)
    return calc({ ...today, tickers, wallets, depts, exchange })
  },
})

export const balancesHistoryQuery = selector({
  key: "balancesHistory",
  get: ({ get }) => {
    const { balances, prices, exchanges, ...rest } = get(contentsState)
    return Object.keys(prices).map((date) => ({
      date,
      balances: calc({
        ...rest,
        balanceItem: balances[date],
        priceItem: prices[date],
        exchange: exchanges[date]?.USD ?? prev(exchanges).USD,
      }),
    }))
  },
})

/* helpers */
interface Params {
  exchange: number
  balanceItem: BalanceItem
  priceItem: PriceItem
  tickers: Tickers
  wallets: Wallets
  depts: Depts
}

const calc = (params: Params) => {
  const { exchange, balanceItem, priceItem, tickers, wallets, depts } = params

  const data = Object.values(balanceItem).map((data) => {
    const { balance, tickerKey, walletKey } = data
    const price = priceItem[tickerKey]?.price ?? 1
    const { name: ticker, currency, aim } = tickers[tickerKey]
    const rate = currency === "KRW" ? 1 : exchange
    const value = balance * price * rate
    const wallet = wallets[walletKey]
    return { ...data, currency, ticker, wallet, price, value, aim }
  })

  const asset = data.reduce((acc, { value }) => acc + value, 0)
  const dept = Object.values(depts).reduce((acc, { amount }) => acc + amount, 0)
  const total = asset - dept

  const dataSource = data
    .map((item) => {
      const { balance, value, aim = 0 } = item
      const ratio = value / asset
      const aimValue = asset * aim
      const rebalance = balance * (aimValue / value - 1)
      return { ...item, ratio, rebalance }
    })
    .sort(({ aim: a = 0 }, { aim: b = 0 }) => b - a)

  return { dataSource, asset, dept, total }
}

const merge = <T>(source: T, dict: Dictionary<number>, replaceKey: string) =>
  Object.entries(source).reduce((acc, [key, value]) => {
    const next = dict[key] ? { ...value, [replaceKey]: dict[key] } : value
    return { ...acc, [key]: next }
  }, {} as T)
