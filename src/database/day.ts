import { selectorFamily } from "recoil"
import { reverse } from "ramda"
import { startOfYear } from "date-fns"
import { formatDate } from "../utils/format"
import { prevDateQuery } from "./date"
import { contentsState } from "./database"
import { depositsHistoryState } from "./deposits"
import { tickerValuesQuery } from "./tickers"

export const dayStatsQuery = selectorFamily({
  key: "dayStats",
  get: (date: string) => ({ get }) => {
    const { debts } = get(contentsState)
    const tickerValues = get(tickerValuesQuery(date))

    const asset = Object.values(tickerValues).reduce(
      (acc, { value }) => acc + value,
      0
    )

    const debt = Object.values(debts).reduce(
      (acc, { amount }) => acc + amount,
      0
    )

    const total = asset - debt

    return { asset, debt, total }
  },
})

export const dayPnLQuery = selectorFamily({
  key: "dayPnL",
  get: (date: string) => ({ get }) => {
    const yesterday = get(prevDateQuery(date))
    const yesterdayStats = get(dayStatsQuery(yesterday))
    const todayStats = get(dayStatsQuery(date))

    /* p&l */
    const pnl = {
      date: yesterday,
      ...calcPnL(todayStats.total, yesterdayStats.total),
    }

    /* p&l: from deposit */
    const depositsHistory = get(depositsHistoryState)
    const deposit = reverse(depositsHistory).find(
      (deposit) => deposit.title === "입금"
    )!

    const pnlFromDeposit = {
      date: deposit.date,
      ...calcPnL(todayStats.total, deposit.balance),
    }

    /* p&l: YTD */
    const startDate = formatDate(startOfYear(new Date(date)))
    const startOfYearStats = get(dayStatsQuery(startDate))
    const pnlYTD = calcPnL(todayStats.total, startOfYearStats.total)

    return { ...todayStats, pnl, pnlFromDeposit, pnlYTD }
  },
})

/* helpers */
export const calcPnL = (current: number, comparison: number) => {
  const pnl = current - comparison
  const change = pnl / comparison
  const isChanged = Math.abs(change) >= 0.001
  return { pnl, change, isChanged }
}
