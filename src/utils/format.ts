import numeral from "numeral"
import { format } from "date-fns"

/* currency */
export const getSign = (ticker: CurrencyTicker) =>
  ({ KRW: "₩", USD: "$" }[ticker])

/* amount */
export const formatAmountWith = (currency?: CurrencyTicker) => {
  return (value: number) => {
    const v = value > 1e6 ? Math.round(value / 1000) * 1000 : value
    return [currency && getSign(currency), numeral(v).format()]
      .filter(String)
      .join(" ")
  }
}

export const formatAmount = formatAmountWith()
export const formatKRW = formatAmountWith("KRW")

export const formatM = (number: number) =>
  number ? Math.round(number / 1e6) + "백만" : ""

export const formatBigKRW = (number: number) =>
  formatKRW(Math.round(number / 1e6) * 1e6)

/* date */
export const formatDateWith = (fmt = "yyyy-MM-dd") => {
  return (date: string | Date = new Date()) => format(new Date(date), fmt)
}

export const formatDate = formatDateWith()

/* percent */
export const percent = (n: number, integer = false) =>
  numeral(n).format(integer ? "0%" : "0.[00]%")
