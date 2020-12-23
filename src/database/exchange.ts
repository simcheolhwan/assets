import { useEffect } from "react"
import { selector } from "recoil"
import { latest, today } from "../utils/history"
import { prevExchange } from "./polygon"
import { addExchange, contentsState } from "./database"

export const todayExchangeQuery = selector({
  key: "todayExchange",
  get: ({ get }) => {
    const { exchanges } = get(contentsState)
    return latest(exchanges).USD
  },
})

export const useTodayExchange = () => {
  useEffect(() => {
    const fetch = async () => {
      const { data } = await prevExchange()
      addExchange(today, data.results[0].c)
    }

    fetch()
  }, [])
}
