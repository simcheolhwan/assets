import { useEffect } from "react"
import { selector, useRecoilValue } from "recoil"
import { prev, yesterday } from "../utils/history"
import { prevExchange } from "./polygon"
import { addExchange, contentsState, databaseState } from "./database"

export const yesterdayExchangeQuery = selector({
  key: "yesterdayExchange",
  get: ({ get }) => {
    const { exchanges } = get(contentsState)
    return prev(exchanges).USD
  },
})

// If the database is loaded and yesterday's exchange rate is empty,
// a new one will be stored.
export const useYesterdayExchange = () => {
  const { state, contents } = useRecoilValue(databaseState)
  const shouldFetch = state === "hasValue" && !contents.exchanges[yesterday]

  useEffect(() => {
    const fetch = async () => {
      const { data } = await prevExchange()
      addExchange(yesterday, data.results[0].c)
    }

    shouldFetch && fetch()
  }, [shouldFetch])
}
