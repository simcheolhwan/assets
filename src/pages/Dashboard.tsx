import { useRecoilValue } from "recoil"
import { Button, PageHeader, Row, Space, Statistic } from "antd"
import { nth } from "ramda"
import { formatExchange, formatKRW } from "../utils/format"
import { balancesHistoryQuery, todayBalancesQuery } from "../database/today"
import { useUpdateToday } from "../database/today"
import { yesterdayExchangeQuery } from "../database/exchange"
import Change from "../components/Change"
import { useTitle } from "../layouts/routes"
import DashboardTable from "./DashboardTable"

const Dashboard = () => {
  const title = useTitle()
  const { asset, total } = useRecoilValue(todayBalancesQuery)
  const balancesHistory = useRecoilValue(balancesHistoryQuery)
  const exchange = useRecoilValue(yesterdayExchangeQuery)
  const { isChanged, update } = useUpdateToday()

  /* change */
  const { balances } = nth(-2, balancesHistory)!
  const pnl = total - balances.total
  const change = pnl / balances.total

  /* render */
  const button = (
    <Button type="primary" onClick={update} disabled={!isChanged} key="update">
      {isChanged ? "업데이트" : "최신 데이터"}
    </Button>
  )

  return (
    <PageHeader title={title} subTitle={formatKRW(asset)} extra={[button]}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Row>
          <Space size="large">
            <Statistic title="자본" value={formatKRW(total)} />
            <Statistic title="환율" value={formatExchange(exchange)} />
            <Statistic
              title="어제보다"
              value={formatKRW(pnl)}
              suffix={<Change color>{change}</Change>}
            />
          </Space>
        </Row>

        <DashboardTable />
      </Space>
    </PageHeader>
  )
}

export default Dashboard
