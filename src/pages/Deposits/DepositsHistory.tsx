import { Table, Tooltip, Typography } from "antd"
import { useRecoilValue } from "recoil"
import { formatM, formatDateWith, formatDate } from "../../utils/format"
import { depositsHistoryState } from "../../database/database"
import Page from "../../layouts/Page"
import AddDepositModal from "../Manage/AddDepositModal"

const { Column } = Table
const { Text } = Typography

const DepositsHistory = () => {
  const dataSource = useRecoilValue(depositsHistoryState)

  return (
    <Page extra>
      <Table
        dataSource={dataSource}
        pagination={false}
        rowKey={({ date, title }) => [date, title].join()}
      >
        <Column
          title="날짜"
          dataIndex="date"
          render={(date) => (
            <Tooltip title={formatDate(date)} placement="bottom">
              {formatDateWith("yyyy")(date)}
            </Tooltip>
          )}
          align="center"
        />
        <Column title="항목" dataIndex="title" align="center" />
        <Column
          title="내역"
          dataIndex="amount"
          render={(amount) => (
            <Text type={amount < 0 ? "danger" : undefined}>
              {amount > 0 && "+"}
              {formatM(amount)}
            </Text>
          )}
          align="right"
        />
        <Column
          title="누적"
          dataIndex="balance"
          render={formatM}
          align="right"
        />
      </Table>

      <div style={{ marginTop: 16 }}>
        <AddDepositModal />
      </div>
    </Page>
  )
}

export default DepositsHistory
