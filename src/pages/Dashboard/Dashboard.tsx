import { Space } from "antd"
import Page from "../../components/Page"
import Statistics from "../../layouts/Statistics"
import DashboardTable from "./DashboardTable"
import Branch from "../Branch/Branch"

const Dashboard = () => {
  return (
    <Page>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Statistics />
        <DashboardTable />
        <Branch />
      </Space>
    </Page>
  )
}

export default Dashboard
