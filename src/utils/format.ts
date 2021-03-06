import numeral from "numeral"
import { format } from "date-fns"

/* currency */
export const getSign = (ticker: CurrencyTicker) =>
  ({ KRW: "₩", USD: "$" }[ticker])

export const isCurrencyTicker = (name: string): name is CurrencyTicker =>
  ["KRW", "USD"].includes(name)

/* amount */
export const formatAmountWith = (currency?: CurrencyTicker, places = 3) => {
  return (value: number) => {
    const p = Math.pow(10, String(Math.round(value)).length - places)
    const v = Math.round(value / p) * p

    return [currency && getSign(currency), numeral(v).format("0,0.[00]")]
      .filter(Boolean)
      .join(" ")
  }
}

export const formatPrice = (value: number, currency: CurrencyTicker) =>
  formatAmountWith(currency, 6)(value)

export const formatKorean = (number?: number) => {
  if (!number) return ""

  const abs = Math.abs(number)
  const e6 = Math.round(number / 1e6)
  const e7 = Math.round(number / 1e7)
  const e8 = Math.round(number / 1e8)

  return abs < 9.5e5
    ? "0"
    : abs < 9.5e6
    ? e6 + "백"
    : abs < 9.5e7
    ? e7 + "천"
    : e8 + "억"
}

export const formatAmount = formatAmountWith()
export const formatKRW = formatAmountWith("KRW")
export const formatExact = formatAmountWith(undefined, 6)
export const formatThousandKRW = (value: number) =>
  formatAmountWith("KRW", 6)(Math.round(value / 1e3) * 1e3)

/* date */
export const formatDateWith = (fmt = "yyyy-MM-dd") => {
  return (date: string | Date = new Date()) => format(new Date(date), fmt)
}

export const formatDate = formatDateWith()

/* percent */
export const percent = (n: number, integer = false) =>
  numeral(n).format(integer || Math.abs(n) >= 0.1 ? "0%" : "0[.]0%")
