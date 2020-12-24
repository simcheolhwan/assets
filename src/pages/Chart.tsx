import { useState } from "react"
import { useRecoilValue } from "recoil"
import { Radio, Checkbox, Card, Space } from "antd"
import { helpers } from "chart.js"
import { head, prepend } from "ramda"
import { Line } from "react-chartjs-2"
import { isBefore, startOfYear, subWeeks } from "date-fns"
import { subMonths, subQuarters, subYears } from "date-fns"

import { formatM, formatDate, formatKRW } from "../utils/format"
import { depositsHistoryState } from "../database/database"
import { historyQuery } from "../database/day"
import Page from "../layouts/Page"

enum Range {
  "W" = "1W",
  "M" = "1M",
  "Q" = "1Q",
  "Y" = "1Y",
  "YTD" = "YTD",
  "MAX" = "MAX",
}

const Chart = () => {
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

  /* data: common */
  const dataset = {
    fill: false,
    borderCapStyle: "round" as const,
    borderWidth: 3,
    lineTension: 0.2,
    pointRadius: 0,
    pointHoverRadius: 0,
  }

  /* data: balances */
  const history = useRecoilValue(historyQuery)
  const balanceData = history
    .map(({ date, total }) => ({ t: new Date(date), y: total }))
    .filter(filter)

  const balancesDatasets = {
    ...dataset,
    borderColor: "#1eb2ff",
    label: "datasets2",
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
    borderColor: "#47d7e2",
    label: "datasets1",
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
        <Line
          height={240}
          data={{ datasets }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            legend: { display: false },
            layout: undefined,
            scales: {
              xAxes: [
                {
                  type: "time",
                  display: true,
                  gridLines: { display: false },
                  time: { unit: "quarter" },
                  ticks: { source: "auto", autoSkip: true },
                },
              ],
              yAxes: [
                {
                  display: true,
                  position: "right",
                  gridLines: {
                    drawBorder: false,
                    color: helpers.color("#505466").alpha(0.2).rgbString(),
                    zeroLineColor: "#505466",
                  },
                  ticks: {
                    stepSize: 100 * 1e6,
                    padding: 20,
                    callback: formatM,
                  },
                },
              ],
            },
            tooltips: {
              intersect: false,
              displayColors: false,
              backgroundColor: "white",
              cornerRadius: 5,
              titleFontColor: "#172240",
              titleFontSize: 16,
              titleFontStyle: "600",
              bodyFontColor: "#172240",
              bodyFontSize: 12,
              xPadding: 10,
              yPadding: 8,
              callbacks: {
                title: ([{ value }]) => (value ? formatKRW(Number(value)) : ""),
                label: ({ label }) => {
                  const affix = getAffix(formatDate(label))
                  return label ? [formatDate(label), affix].join(" ") : ""
                },
              },
            },
          }}
        />
      </Card>
    </Page>
  )
}

export default Chart
