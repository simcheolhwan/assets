import numeral from "numeral"
import { format } from "date-fns"

/* currency */
export const getSign = (ticker: CurrencyTicker) =>
  ({ KRW: "₩", USD: "$" }[ticker])

export const isCurrencyTicker = (name: string): name is CurrencyTicker =>
  ["KRW", "USD"].includes(name)

/* amount */
export const formatAmountWith = (
  currency?: CurrencyTicker,
  noRound = false
) => {
  return (value: number) => {
    const p = Math.pow(10, String(Math.round(value)).length - 3)
    const v = noRound ? value : Math.round(value / p) * p

    return [currency && getSign(currency), numeral(v).format()]
      .filter(Boolean)
      .join(" ")
  }
}

export const formatPrice = (value: number, currency: CurrencyTicker) =>
  formatAmountWith(currency, true)(value)

export const formatM = (number: number) =>
  number ? Math.round(number / 1e6) + "백만" : "0"

export const formatAmount = formatAmountWith()
export const formatKRW = formatAmountWith("KRW")
export const formatExchange = formatAmountWith("KRW", true)

/* date */
export const formatDateWith = (fmt = "yyyy-MM-dd") => {
  return (date: string | Date = new Date()) => format(new Date(date), fmt)
}

export const formatDate = formatDateWith()

/* percent */
export const percent = (n: number, integer = false) =>
  numeral(n).format(integer ? "0%" : "0[.]0%")
