import { useState } from "react"
import { useRecoilValue } from "recoil"
import { Radio, Checkbox, Card, Space } from "antd"
import { head, prepend } from "ramda"
import { isBefore, startOfYear, subWeeks } from "date-fns"
import { subMonths, subQuarters, subYears } from "date-fns"

import { formatM, formatDate } from "../utils/format"
import { depositsHistoryState } from "../database/database"
import { historyQuery } from "../database/chart"
import Page from "../layouts/Page"
import { colors, dataset } from "./chartUtils"
import Chart from "./Chart"
import DetailChart from "./DetailChart"

enum Range {
  "W" = "1W",
  "M" = "1M",
  "Q" = "1Q",
  "Y" = "1Y",
  "YTD" = "YTD",
  "MAX" = "MAX",
}

const Charts = () => {
  /* state */
  const [showBalances, setShowBalances] = useState(true)
  const [showDeposits, setShowDeposits] = useState(true)
  const [range, setRange] = useState<Range>(Range.MAX)
  const filter = ({ t }: { t: Date }) =>
    ({
      [Range.W]: isBefore(subWeeks(new Date(), 1), t),
      [Range.M]: isBefore(subMonths(new Date(), 1), t),
      [Range.Q]: isBefore(subQuarters(new Date(), 1), t),
      [Range.Y]: isBefore(subYears(new Date(), 1), t),
      [Range.YTD]: isBefore(startOfYear(new Date()), t),
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
  const initial = {
    date: formatDate(startOfYear(new Date(head(depositsHistory)!.date))),
    balance: 0,
  }

  const depositsData = prepend(initial, depositsHistory)
    .map(({ date, balance }) => ({ t: new Date(date), y: balance }))
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
        <Chart datasets={datasets} getAffix={getAffix} />
      </Card>

      <DetailChart />
    </Page>
  )
}

export default Charts
