import { Table, Tag } from "antd"
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons"
import { useRecoilValue } from "recoil"
import { formatAmountWith, formatAmount, formatKRW } from "../utils/format"
import { percent } from "../utils/format"
import { todayDashboardQuery } from "../database/today"

const { Column } = Table

const DashboardTable = () => {
  const { dataSource } = useRecoilValue(todayDashboardQuery)

  return (
    <Table dataSource={dataSource} pagination={false} rowKey="balanceKey">
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
        render={percent}
        align="center"
        responsive={["sm"]}
      />
      <Column
        title="목표 비율"
        dataIndex="aim"
        render={percent}
        align="center"
        responsive={["sm"]}
      />
    </Table>
  )
}

export default DashboardTable
