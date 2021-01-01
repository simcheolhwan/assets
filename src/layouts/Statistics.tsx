import { Space } from "antd"
import { useRecoilValue } from "recoil"
import { todayQuery } from "../database/date"
import { dayPnLQuery } from "../database/day"
import PnL from "../components/PnL"

const Statistics = () => {
  const today = useRecoilValue(todayQuery)
  const { pnl, pnlFromDeposit } = useRecoilValue(dayPnLQuery(today))

  return (
    <Space size="large" wrap>
      <PnL {...pnlFromDeposit} date="마지막 입금" />
      <PnL {...pnl} date="어제" />
    </Space>
  )
}

export default Statistics
