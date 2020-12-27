import { ReactNode } from "react"
import { useRecoilValue } from "recoil"
import { isCurrencyTicker } from "../utils/format"
import { contentsState } from "../database/database"
import { ReactComponent as Won } from "../icons/won.svg"
import { ReactComponent as Dollar } from "../icons/dollar.svg"

const ICON = {
  height: 20,
  fill: "white",
  style: { filter: "grayscale(100%)", opacity: 0.25, verticalAlign: "top" },
}

export const signSVG: Record<CurrencyTicker, ReactNode> = {
  KRW: <Won {...ICON} />,
  USD: <Dollar {...ICON} />,
}

const Icon = ({ tickerKey }: { tickerKey: string }) => {
  const { tickers } = useRecoilValue(contentsState)
  const { icon, name } = tickers[tickerKey]

  return icon ? (
    <img src={icon} {...ICON} alt="" />
  ) : isCurrencyTicker(name) ? (
    <>{signSVG[name]}</>
  ) : null
}

export default Icon
