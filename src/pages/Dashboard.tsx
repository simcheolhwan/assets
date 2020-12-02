import { useRecoilValue } from "recoil"
import { Button, PageHeader, Row, Space, Statistic } from "antd"
import { formatKRW } from "../utils/format"
import { todayDashboardQuery, useUpdateToday } from "../database/today"
import { yesterdayExchangeQuery } from "../database/exchange"
import { useTitle } from "../layouts/routes"
import DashboardTable from "./DashboardTable"

const Dashboard = () => {
  const title = useTitle()
  const { asset, total } = useRecoilValue(todayDashboardQuery)
  const exchange = useRecoilValue(yesterdayExchangeQuery)
  const { isChanged, update } = useUpdateToday()

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
            <Statistic title="환율" value={formatKRW(exchange)} />
          </Space>
        </Row>

        <DashboardTable />
      </Space>
    </PageHeader>
  )
}

export default Dashboard
