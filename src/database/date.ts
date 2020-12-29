import { selector, selectorFamily } from "recoil"
import { last, uniq } from "ramda"
import { contentsState } from "./database"

export const prevDateQuery = selectorFamily({
  key: "prevDate",
  get: (date: string) => ({ get }) => {
    const days = get(daysQuery)
    return days[days.indexOf(date) - 1]
  },
})

export const latestDateQuery = selector({
  key: "latestDate",
  get: ({ get }) => {
    const days = get(daysQuery)
    return last(days)!
  },
})

export const daysQuery = selector({
  key: "days",
  get: ({ get }) => {
    const { balances } = get(contentsState)
    return uniq(Object.keys(balances).sort())
  },
})
