import { useState } from "react"
import { useRecoilValue } from "recoil"
import { Radio, Space, Tabs } from "antd"
import { latestDateQuery } from "../../database/day"
import Page from "../../layouts/Page"
import DashboardStatistics from "../Dashboard/DashboardStatistics"
import { Range } from "./chartUtils"
import BalanceChart from "./BalanceChart"
import ValuesChart from "./ValuesChart"
import PricesChart from "./PricesChart"

const { TabPane } = Tabs

const Charts = () => {
  const date = useRecoilValue(latestDateQuery)
  const [range, setRange] = useState<Range>(Range.W)

  return (
    <Page
      extra={
        <Space wrap>
          <Radio.Group
            options={Object.values(Range).map((value) => ({
              label: value,
              value,
            }))}
            onChange={(e) => setRange(e.target.value)}
            value={range}
            optionType="button"
            buttonStyle="solid"
          />
        </Space>
      }
    >
      <DashboardStatistics date={date} />
      <Tabs defaultActiveKey="1">
        <TabPane tab="종목" key="1">
          <ValuesChart />
          <PricesChart />
        </TabPane>

        <TabPane tab="자본" key="2">
          <BalanceChart range={range} />
        </TabPane>
      </Tabs>
    </Page>
  )
}

export default Charts
