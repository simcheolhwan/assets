import { Table, Typography } from "antd"
import { useRecoilValue } from "recoil"
import { contentsState } from "../../database/database"
import Icon, { signSVG } from "../../components/Icon"
import SetTickerModal from "./SetTickerModal"

const { Column } = Table
const { Text } = Typography

const ManageTickers = () => {
  const { tickers } = useRecoilValue(contentsState)
  const dataSource = Object.values(tickers).sort(
    ({ aim: a = 0 }, { aim: b = 0 }) => b - a
  )

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
        <Column
          title="이름"
          dataIndex="name"
          render={(name) => <Text strong>{name}</Text>}
          align="center"
          fixed="left"
        />
        <Column
          title="통화"
          dataIndex="currency"
          render={(currency: CurrencyTicker) => signSVG[currency]}
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
