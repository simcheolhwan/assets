import { Space, Statistic } from "antd"
import { useRecoilValue } from "recoil"
import { formatKRW } from "../utils/format"
import { dayQuery } from "../database/day"
import PnL from "../components/PnL"

const DashboardStatistics = ({ date }: { date: string }) => {
  const { total, pnl, pnlFromDeposit } = useRecoilValue(dayQuery(date))

  return (
    <Space size="large" wrap>
      <Statistic title="자본" value={formatKRW(total)} />
      <PnL {...pnl} />
      <PnL {...pnlFromDeposit} date="투자금" />
    </Space>
  )
}

export default DashboardStatistics
