import { selector } from "recoil"
import { contentsState } from "./database"

export const depositsHistoryState = selector({
  key: "depositsHistory",
  get: ({ get }) => {
    const { deposits } = get(contentsState)
    return deposits.reduce<DepositsHistoryItem[]>((acc, cur, index) => {
      // Accumulate the balance
      const balance = !index ? cur.amount : acc[index - 1].balance + cur.amount
      return [...acc, { ...cur, balance }]
    }, [])
  },
})
