import { reverse } from "ramda"
import { ChartDataSets } from "chart.js"
import { formatDate } from "../../utils/format"

export enum Range {
  "W" = "1W",
  "M" = "1M",
  "Q" = "1Q",
  "Y" = "1Y",
  "YTD" = "YTD",
  "MAX" = "MAX",
}

export const colors: Dictionary<string> = {
  red: "#e64c57",
  orange: "#dd794a",
  yellow: "#ffec3d",
  green: "#73d13d",
  aqua: "#47d7e2",
  blue: "#1eb2ff",
  purple: "#9b8ec5",
  gray: "#d9d9d9",
}

export const getDataset = (dataset?: ChartDataSets): ChartDataSets => ({
  fill: false,
  borderCapStyle: "round",
  borderWidth: 3,
  lineTension: 0.05,
  pointRadius: 0,
  pointHoverRadius: 0,
  ...dataset,
})

export const toUpward = (data: ChartPoint[]) => {
  const reversed = reverse(data)
  return reverse(
    reversed.filter(
      ({ t, y }, index) =>
        !index ||
        formatDate(t) === formatDate(startOfYear(new Date())) ||
        reversed.slice(0, index).every((point) => point.y >= y)
    )
  )
}

export const startOfYear = (date: Date) => {
  const year = date.getFullYear()
  return new Date(`${year}-01-01`)
}
