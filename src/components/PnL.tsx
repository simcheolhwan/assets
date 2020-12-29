import { Statistic, Tooltip } from "antd"
import { formatExact, formatKRW } from "../utils/format"
import Change from "./Change"

interface PnLProps {
  date: string
  pnl: number
  change: number
  isChanged: boolean
}

const PnL = ({ date, pnl, change, isChanged }: PnLProps) => (
  <Tooltip title={formatExact(pnl)} placement="bottom">
    <Statistic
      title={`${date}보다`}
      value={isChanged ? formatKRW(pnl) : "변동없음"}
      suffix={isChanged && <Change color>{change}</Change>}
    />
  </Tooltip>
)

export default PnL
