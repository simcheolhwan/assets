import { Statistic } from "antd"
import { formatKRW } from "../utils/format"
import Change from "./Change"

interface PnLProps {
  date: string
  pnl: number
  change: number
  isChanged: boolean
}

const PnL = ({ date, pnl, change, isChanged }: PnLProps) => (
  <Statistic
    title={`${date}보다`}
    value={isChanged ? formatKRW(pnl) : "변동없음"}
    suffix={isChanged && <Change color>{change}</Change>}
  />
)

export default PnL
