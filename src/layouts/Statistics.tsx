import { Space } from "antd"
import { useRecoilValue } from "recoil"
import { todayQuery } from "../database/date"
import { dayPnLQuery } from "../database/day"
import PnL from "../components/PnL"

const Statistics = () => {
  const today = useRecoilValue(todayQuery)
  const { pnl, pnlFromDeposit, pnlYTD } = useRecoilValue(dayPnLQuery(today))

  return (
    <Space size="large" wrap>
      <PnL {...pnlYTD} date="올해" />
      <PnL {...pnlFromDeposit} date="마지막 입금 이후" />
      <PnL {...pnl} date="어제보다" />
    </Space>
  )
}

export default Statistics
