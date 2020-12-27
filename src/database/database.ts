import { useEffect } from "react"
import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil"
import { db } from "../firebase"
import { formatDate } from "../utils/format"
import { authState } from "./auth"

const initial = {
  tickers: {},
  wallets: {},
  exchanges: {},
  prices: {},
  balances: {},
  deposits: [],
  depts: {},
  updatedAt: 0,
}

const init = () => {
  const local = localStorage.getItem("database")
  const parsed: Database = JSON.parse(local!)

  return parsed
    ? { state: "hasValue" as const, contents: parsed }
    : { state: "loading" as const, contents: initial }
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
  const setDatabase = useSetRecoilState(databaseState)

  useEffect(() => {
    db.ref().on("value", (snapshot) => {
      const contents = snapshot.val() || initial
      setDatabase({ state: "hydrated", contents })
      localStorage.setItem("database", JSON.stringify(contents))
    })
  }, [setDatabase])
}

/* update */
export const setDeposit = async (deposits: Deposit[]) =>
  await db.ref(`/deposits`).set(deposits)

export const setTicker = async (ticker: Ticker) =>
  await db.ref(`/tickers/${ticker.tickerKey}`).set(ticker)

export const setWallet = async (walletKey: string, name: string) =>
  await db.ref(`/wallets/${walletKey}`).set(name)

export const setBalance = async (balance: Balance) =>
  await db.ref(`/balances/${formatDate()}/${balance.balanceKey}`).set(balance)
