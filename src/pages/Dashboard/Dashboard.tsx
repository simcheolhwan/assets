import { Space } from "antd"
import Page from "../../components/Page"
import Statistics from "../../layouts/Statistics"
import DashboardTable from "./DashboardTable"

const Dashboard = () => {
  return (
    <Page>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Statistics />
        <DashboardTable />
      </Space>
    </Page>
  )
}

export default Dashboard
