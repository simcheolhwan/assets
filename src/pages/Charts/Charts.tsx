import { useRecoilValue } from "recoil"
import { Tabs } from "antd"
import { latestDateQuery } from "../../database/day"
import Page from "../../components/Page"
import Statistics from "../../layouts/Statistics"
import BalanceChart from "./BalanceChart"
import ValuesChart from "./ValuesChart"
import PricesChart from "./PricesChart"

const { TabPane } = Tabs

const Charts = () => {
  const date = useRecoilValue(latestDateQuery)

  return (
    <Page>
      <Statistics date={date} />

      <Tabs defaultActiveKey="1">
        <TabPane tab="종목" key="1">
          <ValuesChart />
          <PricesChart />
        </TabPane>

        <TabPane tab="자본" key="2">
          <BalanceChart />
        </TabPane>
      </Tabs>
    </Page>
  )
}

export default Charts
