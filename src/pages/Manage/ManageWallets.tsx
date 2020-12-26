import { Table } from "antd"
import { useRecoilValue } from "recoil"
import { contentsState } from "../../database/database"
import AddWalletModal from "./AddWalletModal"

const { Column } = Table

const ManageWallets = () => {
  const { wallets } = useRecoilValue(contentsState)
  const dataSource = Object.entries(wallets).map(([walletKey, name]) => {
    return { walletKey, name }
  })

  return (
    <>
      <Table
        dataSource={dataSource}
        pagination={false}
        rowKey="walletKey"
        scroll={{ x: true }}
      >
        <Column title="이름" dataIndex="name" align="center" fixed="left" />
        <Column
          title="Key"
          dataIndex="walletKey"
          align="center"
          render={(key) => <code>{key}</code>}
        />
      </Table>

      <div style={{ marginTop: 16 }}>
        <AddWalletModal key="add" />
      </div>
    </>
  )
}

export default ManageWallets
