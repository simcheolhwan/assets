import { useRecoilValue } from "recoil"
import { contentsState } from "../database/database"
import { Typography } from "antd"
import { colors } from "../pages/Charts/chartUtils"

const { Text } = Typography

const TickerName = ({ tickerKey }: { tickerKey: string }) => {
  const { tickers } = useRecoilValue(contentsState)
  const { color, name } = tickers[tickerKey]

  return (
    <Text style={{ color: color && colors[color] }} strong>
      {name}
    </Text>
  )
}

export default TickerName
