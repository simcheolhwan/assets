import { Table } from "antd"
import { useRecoilValue } from "recoil"
import { formatAmount } from "../../utils/format"
import { latest } from "../../utils/history"
import { contentsState } from "../../database/database"
import TickerName from "../../components/TickerName"
import SetBalanceModal from "./SetBalanceModal"

const { Column } = Table

const ManageBalances = () => {
  const { balances, tickers, wallets } = useRecoilValue(contentsState)
  const latestBalanceItem = latest(balances)

  const dataSource = Object.values(latestBalanceItem)
    .map((data) => {
      const { tickerKey, walletKey } = data

      return {
        ...data,
        ticker: tickers[tickerKey].name,
        wallet: wallets[walletKey],
      }
    })
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
        render={(tickerKey) => <TickerName tickerKey={tickerKey} />}
        align="center"
      />
      <Column title="지갑" dataIndex="wallet" align="center" />
      <Column
        title="잔고"
        dataIndex="balance"
        render={formatAmount}
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
