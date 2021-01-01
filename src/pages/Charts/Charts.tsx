import { useState } from "react"
import { useRecoilValue } from "recoil"
import { Checkbox, DatePicker, Radio, Space, Tabs } from "antd"
import { CheckboxChangeEvent } from "antd/lib/checkbox"
import { last, uniq } from "ramda"
import { isAfter } from "date-fns"
import moment from "moment"

import { formatDate } from "../../utils/format"
import { chartDaysQuery } from "../../database/history"
import Page from "../../components/Page"
import Statistics from "../../layouts/Statistics"

import { colors } from "./chartUtils"
import BalanceChart from "./BalanceChart"
import ValuesChart from "./ValuesChart"
import PricesChart from "./PricesChart"

const { TabPane } = Tabs

type Tab = "values" | "balances"

const Charts = () => {
  const [tab, setTab] = useState<Tab>("values")
  const handleChange = (tab: string) => setTab(tab as Tab)

  const selectStartDate = useSelectStartDate()
  const balanceFilter = useBalanceFilter()

  const { value, onChange, getStyle } = selectStartDate
  const { startDate, validateDate, validate } = selectStartDate
  const extra = {
    values: (
      <DatePicker
        value={moment(value)}
        onChange={(value) => value && onChange(value.toDate())}
        disabledDate={(moment) => !validateDate(moment.toDate())}
        dateRender={(current) => (
          <div
            className="ant-picker-cell-inner"
            style={getStyle(current.toDate())}
          >
            {current.date()}
          </div>
        )}
        showToday={false}
      />
    ),
    balances: balanceFilter.list.map((attr) => (
      <Checkbox {...attr} key={attr.children} />
    )),
  }[tab]

  /* values chart */
  const [type, setType] = useState<"balance" | "value">("value")
  const [asPercent, setAsPercent] = useState(false)
  const selectType = (
    <Space>
      <Checkbox
        checked={asPercent}
        onChange={(e) => setAsPercent(e.target.checked)}
      >
        %
      </Checkbox>

      <Radio.Group
        value={type}
        onChange={(e) => setType(e.target.value)}
        optionType="button"
        buttonStyle="solid"
      >
        <Radio.Button value="value">가치</Radio.Button>
        <Radio.Button value="balance">잔고</Radio.Button>
      </Radio.Group>
    </Space>
  )

  return (
    <Page>
      <Statistics />

      <Tabs activeKey={tab} onChange={handleChange} tabBarExtraContent={extra}>
        <TabPane tab="종목" key="values">
          <ValuesChart
            validate={validate}
            extra={selectType}
            type={type}
            asPercent={asPercent}
            key={startDate + type}
          />
          <PricesChart validate={validate} key={startDate} />
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
  const chartDays = useRecoilValue(chartDaysQuery)
  const { depositedDays, rebalancedDays } = chartDays
  const days = uniq([...depositedDays, ...rebalancedDays].sort())

  /* calendar */
  const initial = last(days)!
  const [value, setValue] = useState<Date>(new Date(initial))

  /* validate */
  const startDate = formatDate(value)
  const validate = (date: string) =>
    date === startDate || isAfter(new Date(date), value)

  const validateDate = (date: Date) => days.includes(formatDate(date))

  /* render */
  const getStyle = (date: Date) => {
    const isDeposited = depositedDays.includes(formatDate(date))
    const isRebalanced = rebalancedDays.includes(formatDate(date))
    const borderColor = isDeposited
      ? colors.green
      : isRebalanced
      ? colors.orange
      : undefined

    return { border: borderColor && `1px solid ${borderColor}` }
  }

  return {
    startDate,
    value,
    onChange: setValue,
    getStyle,
    validateDate,
    validate,
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
