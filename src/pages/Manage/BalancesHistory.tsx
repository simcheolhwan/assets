import { Table, Tooltip, Typography } from "antd"
import { useRecoilValue } from "recoil"
import { reverse, uniq } from "ramda"
import { formatExact } from "../../utils/format"
import { contentsState } from "../../database/database"
import { assetQuery } from "../../database/assets"
import Page from "../../components/Page"
import TickerName from "../../components/TickerName"

const { Column } = Table
const { Text } = Typography

const BalancesHistory = () => {
  const { balances } = useRecoilValue(contentsState)
  const asset = useRecoilValue(assetQuery)

  const dataSource = reverse(
    Object.entries(balances).map(([date, balanceItem]) => {
      return { date, ...balanceItem }
    })
  )

  const keys = uniq(
    dataSource.reduce<string[]>(
      (acc, { date, ...rest }) => [...acc, ...Object.keys(rest)],
      []
    )
  ).sort((a, b) => asset(a).ticker.localeCompare(asset(b).ticker))

  const renderTitle = (balanceKey: string) => {
    const { tickerKey, wallet } = asset(balanceKey)
    return (
      <Tooltip title={wallet}>
        <TickerName tickerKey={tickerKey} />
      </Tooltip>
    )
  }

  return (
    <Page>
      <Table
        dataSource={dataSource}
        pagination={false}
        rowKey="date"
        scroll={{ x: true }}
        sticky
        size="small"
      >
        <Column
          dataIndex="date"
          title="날짜"
          render={(date) => <Text strong>{date}</Text>}
          align="center"
          fixed="left"
        />

        {keys.map((key) => (
          <Column
            dataIndex={key}
            title={renderTitle(key)}
            render={formatExact}
            align="center"
            key={key}
          />
        ))}
      </Table>
    </Page>
  )
}

export default BalancesHistory
