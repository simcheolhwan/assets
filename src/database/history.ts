import { selector, waitForAll } from "recoil"
import { dayStatusQuery } from "./day"
import { daysQuery } from "./date"

export const historyQuery = selector({
  key: "history",
  get: ({ get }) => {
    const days = get(daysQuery)
    const history = get(waitForAll(days.map(dayStatusQuery)))
    return history
  },
})
