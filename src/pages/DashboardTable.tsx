import { Table, Tag } from "antd"
import { useRecoilValue } from "recoil"
import { formatAmountWith, formatAmount, formatKRW } from "../utils/format"
import { percent } from "../utils/format"
import { todayDashboardQuery } from "../database/today"
import Change from "../components/Change"

const { Column } = Table

const DashboardTable = () => {
  const { dataSource } = useRecoilValue(todayDashboardQuery)

  return (
    <Table
      dataSource={dataSource}
      pagination={false}
      rowKey="balanceKey"
      size="small"
    >
      <Column
        title="위치"
        dataIndex="wallet"
        render={(wallet) => <Tag>{wallet}</Tag>}
        align="center"
        responsive={["sm"]}
      />
      <Column title="항목" dataIndex="ticker" align="center" />
      <Column<{ currency: CurrencyTicker }>
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
        responsive={["sm"]}
      />
      <Column
        title="가치"
        dataIndex="value"
        render={formatKRW}
        align="right"
        responsive={["sm"]}
      />
      <Column
        title="비율"
        dataIndex="ratio"
        render={(value) => percent(value, true)}
        align="center"
        responsive={["sm"]}
      />
      <Column
        title="목표"
        dataIndex="aim"
        render={(value) => percent(value, true)}
        align="center"
        responsive={["sm"]}
      />
      <Column
        title="리밸런싱"
        dataIndex="rebalance"
        render={(amount) => <Change format={formatAmount}>{amount}</Change>}
        align="center"
        responsive={["sm"]}
      />
    </Table>
  )
}

export default DashboardTable
