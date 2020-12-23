import { useEffect } from "react"
import { atom, selector, useSetRecoilState } from "recoil"
import { notification } from "antd"
import { db } from "../firebase"

const initial = {
  tickers: {},
  wallets: {},
  exchanges: {},
  prices: {},
  balances: {},
  deposits: [],
  depts: {},
}

/* state: database */
export const databaseState = atom<Loadable<Database>>({
  key: "database",
  default: { state: "loading", contents: initial },
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
      setDatabase({ state: "hasValue", contents: snapshot.val() || initial })
    })
  }, [setDatabase])
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

export const updateToday = async (
  date: string,
  { balanceItem, priceItem, exchangeItem }: DayItem
) => {
  const updates = {
    [`/balances/${date}`]: balanceItem,
    [`/prices/${date}`]: priceItem,
    [`/exchanges/${date}`]: exchangeItem,
  }

  await db.ref().update(updates)
  notification.open({
    message: "업데이트 완료",
    description: "최신 잔고와 가격을 데이터베이스에 업데이트했습니다.",
  })
}
