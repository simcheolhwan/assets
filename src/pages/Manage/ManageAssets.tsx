import { Link } from "react-router-dom"
import { Table } from "antd"
import { useRecoilValue } from "recoil"
import { contentsState } from "../../database/database"
import { assetQuery } from "../../database/assets"
import TickerName from "../../components/TickerName"
import SetAssetModal from "./SetAssetModal"

const { Column } = Table

const ManageAssets = () => {
  const { assets } = useRecoilValue(contentsState)
  const asset = useRecoilValue(assetQuery)

  const dataSource = Object.keys(assets)
    .map((balanceKey) => asset(balanceKey))
    .filter(({ hidden }) => !hidden)
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
        dataIndex="balanceKey"
        align="center"
        render={(balanceKey) => <SetAssetModal balanceKey={balanceKey} />}
      />
    </Table>
  )
}

export default ManageAssets
