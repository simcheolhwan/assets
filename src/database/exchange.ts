import { selector } from "recoil"
import { latest } from "../utils/history"
import { contentsState } from "./database"

export const todayExchangeQuery = selector({
  key: "todayExchange",
  get: ({ get }) => {
    const { exchanges } = get(contentsState)
    return latest(exchanges).USD
  },
})
