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

export const dataset = {
  fill: false,
  borderCapStyle: "round" as const,
  borderWidth: 3,
  lineTension: 0.05,
  pointRadius: 0,
  pointHoverRadius: 0,
}
