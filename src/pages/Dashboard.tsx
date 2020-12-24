import { Space } from "antd"
import { useRecoilValue } from "recoil"
import { latestDateQuery } from "../database/day"
import Page from "../layouts/Page"
import DashboardTable from "./DashboardTable"
import DashboardStatistics from "./DashboardStatistics"

const Dashboard = () => {
  const date = useRecoilValue(latestDateQuery)

  return (
    <Page>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <DashboardStatistics date={date} />
        <DashboardTable date={date} />
      </Space>
    </Page>
  )
}

export default Dashboard
