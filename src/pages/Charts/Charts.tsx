import { useState } from "react"
import { useRecoilValue } from "recoil"
import { Radio, Tabs } from "antd"
import { latestDateQuery } from "../../database/day"
import Page from "../../components/Page"
import DashboardStatistics from "../../layouts/Statistics"
import { Range } from "./chartUtils"
import BalanceChart from "./BalanceChart"
import ValuesChart from "./ValuesChart"
import PricesChart from "./PricesChart"

const { TabPane } = Tabs

const Charts = () => {
  const date = useRecoilValue(latestDateQuery)
  const [range, setRange] = useState<Range>(Range.W)

  const filter = (
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
  )

  return (
    <Page>
      <DashboardStatistics date={date} />

      <Tabs defaultActiveKey="1">
        <TabPane tab="종목" key="1">
          <ValuesChart extra={filter} />
          <PricesChart />
        </TabPane>

        <TabPane tab="자본" key="2">
          <BalanceChart range={range} extra={filter} />
        </TabPane>
      </Tabs>
    </Page>
  )
}

export default Charts
