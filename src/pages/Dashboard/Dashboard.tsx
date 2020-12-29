import { Space } from "antd"
import { useRecoilValue } from "recoil"
import { latestDateQuery } from "../../database/date"
import Page from "../../components/Page"
import Statistics from "../../layouts/Statistics"
import DashboardTable from "./DashboardTable"

const Dashboard = () => {
  const date = useRecoilValue(latestDateQuery)

  return (
    <Page>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Statistics date={date} />
        <DashboardTable date={date} />
      </Space>
    </Page>
  )
}

export default Dashboard
