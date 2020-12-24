import { ReactNode } from "react"
import { Table, Tag } from "antd"
import { useRecoilValue } from "recoil"
import { formatAmountWith, formatAmount, formatKRW } from "../utils/format"
import { isCurrencyTicker } from "../utils/format"
import { percent } from "../utils/format"
import { dayQuery } from "../database/day"
import { ReactComponent as Won } from "../icons/won.svg"
import { ReactComponent as Dollar } from "../icons/dollar.svg"
import Change from "../components/Change"

const { Column } = Table

const ICON = {
  height: 20,
  fill: "white",
  style: { filter: "grayscale(100%)", opacity: 0.25, verticalAlign: "top" },
}

const signSVG: Record<CurrencyTicker, ReactNode> = {
  KRW: <Won {...ICON} />,
  USD: <Dollar {...ICON} />,
}

const DashboardTable = ({ date }: { date: string }) => {
  const { dataSource } = useRecoilValue(dayQuery(date))

  return (
    <Table
      dataSource={dataSource}
      pagination={false}
      rowKey="balanceKey"
      size="small"
      scroll={{ x: true }}
    >
      <Column<{ ticker: string }>
        dataIndex="icon"
        render={(icon, { ticker }) =>
          isCurrencyTicker(ticker) ? (
            signSVG[ticker]
          ) : icon ? (
            <img src={icon} {...ICON} alt="" />
          ) : null
        }
        align="center"
        fixed="left"
      />
      <Column title="항목" dataIndex="ticker" align="center" fixed="left" />
      <Column
        title="위치"
        dataIndex="wallet"
        render={(wallet) => <Tag>{wallet}</Tag>}
        align="center"
      />

      <Column<Ticker>
        title="가격"
        dataIndex="price"
        render={(price, { currency }) => formatAmountWith(currency)(price)}
        align="center"
      />
      <Column
        title="잔고"
        dataIndex="balance"
        render={formatAmount}
        align="right"
      />
      <Column title="가치" dataIndex="value" render={formatKRW} align="right" />
      <Column
        title="비율"
        dataIndex="ratio"
        render={(value) => percent(value, true)}
        align="center"
      />
      <Column
        title="목표"
        dataIndex="aim"
        render={(value) => percent(value, true)}
        align="center"
      />
      <Column
        title="리밸런싱"
        dataIndex="rebalance"
        render={(amount) => <Change format={formatAmount}>{amount}</Change>}
        align="center"
      />
    </Table>
  )
}

export default DashboardTable
