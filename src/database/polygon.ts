import axios from "axios"

const config = {
  baseURL: "https://api.polygon.io",
  params: { apiKey: process.env.REACT_APP_POLYGON_API_KEY },
}

export const queryExchange = async () => {
  try {
    const path = "/v2/aggs/ticker/C:USDKRW/prev"
    const { data } = await axios.get<PolygonResponse>(path, config)
    const [{ c }] = data.results
    return c
  } catch {
    return 0
  }
}

export const queryStockPrice = async (ticker: string) => {
  try {
    const path = `/v2/aggs/ticker/${ticker}/prev`
    const { data } = await axios.get<PolygonResponse>(path, config)
    const [{ c }] = data.results
    return c
  } catch {
    return 0
  }
}
