import { Table, Typography } from "antd"
import { useRecoilValue } from "recoil"
import { latestDateQuery, tickersDataQuery } from "../../database/day"
import Icon, { signSVG } from "../../components/Icon"
import Change from "../../components/Change"
import { colors } from "../Charts/chartUtils"
import SetTickerModal from "./SetTickerModal"

const { Column } = Table
const { Text } = Typography

const ManageTickers = () => {
  const date = useRecoilValue(latestDateQuery)
  const dataSource = useRecoilValue(tickersDataQuery(date))

  return (
    <>
      <Table
        dataSource={dataSource}
        pagination={false}
        rowKey="tickerKey"
        scroll={{ x: true }}
      >
        <Column
          title="아이콘"
          dataIndex="tickerKey"
          render={(tickerKey) => <Icon tickerKey={tickerKey} />}
          align="center"
          fixed="left"
        />
        <Column<Ticker>
          title="이름"
          dataIndex="name"
          render={(name, { color }) => (
            <Text strong style={{ color: color && colors[color] }}>
              {name}
            </Text>
          )}
          align="center"
          fixed="left"
        />
        <Column
          title="통화"
          dataIndex="currency"
          render={(currency: CurrencyTicker) => signSVG[currency]}
          align="center"
        />
        <Column title="가격" dataIndex="price" align="center" />
        <Column
          title="변동"
          dataIndex="change"
          render={(change) => <Change color>{change}</Change>}
          align="center"
        />
        <Column title="목표" dataIndex="aim" align="center" />
        <Column
          dataIndex="tickerKey"
          align="center"
          render={(tickerKey) => <SetTickerModal tickerKey={tickerKey} />}
        />
      </Table>

      <div style={{ marginTop: 16 }}>
        <SetTickerModal />
      </div>
    </>
  )
}

export default ManageTickers
