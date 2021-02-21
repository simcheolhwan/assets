import { ReactNode } from "react"
import { useRecoilValue } from "recoil"
import { isCurrencyTicker } from "../utils/format"
import { contentsState } from "../database/database"
import { ReactComponent as Won } from "../icons/won.svg"
import { ReactComponent as Dollar } from "../icons/dollar.svg"
import { ReactComponent as MIR } from "../icons/MIR.svg"
import { ReactComponent as BTC } from "../icons/btc.svg"
import { ReactComponent as Ethereum } from "../icons/ethereum.svg"

const ICON = {
  height: 20,
  fill: "white",
  style: { filter: "grayscale(100%)", opacity: 0.25, verticalAlign: "top" },
}

export const signSVG: Record<CurrencyTicker, ReactNode> = {
  KRW: <Won {...ICON} />,
  USD: <Dollar {...ICON} />,
}

const SVG: Dictionary<ReactNode> = {
  MIR: <MIR {...ICON} />,
  BTC: <BTC {...ICON} />,
  Ethereum: <Ethereum {...ICON} />,
}

const Icon = ({ tickerKey }: { tickerKey: string }) => {
  const { tickers } = useRecoilValue(contentsState)
  const { icon, name } = tickers[tickerKey]

  return isCurrencyTicker(name) ? (
    <>{signSVG[name]}</>
  ) : icon?.endsWith(".png") ? (
    <img src={icon} {...ICON} alt="" />
  ) : icon ? (
    <>{SVG[icon]}</>
  ) : null
}

export default Icon
