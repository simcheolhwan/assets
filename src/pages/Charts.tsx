import { useState } from "react"
import { useRecoilValue } from "recoil"
import { Radio, Checkbox, Card, Space } from "antd"
import { TimeScale } from "chart.js"
import { isAfter, isSameYear, startOfYear, subWeeks } from "date-fns"
import { subMonths, subQuarters, subYears } from "date-fns"

import { formatM } from "../utils/format"
import { depositsHistoryState } from "../database/database"
import { historyQuery } from "../database/chart"
import Page from "../layouts/Page"
import { colors, dataset } from "./chartUtils"
import Chart from "./Chart"
import ValuesChart from "./ValuesChart"
import PricesChart from "./PricesChart"

enum Range {
  "W" = "1W",
  "M" = "1M",
  "Q" = "1Q",
  "Y" = "1Y",
  "YTD" = "YTD",
  "MAX" = "MAX",
}

const Unit: Record<Range, TimeScale["unit"]> = {
  [Range.W]: "day",
  [Range.M]: "day",
  [Range.Q]: "month",
  [Range.Y]: "month",
  [Range.YTD]: "quarter",
  [Range.MAX]: "quarter",
}

const Charts = () => {
  /* state */
  const [showBalances, setShowBalances] = useState(true)
  const [showDeposits, setShowDeposits] = useState(true)
  const [range, setRange] = useState<Range>(Range.MAX)
  const filter = ({ t }: ChartPoint) =>
    ({
      [Range.W]: isAfter(t, subWeeks(new Date(), 1)),
      [Range.M]: isAfter(t, subMonths(new Date(), 1)),
      [Range.Q]: isAfter(t, subQuarters(new Date(), 1)),
      [Range.Y]: isAfter(t, subYears(new Date(), 1)),
      [Range.YTD]: isSameYear(t, new Date()),
      [Range.MAX]: true,
    }[range])

  /* data: balances */
  const history = useRecoilValue(historyQuery)
  const balanceData = history
    .map(({ date, total }) => ({ t: new Date(date), y: total }))
    .filter(filter)

  const balancesDatasets = {
    ...dataset,
    borderColor: colors.blue,
    label: "자본",
    data: balanceData,
  }

  /* data: deposits */
  const depositsHistory = useRecoilValue(depositsHistoryState)
  const depositsData = depositsHistory
    .reduce<ChartPoint[]>((acc, { date, balance }, index) => {
      const prevDeposits = depositsHistory[index - 1]
      const point = { t: new Date(date), y: balance }

      // Prepend the start of the year
      const shouldPrepend =
        !prevDeposits ||
        !isSameYear(new Date(prevDeposits.date), new Date(date))

      const prepend = {
        t: startOfYear(new Date(date)),
        y: !prevDeposits ? 0 : prevDeposits.balance,
      }

      return shouldPrepend ? [...acc, prepend, point] : [...acc, point]
    }, [])
    .filter(filter)

  const depositsDatasets = {
    ...dataset,
    borderColor: colors.aqua,
    label: "입출금",
    data: depositsData,
  }

  /* render */
  const getAffix = (date: string) =>
    !showDeposits
      ? ""
      : depositsHistory
          .filter((history) => history.date === date)
          .map(({ title, amount }) => [title, formatM(amount)].join(" "))
          .join(", ")

  const datasets = [
    { dataset: balancesDatasets, valid: showBalances },
    { dataset: depositsDatasets, valid: showDeposits },
  ]
    .filter(({ valid }) => valid)
    .map(({ dataset }) => dataset)

  return (
    <Page
      extra={
        <Space wrap>
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
      <Card>
        <Chart datasets={datasets} unit={Unit[range]} getAffix={getAffix} />
      </Card>

      <ValuesChart />
      <PricesChart />
    </Page>
  )
}

export default Charts
