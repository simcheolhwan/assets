import { Space, Statistic } from "antd"
import { useRecoilValue } from "recoil"
import { formatKRW } from "../utils/format"
import { dayWithPnLQuery } from "../database/day"
import { yesterdayQuery } from "../database/date"
import PnL from "../components/PnL"

const Statistics = ({ date }: { date: string }) => {
  const { total, pnl, pnlFromDeposit } = useRecoilValue(dayWithPnLQuery(date))
  const yesterday = useRecoilValue(yesterdayQuery)

  return (
    <Space size="large" wrap>
      <Statistic title="자본" value={formatKRW(total)} />
      <PnL {...pnl} date={pnl.date === yesterday ? "어제" : pnl.date} />
      <PnL {...pnlFromDeposit} date="마지막 입금" />
    </Space>
  )
}

export default Statistics
