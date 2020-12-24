import { Space } from "antd"
import { today } from "../utils/history"
import Page from "../layouts/Page"
import DashboardTable from "./DashboardTable"
import DashboardStatistics from "./DashboardStatistics"

const Dashboard = () => (
  <Page>
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <DashboardStatistics date={today} />
      <DashboardTable date={today} />
    </Space>
  </Page>
)

export default Dashboard
