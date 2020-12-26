import { atom, selector, selectorFamily } from "recoil"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { equals, last } from "ramda"
import { message, notification } from "antd"
import { v4 } from "uuid"
import { isBefore } from "date-fns"

import { formatDate } from "../utils/format"
import { latest, today } from "../utils/history"

import { updateDayData, contentsState } from "./database"
import { queryLunaPrice, queryUSTBalance } from "./terra"
import { queryLpBalance, querySymbolPrice } from "./mirror"
import { queryExchange, queryStockPrice } from "./polygon"

export const dataIndexState = atom({ key: "dataIndex", default: v4() })

export const todayItemQuery = selector({
  key: "todayItem",
  get: async ({ get }) => {
    get(dataIndexState)
    const { balances, prices, exchanges, ...contents } = get(contentsState)
    const { tickers, wallets, updatedAt } = contents
    const prevBalances = latest(balances)
    const prevPrices = latest(prices)
    const prevExchanges = latest(exchanges)

    /* Query data */
    const exchange = await queryExchange()
    const ustBalance = await queryUSTBalance()
    const lpBalanceMIR = await queryLpBalance("MIR")
    const lpBalancemQQQ = await queryLpBalance("mQQQ")
    const stockPriceTQQQ = await queryStockPrice("TQQQ")
    const stockPriceQQQ = await queryStockPrice("QQQ")
    const lunaPrice = await queryLunaPrice()
    const MIRPrice = await querySymbolPrice("MIR")

    /* Get key */
    const findTickerKey = (ticker: string) =>
      Object.values(tickers).find(({ name }) => name === ticker)?.tickerKey ??
      ""

    const findWalletKey = (wallet: string) =>
      Object.keys(wallets).find((key) => wallets[key] === wallet) ?? ""

    const findBalanceKey = (ticker: string, wallet: string) => {
      const match = (balance: Balance) =>
        balance.tickerKey === tickerKey && balance.walletKey === walletKey

      const tickerKey = findTickerKey(ticker)
      const walletKey = findWalletKey(wallet)

      return Object.values(prevBalances).find(match)?.balanceKey ?? ""
    }

    const balanceDict = {
      [findBalanceKey("UST", "스테이션")]: ustBalance,
      [findBalanceKey("MIR-UST LP", "미러")]: lpBalanceMIR,
      [findBalanceKey("mQQQ-UST LP", "미러")]: lpBalancemQQQ,
    }

    const priceDict = {
      [findTickerKey("QQQ")]: stockPriceQQQ,
      [findTickerKey("TQQQ")]: stockPriceTQQQ,
      [findTickerKey("LUNA")]: lunaPrice,
      [findTickerKey("MIR")]: MIRPrice,
    }

    const balanceItem = merge(prevBalances, balanceDict, "balance")
    const priceItem = merge(prevPrices, priceDict, "price")
    const exchangeItem = { USD: exchange || prevExchanges.USD }
    const updates = { balanceItem, priceItem, exchangeItem }

    const now = Date.now()
    const isTodayExists =
      [balances, prices, exchanges].every(
        (group) => last(Object.keys(group).sort()) === today
      ) && isBefore(new Date(updatedAt), new Date(now))

    if (!isTodayExists) {
      await updateDayData(formatDate(), updates, now)
      message.success("오늘의 데이터를 처음으로 기록했습니다.")
    }

    return updates
  },
})

export const dayItemQuery = selectorFamily({
  key: "dayItem",
  get: (date: string) => ({ get }) => {
    const { balances, prices, exchanges } = get(contentsState)
    return {
      balanceItem: balances[date],
      priceItem: prices[date],
      exchangeItem: exchanges[date],
    }
  },
})

export const updateTodayQuery = selector({
  key: "updateToday",
  get: ({ get }) => {
    const contents = get(contentsState)
    const { balances, prices, exchanges, tickers, updatedAt } = contents
    const prevTodayItem = get(dayItemQuery(today))
    const todayItem = get(todayItemQuery)

    const now = Date.now()
    const isChanged =
      !equals(todayItem, prevTodayItem) &&
      isBefore(new Date(updatedAt), new Date(now))

    const diffItem: Partial<DayItem> = diff(todayItem, prevTodayItem)
    const { priceItem, balanceItem, exchangeItem } = diffItem

    const balanceDiff = !balanceItem
      ? []
      : Object.entries(balanceItem).map(([balanceKey, { balance }]) => {
          const { tickerKey } = latest(balances)[balanceKey]
          const { name } = tickers[tickerKey]
          return {
            name,
            newValue: balance,
            oldValue: latest(balances)[balanceKey].balance,
          }
        })

    const priceDiff = !priceItem
      ? []
      : Object.entries(priceItem).map(([tickerKey, { price }]) => {
          const { name } = tickers[tickerKey]
          return {
            name,
            newValue: price,
            oldValue: latest(prices)[tickerKey].price,
          }
        })

    const exchangeDiff = !exchangeItem
      ? []
      : Object.entries(exchangeItem).map(([currency, exchange]) => {
          return {
            name: currency,
            newValue: exchange,
            oldValue: latest(exchanges)[currency as "USD"],
          }
        })

    const differences = [...balanceDiff, ...priceDiff, ...exchangeDiff]

    type Diff = { name: string; oldValue: number; newValue: number }
    const getMessage = ({ name, oldValue, newValue }: Diff) =>
      `${name}: ${oldValue} → ${newValue}`

    const update = async () => {
      if (isChanged) {
        await updateDayData(today, todayItem, now)
        notification.open({
          message: "업데이트 완료",
          description: differences.map(getMessage).join("\n"),
          placement: "bottomRight",
          style: { whiteSpace: "pre-line" },
          duration: 15,
        })
      }
    }

    return { isChanged, update }
  },
})

export const useUpdateToday = () => {
  const setDataIndex = useSetRecoilState(dataIndexState)
  const updateToday = useRecoilValue(updateTodayQuery)
  const refresh = () => setDataIndex(v4())

  return { ...updateToday, refresh }
}

/* utils */
const merge = <T>(source: T, dict: Dictionary<number>, replaceKey: string) =>
  Object.entries(source).reduce((acc, [key, value]) => {
    const next = dict[key] ? { ...value, [replaceKey]: dict[key] } : value
    return { ...acc, [key]: next }
  }, {} as T)

const diff = (a: any, b: any): any =>
  Object.entries(a).reduce((acc, [key, value]) => {
    const skip = value === b[key] || equals(value, b[key])

    return Object.assign(
      {},
      acc,
      !skip && {
        [key]: typeof value === "object" ? diff(value, b[key]) : value,
      }
    )
  }, {})
