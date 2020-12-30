import { selector } from "recoil"
import { contentsState } from "./database"

export const depositsHistoryState = selector({
  key: "depositsHistory",
  get: ({ get }) => {
    const { deposits } = get(contentsState)
    return deposits.reduce<DepositsHistoryItem[]>((acc, cur, index) => {
      // Accumulate the balance
      const { amount = 0 } = cur
      const balance = !index ? amount : acc[index - 1].balance + amount
      return [...acc, { ...cur, balance }]
    }, [])
  },
})
