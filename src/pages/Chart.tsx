import { useState } from "react"
import { useRecoilValue } from "recoil"
import { Radio, Checkbox, PageHeader, Card } from "antd"
import { helpers } from "chart.js"
import { head, prepend } from "ramda"
import { Line } from "react-chartjs-2"
import { isBefore, startOfYear } from "date-fns"
import { subMonths, subQuarters, subYears } from "date-fns"

import { formatM, formatDate, formatKRW } from "../utils/format"
import { depositsHistoryState } from "../database/database"
import { balancesHistoryQuery } from "../database/today"
import { useTitle } from "../layouts/routes"

enum Range {
  "M" = "1M",
  "Q" = "1Q",
  "Y" = "1Y",
  "YTD" = "YTD",
  "MAX" = "MAX",
}

const Chart = () => {
  const title = useTitle()

  /* state */
  const [showDeposits, setShowDeposits] = useState(true)
  const [range, setRange] = useState<Range>(Range.MAX)
  const filter = ({ t }: { t: Date }) =>
    ({
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
  const balancesHistory = useRecoilValue(balancesHistoryQuery)
  const balanceData = balancesHistory
    .map(({ date, balances }) => ({ t: new Date(date), y: balances.total }))
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
    amount: 0,
    balance: 0,
    title: "시작",
  }

  const depositsData = prepend(initial, depositsHistory)
    .map(({ date, balance, ...rest }) => {
      return { t: new Date(date), y: balance, ...rest }
    })
    .filter(filter)

  const depositsDatasets = {
    ...dataset,
    borderColor: "#47d7e2",
    label: "datasets1",
    data: depositsData,
  }

  /* render */
  const getAffix = (datasetIndex: number, index: number) => {
    const { title, amount } = depositsData[index]
    const valid = showDeposits && datasetIndex === 1
    return valid ? `${title} ${amount ? formatM(amount) : ""}` : ""
  }

  const datasets = showDeposits
    ? [balancesDatasets, depositsDatasets]
    : [balancesDatasets]

  return (
    <PageHeader
      title={title}
      extra={[
        <Checkbox
          checked={showDeposits}
          onChange={(e) => setShowDeposits(e.target.checked)}
          key="checkbox"
        >
          입출금
        </Checkbox>,
        <Radio.Group
          options={Object.values(Range).map((value) => ({
            label: value,
            value,
          }))}
          onChange={(e) => setRange(e.target.value)}
          value={range}
          optionType="button"
          buttonStyle="solid"
          key="radio"
        />,
      ]}
    >
      <Card style={{ padding: 32 }}>
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
                label: ({ label, datasetIndex, index }) => {
                  const affix = getAffix(datasetIndex!, index!)
                  return label ? [formatDate(label), affix].join(" ") : ""
                },
              },
            },
          }}
        />
      </Card>
    </PageHeader>
  )
}

export default Chart
