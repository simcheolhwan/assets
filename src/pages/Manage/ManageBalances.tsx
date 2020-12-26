import { Table } from "antd"
import { useRecoilValue } from "recoil"
import { contentsState } from "../../database/database"
import { formatAmount } from "../../utils/format"
import { latest } from "../../utils/history"
import AddBalanceModal from "./AddBalanceModal"

const { Column } = Table

const ManageBalances = () => {
  const { balances, tickers, wallets } = useRecoilValue(contentsState)
  const latestBalanceItem = latest(balances)

  const dataSource = Object.values(latestBalanceItem).map((data) => {
    const { tickerKey, walletKey } = data

    return {
      ...data,
      ticker: tickers[tickerKey].name,
      wallet: wallets[walletKey],
    }
  })

  return (
    <>
      <Table
        dataSource={dataSource}
        pagination={false}
        rowKey="balanceKey"
        scroll={{ x: true }}
      >
        <Column title="종목" dataIndex="ticker" align="center" />
        <Column title="지갑" dataIndex="wallet" align="center" />
        <Column
          title="잔고"
          dataIndex="balance"
          render={formatAmount}
          align="center"
        />
        <Column
          title="Key"
          dataIndex="balanceKey"
          align="center"
          render={(key) => <code>{key}</code>}
        />
      </Table>

      <div style={{ marginTop: 16 }}>
        <AddBalanceModal key="add" />
      </div>
    </>
  )
}

export default ManageBalances
