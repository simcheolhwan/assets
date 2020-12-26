import { CSSProperties, FC, ReactNode } from "react"

interface Props {
  title?: string
  extra?: ReactNode
  style?: CSSProperties
}

const ChartTitle: FC<Props> = ({ title, extra, style }) => {
  return (
    <div
      style={{
        ...style,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: ".5em",
      }}
    >
      <h1 style={{ margin: 0 }}>{title}</h1>
      {extra}
    </div>
  )
}

export default ChartTitle
