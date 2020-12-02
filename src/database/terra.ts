import { LCDClient } from "@terra-money/terra.js"
import { selector } from "recoil"

export const address = process.env.REACT_APP_TERRA_ADDRESS!

const chainID = "columbus-4"
const URL = "https://lcd.terra.dev"
export const lcd = new LCDClient({ chainID, URL })

/* UST balance */
export const ustBalanceQuery = selector({
  key: "ustBalance",
  get: async () => {
    const bankBalance = await lcd.bank.balance(address)
    const uusdBalance = bankBalance.get("uusd")?.amount
    return uusdBalance?.div(1e6).toNumber() ?? 0
  },
})

/* Luna price */
export const lunaPriceQuery = selector({
  key: "lunaPrice",
  get: async () => {
    const exchangeRate = await lcd.oracle.exchangeRate("ukrw")
    return exchangeRate?.toIntCoin().amount.toNumber() ?? 0
  },
})
