import { selectorFamily } from "recoil"
import { contentsState } from "./database"
import { prevDateQuery } from "./date"
import { dayStatsQuery } from "./day"

export const tickerBalancesQuery = selectorFamily({
  key: "tickerBalances",
  get: (date: string) => ({ get }) => {
    const { balances, tickers, wallets } = get(contentsState)
    const balanceItem = balances[date]

    return Object.entries(tickers).reduce<Dictionary<TickerBalance>>(
      (acc, [tickerKey, ticker]) => {
        const tickerBalance = Object.values(balanceItem)
          .filter((item) => item.tickerKey === tickerKey)
          .reduce<TickerBalance>(
            (acc, cur) => {
              const wallet = {
                name: wallets[cur.walletKey],
                balance: cur.balance,
              }

              const balance = acc.balance + cur.balance
              return { ...acc, balance, wallets: [...acc.wallets, wallet] }
            },
            { ...ticker, wallets: [], balance: 0 }
          )

        return { ...acc, [tickerKey]: tickerBalance }
      },
      {}
    )
  },
})

export const tickerValuesQuery = selectorFamily({
  key: "tickerValues",
  get: (date: string) => ({ get }) => {
    const { prices, exchanges } = get(contentsState)
    const tickerBalances = get(tickerBalancesQuery(date))
    const yesterday = get(prevDateQuery(date))
    const priceItemYesterday = prices[yesterday]
    const priceItem = prices[date]
    const exchangeItem = exchanges[date]

    return Object.values(tickerBalances).reduce<Dictionary<TickerValue>>(
      (acc, tickerBalance) => {
        const { balance, currency, tickerKey } = tickerBalance

        /* price */
        const price = priceItem[tickerKey]?.price ?? 1
        const yesterdayPrice = priceItemYesterday?.[tickerKey]?.price
        const change =
          price && yesterdayPrice ? price / yesterdayPrice - 1 : undefined

        /* exchange */
        const { USD } = exchangeItem
        const rate = currency === "KRW" ? 1 : USD

        /* value */
        const value = balance * price * rate

        const tickerValue = { ...tickerBalance, price, change, value }
        return { ...acc, [tickerKey]: tickerValue }
      },
      {}
    )
  },
})

export const tickerRatiosQuery = selectorFamily({
  key: "tickerRatios",
  get: (date: string) => ({ get }) => {
    const tickerValues = get(tickerValuesQuery(date))
    const { asset } = get(dayStatsQuery(date))

    return Object.values(tickerValues).reduce<Dictionary<TickerRatio>>(
      (acc, tickerValue) => {
        const { tickerKey, balance, value, aim = 0 } = tickerValue
        const ratio = value / asset
        const aimValue = asset * aim
        const rebalance = balance * (aimValue / value - 1)
        return { ...acc, [tickerKey]: { ...tickerValue, ratio, rebalance } }
      },
      {}
    )
  },
})
