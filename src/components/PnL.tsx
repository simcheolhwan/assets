import { Statistic, Tooltip } from "antd"
import { formatThousandKRW, formatKorean } from "../utils/format"
import Change from "./Change"

interface PnLProps {
  date: string
  pnl: number
  change: number
  isChanged: boolean
}

const PnL = ({ date, pnl, change, isChanged }: PnLProps) => {
  const value = formatKorean(pnl)

  return (
    <Tooltip title={formatThousandKRW(pnl)} placement="bottom">
      <Statistic
        title={date}
        value={!isChanged ? "변동없음" : value}
        suffix={isChanged && <Change color>{change}</Change>}
      />
    </Tooltip>
  )
}

export default PnL
