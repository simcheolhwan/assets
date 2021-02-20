import { selectorFamily } from "recoil"
import { prevDateQuery } from "./date"
import { dayStatsQuery } from "./day"
import { contentsState } from "./database"
import { balancesWithBranchQuery } from "./branch"

export const tickerBalancesQuery = selectorFamily({
  key: "tickerBalances",
  get: (date: string) => ({ get }) => {
    const { tickers, wallets, assets } = get(contentsState)
    const balances = get(balancesWithBranchQuery)
    const balanceItem = balances[date]

    return Object.entries(tickers).reduce<Dictionary<TickerBalance>>(
      (acc, [tickerKey, ticker]) => {
        const filteredAssets = Object.values(assets).filter(
          (item) => item.tickerKey === tickerKey
        )

        const tickerBalance = filteredAssets.reduce<TickerBalance>(
          (acc, { balanceKey, walletKey }) => {
            const balance = balanceItem[balanceKey] ?? 0
            const wallet = { name: wallets[walletKey], balance: balance }
            const next = acc.balance + balance

            return { ...acc, balance: next, wallets: [...acc.wallets, wallet] }
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
    const exchange = exchanges[date]

    return Object.values(tickerBalances).reduce<Dictionary<TickerValue>>(
      (acc, tickerBalance) => {
        const { balance, name, currency, tickerKey } = tickerBalance

        /* price */
        const price = priceItem[tickerKey] ?? 1
        const yesterdayPrice = priceItemYesterday?.[tickerKey]
        const change =
          price && yesterdayPrice ? price / yesterdayPrice - 1 : undefined

        /* exchange */
        const rate = name === "KRW" ? 1000 : currency === "KRW" ? 1 : exchange

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
