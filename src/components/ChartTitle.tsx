import { Space } from "antd"
import { CSSProperties, FC, ReactNode } from "react"

interface Props {
  title?: ReactNode
  extra?: ReactNode
  style?: CSSProperties
}

const ChartTitle: FC<Props> = ({ title, extra, style }) => {
  return (
    <Space
      style={{
        ...style,
        justifyContent: "space-between",
        marginBottom: ".5em",
        width: "100%",
      }}
      wrap
    >
      <h1 style={{ margin: 0 }}>{title}</h1>
      {extra}
    </Space>
  )
}

export default ChartTitle
