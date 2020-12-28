import { Space } from "antd"
import { useRecoilValue } from "recoil"
import { latestDateQuery } from "../../database/day"
import Page from "../../components/Page"
import DashboardStatistics from "../../layouts/Statistics"
import DashboardTable from "./DashboardTable"

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
