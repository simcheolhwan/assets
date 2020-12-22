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
    const { balances, prices, tickers } = get(contentsState)
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

    const balancePair = {
      UST: ustBalance,
      "MIR-UST LP": lpBalanceMIR,
      "mQQQ-UST LP": lpBalancemQQQ,
    }

    const pricePair = {
      QQQ: stockPriceQQQ,
      TQQQ: stockPriceTQQQ,
      LUNA: lunaPrice,
      MIR: MIRPrice,
    }

    const balanceItem = merge(prevBalances, balancePair, tickers, "balance")
    const priceItem = merge(prevPrices, pricePair, tickers, "price")
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

export const todayDashboardQuery = selector({
  key: "todayDashboard",
  get: ({ get }) => {
    const { tickers, wallets, depts } = get(contentsState)
    const today = get(todayQuery)
    const exchange = get(yesterdayExchangeQuery)
    return calc({ ...today, tickers, wallets, depts, exchange })
  },
})

export const balancesHistoryQuery = selector({
  key: "dashboardHistory",
  get: ({ get }) => {
    const { balances, prices, exchanges, ...rest } = get(contentsState)
    return Object.keys(prices).map((date) => ({
      date,
      dashboard: calc({
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
    .sort(({ value: a }, { value: b }) => b - a)

  return { dataSource, asset, dept, total }
}

const merge = <T>(
  object: T,
  pair: Dictionary<number>,
  tickers: Tickers,
  replace: string
) => {
  const tickerKeyPair = Object.entries(pair).reduce<Dictionary<number>>(
    (acc, [name, value]) => {
      const tickerKey = Object.values(tickers).find(
        (ticker) => ticker.name === name
      )?.tickerKey

      return Object.assign({}, acc, tickerKey && { [tickerKey]: value })
    },
    {}
  )

  return Object.entries(object).reduce((acc, [key, value]) => {
    const next = tickerKeyPair[value.tickerKey]
      ? { ...value, [replace]: tickerKeyPair[value.tickerKey] }
      : value

    return { ...acc, [key]: next }
  }, {} as T)
}
