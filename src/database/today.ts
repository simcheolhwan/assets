import { selector, useRecoilValue } from "recoil"
import { equals, last } from "ramda"
import { formatDate } from "../utils/format"
import { latest, today } from "../utils/history"
import { updateDayData, contentsState } from "./database"
import { lunaPriceQuery, ustBalanceQuery } from "./terra"
import { lpBalanceQuery, symbolPriceQuery } from "./mirror"
import { prevExchangeQuery, stockPriceQuery } from "./polygon"

export const todayDataQuery = selector({
  key: "todayData",
  get: async ({ get }) => {
    const { balances, prices, exchanges, tickers, wallets } = get(contentsState)
    const prevBalances = latest(balances)
    const prevPrices = latest(prices)

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
    const exchange = get(prevExchangeQuery)
    const exchangeItem = { USD: exchange }
    const updates = { balanceItem, priceItem, exchangeItem }

    const isTodayExists = [balances, prices, exchanges].every(
      (group) => last(Object.keys(group).sort()) === today
    )

    !isTodayExists && (await updateDayData(formatDate(), updates))

    return updates
  },
})

export const useUpdateToday = () => {
  const todayData = useRecoilValue(todayDataQuery)
  const { balances, prices, exchanges } = useRecoilValue(contentsState)

  const prevTodayData = {
    balanceItem: balances[today],
    priceItem: prices[today],
    exchangeItem: exchanges[today],
  }

  const update = async () => await updateDayData(today, todayData)
  const isChanged = !equals(todayData, prevTodayData)

  return { isChanged, update }
}

export const todayBalancesQuery = selector({
  key: "todayBalances",
  get: ({ get }) => {
    const { tickers, wallets, depts } = get(contentsState)
    const today = get(todayDataQuery)
    return calc({ ...today, tickers, wallets, depts })
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
        exchangeItem: exchanges[date],
      }),
    }))
  },
})

/* helpers */
interface Params {
  balanceItem: BalanceItem
  priceItem: PriceItem
  exchangeItem: ExchangeItem
  tickers: Tickers
  wallets: Wallets
  depts: Depts
}

const calc = ({ balanceItem, priceItem, exchangeItem, ...rest }: Params) => {
  const { tickers, wallets, depts } = rest

  const data = Object.values(balanceItem).map((data) => {
    const { balance, tickerKey, walletKey } = data
    const price = priceItem[tickerKey]?.price ?? 1
    const { currency, name: ticker, icon, aim } = tickers[tickerKey]
    const { USD: exchange } = exchangeItem
    const rate = currency === "KRW" ? 1 : exchange
    const value = balance * price * rate
    const wallet = wallets[walletKey]
    return { ...data, currency, ticker, icon, wallet, price, value, aim }
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
