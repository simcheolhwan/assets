import { Table, Typography } from "antd"
import { useRecoilValue } from "recoil"
import { formatM, formatDateWith } from "../utils/format"
import { depositsHistoryState } from "../database/database"
import Page from "../layouts/Page"

const { Column } = Table
const { Text } = Typography

const DepositsHistory = () => {
  const dataSource = useRecoilValue(depositsHistoryState)

  return (
    <Page>
      <Table
        dataSource={dataSource}
        pagination={false}
        rowKey={({ date, title }) => [date, title].join()}
      >
        <Column
          title="날짜"
          dataIndex="date"
          render={formatDateWith("yyyy")}
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
    </Page>
  )
}

export default DepositsHistory
