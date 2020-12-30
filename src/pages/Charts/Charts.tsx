import { useState } from "react"
import { useRecoilValue } from "recoil"
import { Checkbox, Select, Tabs } from "antd"
import { CheckboxChangeEvent } from "antd/lib/checkbox"
import { reverse } from "ramda"
import { isAfter, isBefore } from "date-fns"
import { formatM } from "../../utils/format"
import { contentsState } from "../../database/database"
import { todayQuery } from "../../database/date"
import Page from "../../components/Page"
import Statistics from "../../layouts/Statistics"
import BalanceChart from "./BalanceChart"
import ValuesChart from "./ValuesChart"
import PricesChart from "./PricesChart"

const { TabPane } = Tabs
const { Option } = Select

type Tab = "values" | "balances"

const Charts = () => {
  const [tab, setTab] = useState<Tab>("values")
  const handleChange = (tab: string) => setTab(tab as Tab)

  const { value, onChange, list, validate } = useSelectStartDate()
  const balanceFilter = useBalanceFilter()

  const extra = {
    values: (
      <Select value={value} onChange={onChange} style={{ minWidth: 200 }}>
        {list.map((option) => (
          <Option {...option} key={option.value} />
        ))}
      </Select>
    ),
    balances: balanceFilter.list.map((attr) => (
      <Checkbox {...attr} key={attr.children} />
    )),
  }[tab]

  return (
    <Page>
      <Statistics />

      <Tabs activeKey={tab} onChange={handleChange} tabBarExtraContent={extra}>
        <TabPane tab="종목" key="values">
          <div key={value}>
            <ValuesChart validate={validate} />
            <PricesChart validate={validate} />
          </div>
        </TabPane>

        <TabPane tab="자본" key="balances">
          <BalanceChart {...balanceFilter} />
        </TabPane>
      </Tabs>
    </Page>
  )
}

export default Charts

/* hooks */
const useSelectStartDate = () => {
  const { balances, deposits } = useRecoilValue(contentsState)
  const today = useRecoilValue(todayQuery)

  const genesis = Object.keys(balances)[0]
  const list = reverse(
    deposits.filter(({ date }) => {
      const isAfterGenesis =
        date === genesis || isAfter(new Date(date), new Date(genesis))
      return isAfterGenesis && isBefore(new Date(date), new Date(today))
    })
  )

  const [startDate, setStartDate] = useState(list[0].date)

  return {
    value: startDate,
    onChange: setStartDate,
    list: list.map(({ date, title, amount }) => {
      const affix = `(${[title, formatM(amount)].filter(Boolean).join(" ")})`
      return { value: date, children: [date, affix].join(" ") }
    }),
    validate: (date: string) =>
      date === startDate || isAfter(new Date(date), new Date(startDate)),
  }
}

const useBalanceFilter = () => {
  const [showBalances, setShowBalances] = useState(true)
  const [showDeposits, setShowDeposits] = useState(true)

  return {
    showBalances,
    showDeposits,
    list: [
      {
        checked: showBalances,
        onChange: (e: CheckboxChangeEvent) => setShowBalances(e.target.checked),
        children: "잔고",
      },
      {
        checked: showDeposits,
        onChange: (e: CheckboxChangeEvent) => setShowDeposits(e.target.checked),
        children: "입출금",
      },
    ],
  }
}
