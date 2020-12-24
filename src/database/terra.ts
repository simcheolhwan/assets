import { LCDClient } from "@terra-money/terra.js"

export const address = process.env.REACT_APP_TERRA_ADDRESS!

const chainID = "columbus-4"
const URL = "https://lcd.terra.dev"
export const lcd = new LCDClient({ chainID, URL })

/* UST balance */
export const queryUSTBalance = async () => {
  try {
    const bankBalance = await lcd.bank.balance(address)
    const uusdBalance = bankBalance.get("uusd")?.amount
    return uusdBalance?.div(1e6).toNumber() ?? 0
  } catch {
    return 0
  }
}

/* Luna price */
export const queryLunaPrice = async () => {
  try {
    const exchangeRate = await lcd.oracle.exchangeRate("ukrw")
    return exchangeRate?.toIntCoin().amount.toNumber() ?? 0
  } catch {
    return 0
  }
}
