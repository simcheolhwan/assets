import { isAfter, isBefore } from "date-fns"
import { selector, selectorFamily, waitForAll } from "recoil"
import { contentsState } from "./database"
import { daysQuery, todayQuery } from "./date"
import { dayStatsQuery } from "./day"
import { tickerBalancesQuery, tickerRatiosQuery } from "./tickers"

export const chartItemQuery = selectorFamily({
  key: "chartItem",
  get: (date: string) => ({ get }) => {
    const stats = get(dayStatsQuery(date))
    const ticker = get(tickerRatiosQuery(date))
    return { date, stats, ticker }
  },
})

export const chartHistoryQuery = selector({
  key: "chartHistoryHistory",
  get: ({ get }) => {
    const days = get(daysQuery)
    return get(waitForAll(days.map(chartItemQuery)))
  },
})

export const depositedDaysQuery = selector({
  key: "depositedDays",
  get: ({ get }) => {
    const today = get(todayQuery)
    const { balances, deposits } = get(contentsState)
    const genesis = Object.keys(balances)[0]

    return deposits
      .filter(({ date }) => {
        const isAfterGenesis =
          date === genesis || isAfter(new Date(date), new Date(genesis))
        const isBeforeToday = isBefore(new Date(date), new Date(today))
        return isAfterGenesis && isBeforeToday
      })
      .map(({ date }) => date)
  },
})

export const rebalancedDaysQuery = selector({
  key: "rebalanceDays",
  get: ({ get }) => {
    const today = get(todayQuery)
    const days = get(daysQuery)
    const tickerBalances = get(waitForAll(days.map(tickerBalancesQuery)))

    return days.filter((date, index) => {
      const current = tickerBalances[index]
      return Object.values(current).some(({ tickerKey, name, balance }) => {
        const previous = index
          ? tickerBalances[index - 1][tickerKey]
          : undefined

        return (
          !name.includes("LP") &&
          balance !== previous?.balance &&
          isBefore(new Date(date), new Date(today))
        )
      })
    })
  },
})

export const chartDaysQuery = selector({
  key: "chartDays",
  get: ({ get }) => {
    const rebalancedDays = get(rebalancedDaysQuery)
    const depositedDays = get(depositedDaysQuery)
    return { rebalancedDays, depositedDays }
  },
})
