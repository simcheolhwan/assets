import { Table, Typography } from "antd"
import { useRecoilValue } from "recoil"
import { contentsState } from "../../database/database"
import SetWalletModal from "./SetWalletModal"

const { Column } = Table
const { Text } = Typography

const ManageWallets = () => {
  const { wallets } = useRecoilValue(contentsState)
  const dataSource = Object.entries(wallets).map(([walletKey, name]) => {
    return { walletKey, name }
  })

  return (
    <Table
      dataSource={dataSource}
      pagination={false}
      rowKey="walletKey"
      scroll={{ x: true }}
    >
      <Column
        title="이름"
        dataIndex="name"
        render={(name) => <Text strong>{name}</Text>}
        align="center"
        fixed="left"
      />
      <Column
        dataIndex="walletKey"
        align="center"
        render={(walletKey) => <SetWalletModal walletKey={walletKey} />}
      />
    </Table>
  )
}

export default ManageWallets
