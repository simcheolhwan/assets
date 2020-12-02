import { selectorFamily } from "recoil"
import axios from "axios"

const config = {
  baseURL: "https://api.polygon.io",
  params: { apiKey: process.env.REACT_APP_POLYGON_API_KEY },
}

/* yesterday's exchange rate */
export const prevExchange = () => {
  const path = "/v2/aggs/ticker/C:USDKRW/prev"
  return axios.get<PolygonResponse>(path, config)
}

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
