import { selector, selectorFamily } from "recoil"
import axios from "axios"

const config = {
  baseURL: "https://api.polygon.io",
  params: { apiKey: process.env.REACT_APP_POLYGON_API_KEY },
}

/* previous exchange rate */
export const prevExchangeQuery = selector({
  key: "prevExchange",
  get: async () => {
    try {
      const path = "/v2/aggs/ticker/C:USDKRW/prev"
      const { data } = await axios.get<PolygonResponse>(path, config)
      const [{ c }] = data.results
      return c
    } catch {
      return 0
    }
  },
})

/* stock price */
export const stockPriceQuery = selectorFamily({
  key: "stockPrice",
  get: (ticker: string) => async () => {
    try {
      const path = `/v2/aggs/ticker/${ticker}/prev`
      const { data } = await axios.get<PolygonResponse>(path, config)
      const [{ c }] = data.results
      return c
    } catch {
      return 0
    }
  },
})
