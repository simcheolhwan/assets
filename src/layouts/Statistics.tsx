import { Space } from "antd"
import { useRecoilValue } from "recoil"
import { dayWithPnLQuery } from "../database/day"
import PnL from "../components/PnL"

const Statistics = () => {
  const { pnl, pnlFromDeposit } = useRecoilValue(dayWithPnLQuery)

  return (
    <Space size="large" wrap>
      <PnL {...pnlFromDeposit} date="마지막 입금" />
      <PnL {...pnl} date="어제" />
    </Space>
  )
}

export default Statistics
