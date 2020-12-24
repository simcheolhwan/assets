import { useEffect } from "react"
import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil"
import { db } from "../firebase"
import { authState } from "./auth"

const initial = {
  tickers: {},
  wallets: {},
  exchanges: {},
  prices: {},
  balances: {},
  deposits: [],
  depts: {},
}

const init = () => {
  const local = localStorage.getItem("database") ?? JSON.stringify(initial)

  try {
    const parsed: Database = JSON.parse(local)
    return { state: "hasValue" as const, contents: parsed }
  } catch (error) {
    return { state: "loading" as const, contents: initial }
  }
}

/* state: database */
export const databaseState = atom<Loadable<Database>>({
  key: "database",
  default: init(),
})

/* selectors: database */
export const loadingState = selector({
  key: "loading",
  get: ({ get }) => {
    const { state } = get(databaseState)
    return state === "loading"
  },
})

export const contentsState = selector({
  key: "contents",
  get: ({ get }) => {
    const { contents } = get(databaseState)
    return { ...contents }
  },
})

export const depositsHistoryState = selector({
  key: "deposits",
  get: ({ get }) => {
    const { deposits } = get(contentsState)
    return deposits.reduce<DepositsHistoryItem[]>((acc, cur, index) => {
      // Accumulate the balance
      const balance = !index ? cur.amount : acc[index - 1].balance + cur.amount
      return [...acc, { ...cur, balance }]
    }, [])
  },
})

/* load: database */
export const useDatabase = () => {
  const { contents: authenticated } = useRecoilValue(authState)
  const setDatabase = useSetRecoilState(databaseState)

  useEffect(() => {
    authenticated &&
      db.ref().on("value", (snapshot) => {
        const contents = snapshot.val() || initial
        setDatabase({ state: "hydrated", contents })
        localStorage.setItem("database", JSON.stringify(contents))
      })
  }, [authenticated, setDatabase])
}

/* update */
export const addExchange = async (date: string, value: number) =>
  await db.ref(`/exchanges/${date}`).set({ USD: value })

export const addBalance = async (date: string, balance: BalanceItem) =>
  await db.ref(`/balances/${date}`).set(balance)

export const addPrice = async (date: string, price: PriceItem) =>
  await db.ref(`/prices/${date}`).set(price)

export const addTicker = async (ticker: Ticker) =>
  await db.ref(`/tickers/${ticker.tickerKey}`).set(ticker)

export const updateDayData = async (
  date: string,
  { balanceItem, priceItem, exchangeItem }: DayItem
) => {
  const updates = {
    [`/balances/${date}`]: balanceItem,
    [`/prices/${date}`]: priceItem,
    [`/exchanges/${date}`]: exchangeItem,
  }

  await db.ref().update(updates)
}
