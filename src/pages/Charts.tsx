import { useState } from "react"
import { Checkbox, Radio, Space, Tabs } from "antd"
import Page from "../layouts/Page"
import { Range } from "./chartUtils"
import BalanceChart from "./BalanceChart"
import ValuesChart from "./ValuesChart"
import PricesChart from "./PricesChart"

const { TabPane } = Tabs

const Charts = () => {
  const [range, setRange] = useState<Range>(Range.W)

  const [showBalances, setShowBalances] = useState(true)
  const [showDeposits, setShowDeposits] = useState(true)

  const filter = (
    <>
      <Checkbox
        checked={showBalances}
        onChange={(e) => setShowBalances(e.target.checked)}
      >
        잔고
      </Checkbox>

      <Checkbox
        checked={showDeposits}
        onChange={(e) => setShowDeposits(e.target.checked)}
      >
        입출금
      </Checkbox>
    </>
  )

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
      <Tabs defaultActiveKey="1" tabBarExtraContent={filter}>
        <TabPane tab="자본" key="1">
          <BalanceChart
            range={range}
            showBalances={showBalances}
            showDeposits={showDeposits}
          />
        </TabPane>

        <TabPane tab="종목" key="2">
          <ValuesChart />
          <PricesChart />
        </TabPane>
      </Tabs>
    </Page>
  )
}

export default Charts
