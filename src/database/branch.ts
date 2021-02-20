import { atom, selector } from "recoil"
import { contentsState } from "./database"

export const withBranchState = atom({
  key: "withBranch",
  default: false,
})

export const branchValuesQuery = selector({
  key: "branchValues",
  get: ({ get }) => {
    const contents = get(contentsState)
    const { branch = {}, prices, exchanges, tickers, assets } = contents

    return Object.entries(branch).map(([date, balanceItem]) => {
      const row = Object.entries(balanceItem).reduce(
        (acc, [balanceKey, balance]) => {
          const { tickerKey } = assets[balanceKey]
          const { name, currency } = tickers[tickerKey]
          const exchange = exchanges[date]
          const price = prices[date][tickerKey] ?? 1
          const rate = name === "KRW" ? 1000 : currency === "KRW" ? 1 : exchange
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
          (acc, [balanceKey, initial]) => {
            const branchBalance = branch[date]?.[balanceKey] ?? 0
            const balance = initial + (withBranch ? branchBalance : 0)
            return { ...acc, [balanceKey]: balance }
          },
          {}
        )

        return { ...acc, [date]: next }
      },
      {}
    )
  },
})
