import { selector } from "recoil"
import { contentsState } from "./database"

export const balanceKeyQuery = selector({
  key: "balanceKey",
  get: ({ get }) => {
    const { balances, tickers, wallets } = get(contentsState)

    const merged = Object.values(balances).reduce(
      (acc, cur) => ({ ...acc, ...cur }),
      {}
    )

    return (balanceKey: string) => {
      const { tickerKey, walletKey } = merged[balanceKey]
      const ticker = tickers[tickerKey].name
      const wallet = wallets[walletKey]
      return { tickerKey, walletKey, ticker, wallet }
    }
  },
})
