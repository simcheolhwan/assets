import { atom, selector } from "recoil"
import { contentsState } from "./database"

export const withBranchState = atom({
  key: "withBranch",
  default: false,
})

export const branchValuesQuery = selector({
  key: "branchValues",
  get: ({ get }) => {
    const { branch = {}, prices, exchanges, tickers } = get(contentsState)

    return Object.entries(branch).map(([date, balanceItem]) => {
      const row = Object.values(balanceItem).reduce(
        (acc, { tickerKey, balance }) => {
          const { name, currency } = tickers[tickerKey]
          const { USD } = exchanges[date]
          const price = prices[date][tickerKey]?.price ?? 1
          const rate = name === "KRW" ? 1000 : currency === "KRW" ? 1 : USD
          const value = balance * price * rate
          return { ...acc, [name]: balance, value: acc.value + value }
        },
        { value: 0 }
      )

      return { date, ...row }
    })
  },
})

export const balancesWithBranchQuery = selector({
  key: "balancesWithBranch",
  get: ({ get }) => {
    const { balances, branch = {} } = get(contentsState)
    const withBranch = get(withBranchState)

    return Object.entries(balances).reduce<Balances>(
      (acc, [date, balanceItem]) => {
        const next = Object.entries(balanceItem).reduce(
          (acc, [balanceKey, data]) => {
            const branchBalance = branch[date]?.[balanceKey]?.balance ?? 0
            const balance = data.balance + (withBranch ? branchBalance : 0)
            return { ...acc, [balanceKey]: { ...data, balance } }
          },
          {}
        )

        return { ...acc, [date]: next }
      },
      {}
    )
  },
})
