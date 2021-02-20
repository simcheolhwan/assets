import { Link } from "react-router-dom"
import { Table } from "antd"
import { useRecoilValue } from "recoil"
import { formatExact } from "../../utils/format"
import { latest } from "../../utils/history"
import { contentsState } from "../../database/database"
import { assetQuery } from "../../database/assets"
import TickerName from "../../components/TickerName"
import SetBalanceModal from "./SetBalanceModal"

const { Column } = Table

const ManageBalances = () => {
  const { balances } = useRecoilValue(contentsState)
  const latestBalanceItem = latest(balances)
  const asset = useRecoilValue(assetQuery)

  const dataSource = Object.entries(latestBalanceItem)
    .map(([balanceKey, balance]) => ({ ...asset(balanceKey), balance }))
    .sort(({ ticker: a }, { ticker: b }) => a.localeCompare(b))

  return (
    <Table
      dataSource={dataSource}
      pagination={false}
      rowKey="balanceKey"
      scroll={{ x: true }}
    >
      <Column
        title="종목"
        dataIndex="tickerKey"
        render={(tickerKey) => (
          <Link to="/balances">
            <TickerName tickerKey={tickerKey} />
          </Link>
        )}
        align="center"
      />
      <Column title="지갑" dataIndex="wallet" align="center" />
      <Column
        title="잔고"
        dataIndex="balance"
        render={formatExact}
        align="center"
      />
      <Column
        dataIndex="balanceKey"
        align="center"
        render={(balanceKey) => <SetBalanceModal balanceKey={balanceKey} />}
      />
    </Table>
  )
}

export default ManageBalances
