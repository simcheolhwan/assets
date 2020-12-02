import { PageHeader, Table, Typography } from "antd"
import { useRecoilValue } from "recoil"
import { formatM, formatDateWith, formatKRW } from "../utils/format"
import { depositsHistoryState } from "../database/database"
import { useTitle } from "../layouts/routes"

const { Column } = Table
const { Text } = Typography

const DepositsHistory = () => {
  const title = useTitle()
  const dataSource = useRecoilValue(depositsHistoryState)

  return (
    <PageHeader title={title}>
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
            <Text type={amount < 0 ? "danger" : "success"}>
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
          responsive={["sm"]}
        />
      </Table>
    </PageHeader>
  )
}

export default DepositsHistory
