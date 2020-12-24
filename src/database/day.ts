import { selector, selectorFamily, waitForAll } from "recoil"
import { isNil, reverse, uniq } from "ramda"
import { isBefore } from "date-fns"
import { yesterday } from "../utils/history"
import { contentsState, depositsHistoryState } from "./database"

export const dayStatusQuery = selectorFamily({
  key: "dayStatus",
  get: (date: string) => ({ get }) => {
    const contents = get(contentsState)
    const { balances, prices, exchanges, tickers, wallets, depts } = contents

    const balanceItem = balances[date]
    const priceItem = prices[date]
    const exchangeItem = exchanges[date]

    /* calculate values */
    const data = Object.values(balanceItem).map((data) => {
      const { balance, tickerKey, walletKey } = data
      const { currency, name: ticker, icon, aim } = tickers[tickerKey]
      const price = priceItem[tickerKey]?.price ?? 1
      const { USD } = exchangeItem
      const rate = currency === "KRW" ? 1 : USD
      const value = balance * price * rate
      const wallet = wallets[walletKey]
      return { ...data, currency, ticker, icon, wallet, price, value, aim }
    })

    /* statistics */
    const asset = data.reduce((acc, { value }) => acc + value, 0)
    const dept = Object.values(depts).reduce(
      (acc, { amount }) => acc + amount,
      0
    )

    const total = asset - dept

    /* table */
    const dataSource = data
      .map((item) => {
        const { balance, value, aim = 0 } = item
        const ratio = value / asset
        const aimValue = asset * aim
        const rebalance = balance * (aimValue / value - 1)
        return { ...item, ratio, rebalance }
      })
      .sort(({ aim: a = 0 }, { aim: b = 0 }) => b - a)

    return { date, dataSource, asset, dept, total }
  },
})

export const dayQuery = selectorFamily({
  key: "day",
  get: (date: string) => ({ get }) => {
    const prevDate = get(prevDateQuery(date))
    const prevStatus = get(dayStatusQuery(prevDate))
    const dayStatus = get(dayStatusQuery(date))

    /* p&l */
    const pnl = {
      date: prevDate === yesterday ? "어제" : prevDate,
      ...calcPnL(dayStatus.total, prevStatus.total),
    }

    /* p&l: from deposit */
    const depositsHistory = get(depositsHistoryState)
    const deposit = reverse(depositsHistory).find((deposit) =>
      isBefore(new Date(deposit.date), new Date(date))
    )!

    const pnlFromDeposit = {
      date: deposit.date,
      ...calcPnL(dayStatus.total, deposit.balance),
    }

    return { ...dayStatus, pnl, pnlFromDeposit }
  },
})

export const dayPricesQuery = selectorFamily({
  key: "dayPrices",
  get: (date: string) => ({ get }) => {
    const { tickers, prices } = get(contentsState)
    const prevDate = get(prevDateQuery(date))
    const priceItemYesterday = prices[prevDate]
    const priceItem = prices[date]

    /* table */
    const dataSource = Object.values(tickers)
      .map((ticker) => {
        const { tickerKey } = ticker
        const price = priceItem[tickerKey]?.price
        const yesterday = priceItemYesterday[tickerKey]?.price
        const change = price ? price / yesterday - 1 : undefined
        return { ...ticker, price, change }
      })
      .sort(({ change: a = 0 }, { change: b = 0 }) => b - a)
      .sort(
        ({ change: a }, { change: b }) => Number(isNil(a)) - Number(isNil(b))
      )

    return dataSource
  },
})

export const prevDateQuery = selectorFamily({
  key: "prevDate",
  get: (date: string) => ({ get }) => {
    const days = get(daysQuery)
    return days[days.indexOf(date) - 1]
  },
})

export const daysQuery = selector({
  key: "days",
  get: ({ get }) => {
    const { balances } = get(contentsState)
    return uniq(Object.keys(balances).sort())
  },
})

export const historyQuery = selector({
  key: "history",
  get: ({ get }) => {
    const days = get(daysQuery)
    const history = get(waitForAll(days.map(dayStatusQuery)))
    return history
  },
})

/* helpers */
const calcPnL = (current: number, comparison: number) => {
  const pnl = current - comparison
  const change = pnl / comparison
  const isChanged = Math.abs(change) >= 0.001
  return { pnl, change, isChanged }
}
