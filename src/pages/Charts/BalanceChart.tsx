import { useState } from "react"
import { useRecoilValue } from "recoil"
import { Card, Radio, Tooltip } from "antd"
import { TimeScale } from "chart.js"
import { isAfter, isSameYear, subWeeks } from "date-fns"
import { subMonths, subQuarters, subYears } from "date-fns"

import { formatDate, formatM, formatThousandKRW } from "../../utils/format"
import { depositsHistoryState } from "../../database/deposits"
import { chartHistoryQuery } from "../../database/history"
import { dayStatsQuery } from "../../database/day"
import { todayQuery } from "../../database/date"
import ChartTitle from "../../components/ChartTitle"
import { colors, dataset, Range } from "./chartUtils"
import Chart from "./Chart"

const Unit: Record<Range, TimeScale["unit"]> = {
  [Range.W]: "day",
  [Range.M]: "day",
  [Range.Q]: "month",
  [Range.Y]: "month",
  [Range.YTD]: "quarter",
  [Range.MAX]: "quarter",
}

interface Props {
  showBalances: boolean
  showDeposits: boolean
}

const BalanceChart = ({ showBalances, showDeposits }: Props) => {
  const [range, setRange] = useState<Range>(Range.YTD)

  /* range */
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
  const history = useRecoilValue(chartHistoryQuery)
  const balanceData = history
    .map(({ date, stats }) => ({ t: new Date(date), y: stats.total }))
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
        (!isSameYear(new Date(prevDeposits.date), new Date(date)) &&
          date !== formatDate(startOfYear(new Date(date))))

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
  const getFooter = (date: string) =>
    !showDeposits
      ? ""
      : depositsHistory
          .filter((history) => history.date === date)
          .map(({ title, amount = 0, memo }) =>
            [memo, title, (amount > 0 ? "+" : "") + formatM(amount)]
              .filter(Boolean)
              .join(" ")
          )
          .join(", ")

  const datasets = [
    { dataset: balancesDatasets, valid: showBalances },
    { dataset: depositsDatasets, valid: showDeposits },
  ]
    .filter(({ valid }) => valid)
    .map(({ dataset }) => dataset)

  /* total */
  const today = useRecoilValue(todayQuery)
  const { total } = useRecoilValue(dayStatsQuery(today))

  return (
    <>
      <ChartTitle
        title={
          <Tooltip title={formatThousandKRW(total)} placement="bottom">
            {formatM(total)}
          </Tooltip>
        }
        extra={
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
        }
      />

      <Card>
        <Chart
          datasets={datasets}
          unit={Unit[range]}
          format={formatM}
          getFooter={getFooter}
        />
      </Card>
    </>
  )
}

export default BalanceChart

/* utils */
const startOfYear = (date: Date) => {
  const year = date.getFullYear()
  return new Date(`${year}-01-01`)
}
