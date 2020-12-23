import { useEffect } from "react"
import { selector, useRecoilValue } from "recoil"
import { prev, today } from "../utils/history"
import { prevExchange } from "./polygon"
import { addExchange, contentsState, databaseState } from "./database"

export const todayExchangeQuery = selector({
  key: "todayExchange",
  get: ({ get }) => {
    const { exchanges } = get(contentsState)
    return prev(exchanges).USD
  },
})

// If the database is loaded and today's exchange rate is empty,
// a new one will be stored.
export const useTodayExchange = () => {
  const { state, contents } = useRecoilValue(databaseState)
  const shouldFetch = state === "hasValue" && !contents.exchanges[today]

  useEffect(() => {
    const fetch = async () => {
      const { data } = await prevExchange()
      addExchange(today, data.results[0].c)
    }

    shouldFetch && fetch()
  }, [shouldFetch])
}
