import { useEffect } from "react"
import { atom, selector, selectorFamily, useSetRecoilState } from "recoil"
import { last, uniq } from "ramda"
import { startOfSecond } from "date-fns"
import { contentsState } from "./database"

export const nowState = atom({
  key: "now",
  default: startOfSecond(Date.now()).getTime(),
})

export const todayQuery = selector({
  key: "today",
  get: ({ get }) => get(latestDateQuery),
})

export const yesterdayQuery = selector({
  key: "yesterday",
  get: ({ get }) => get(prevDateQuery(get(todayQuery))),
})

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

/* hooks */
export const useUpdateNow = () => {
  const setNow = useSetRecoilState(nowState)

  useEffect(() => {
    setInterval(() => setNow(startOfSecond(new Date()).getTime()), 1000)
  }, [setNow])
}
