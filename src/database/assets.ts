import { selector } from "recoil"
import { contentsState } from "./database"

export const assetQuery = selector({
  key: "asset",
  get: ({ get }) => {
    const { tickers, wallets, assets } = get(contentsState)

    return (balanceKey: string) => {
      const asset = assets[balanceKey]
      const { tickerKey, walletKey } = asset
      const ticker = tickers[tickerKey].name
      const wallet = wallets[walletKey]
      return { ...asset, ticker, wallet }
    }
  },
})
