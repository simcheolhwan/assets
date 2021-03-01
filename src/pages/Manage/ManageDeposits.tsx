import { Table, Tooltip, Typography } from "antd"
import { useRecoilValue } from "recoil"
import { reverse } from "ramda"
import { formatKorean, formatDateWith } from "../../utils/format"
import { depositsHistoryState } from "../../database/deposits"
import { colors } from "../Charts/chartUtils"
import SetDepositModal from "./SetDepositModal"

const { Column } = Table
const { Text } = Typography

const DepositsHistory = () => {
  const dataSource = useRecoilValue(depositsHistoryState)

  return (
    <Table
      dataSource={reverse(dataSource)}
      pagination={false}
      rowKey={({ date, title }) => [date, title].join()}
      scroll={{ x: true }}
    >
      <Column
        title="날짜"
        dataIndex="date"
        render={formatDateWith("yyyy년 M월 d일")}
        align="center"
      />
      <Column<Deposit>
        title="항목"
        dataIndex="title"
        render={(title, { memo = "" }) => (
          <Tooltip title={memo}>
            <Text style={{ color: colorsByTitle[title] }} strong>
              {title}
            </Text>
          </Tooltip>
        )}
        align="center"
      />
      <Column
        title="내역"
        dataIndex="amount"
        render={(amount) => (
          <Text type={amount < 0 ? "danger" : undefined}>
            {amount > 0 && "+"}
            {formatKorean(amount)}
          </Text>
        )}
        align="right"
      />
      <Column
        title="누적"
        dataIndex="balance"
        render={formatKorean}
        align="right"
      />
      <Column
        dataIndex="index"
        render={(index) => <SetDepositModal index={index} />}
        align="right"
      />
    </Table>
  )
}

export default DepositsHistory

/* styles */
const colorsByTitle: Dictionary<string> = {
  입금: colors.green,
  수익: colors.blue,
}
