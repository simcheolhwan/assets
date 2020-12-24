import { selector, waitForAll } from "recoil"
import { daysQuery, dayStatusQuery } from "./day"

export const historyQuery = selector({
  key: "history",
  get: ({ get }) => {
    const days = get(daysQuery)
    const history = get(waitForAll(days.map(dayStatusQuery)))
    return history
  },
})
