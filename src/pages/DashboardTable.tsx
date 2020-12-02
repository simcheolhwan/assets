import { Table, Tag } from "antd"
import { useRecoilValue } from "recoil"
import { formatAmountWith, formatAmount, formatKRW } from "../utils/format"
import { percent } from "../utils/format"
import { todayDashboardQuery } from "../database/today"

const { Column } = Table

const DashboardTable = () => {
  const { dataSource, asset } = useRecoilValue(todayDashboardQuery)

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
        dataIndex="value"
        render={(value) => percent(value / asset)}
        align="right"
        responsive={["sm"]}
      />
    </Table>
  )
}

export default DashboardTable
