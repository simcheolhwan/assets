import { Typography } from "antd"
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons"
import { percent } from "../utils/format"

const { Text } = Typography

interface Props {
  format?: (n: number) => string
  color?: boolean
  children: number
}

const Change = ({ format = percent, color, children: amount }: Props) => {
  const up = amount >= 0.0001
  const down = amount <= -0.0001
  const type = up ? "success" : down ? "danger" : undefined

  return !Number.isFinite(amount) ? null : (
    <Text type={color ? type : undefined}>
      {up ? <ArrowUpOutlined /> : down && <ArrowDownOutlined />}
      {format(Math.abs(amount))}
    </Text>
  )
}

export default Change
