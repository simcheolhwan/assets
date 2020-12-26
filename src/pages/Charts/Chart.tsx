import { ChartDataSets, helpers, TimeScale } from "chart.js"
import { Line } from "react-chartjs-2"
import { formatDate } from "../../utils/format"

interface Props {
  datasets: ChartDataSets[]
  legend?: boolean
  unit?: TimeScale["unit"]
  format: (value: number) => string
  formatY?: (value: number) => string
  getAffix?: (date: string) => string
}

const Chart = ({ legend, unit, datasets, ...props }: Props) => {
  const { format, formatY, getAffix = () => "" } = props

  return (
    <Line
      data={{ datasets }}
      height={240}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        legend: { display: legend },
        layout: undefined,
        scales: {
          xAxes: [
            {
              type: "time",
              display: true,
              gridLines: { display: false },
              time: { unit },
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
                callback: (value) =>
                  formatY?.(Number(value)) ?? format(Number(value)),
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
            title: ([{ value }]) => format(Number(value) ?? 0),
            label: ({ label }) => {
              const affix = getAffix(formatDate(label))
              return label ? [formatDate(label), affix].join(" ") : ""
            },
          },
        },
      }}
    />
  )
}

export default Chart
