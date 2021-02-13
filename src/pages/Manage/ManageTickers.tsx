import { Table } from "antd"
import { useRecoilValue } from "recoil"
import { isNil } from "ramda"
import { formatPrice } from "../../utils/format"
import { todayQuery } from "../../database/date"
import { tickerValuesQuery } from "../../database/tickers"
import TickerName from "../../components/TickerName"
import Icon, { signSVG } from "../../components/Icon"
import Change from "../../components/Change"
import SetTickerModal from "./SetTickerModal"

const { Column } = Table

const ManageTickers = () => {
  const today = useRecoilValue(todayQuery)
  const tickerValues = useRecoilValue(tickerValuesQuery(today))
  const dataSource = Object.values(tickerValues)
    .filter(({ hidden }) => !hidden)
    .sort(({ aim: a = 0 }, { aim: b = 0 }) => b - a)
    .sort(({ change: a = 0 }, { change: b = 0 }) => b - a)
    .sort(({ change: a }, { change: b }) => Number(isNil(a)) - Number(isNil(b)))

  return (
    <Table
      dataSource={dataSource}
      pagination={false}
      rowKey="tickerKey"
      scroll={{ x: true }}
    >
      <Column
        title="이름"
        dataIndex="tickerKey"
        render={(tickerKey) => <TickerName tickerKey={tickerKey} />}
        align="center"
        fixed="left"
      />
      <Column
        title="통화"
        dataIndex="currency"
        render={(currency: CurrencyTicker) => signSVG[currency]}
        align="center"
      />
      <Column
        title="가격"
        dataIndex="price"
        render={formatPrice}
        align="center"
      />
      <Column
        title="변동"
        dataIndex="change"
        render={(change) => <Change color>{change}</Change>}
        align="center"
      />
      <Column title="목표" dataIndex="aim" align="center" />
      <Column
        title="아이콘"
        dataIndex="tickerKey"
        render={(tickerKey) => <Icon tickerKey={tickerKey} />}
        align="center"
      />
      <Column
        dataIndex="tickerKey"
        align="center"
        render={(tickerKey) => <SetTickerModal tickerKey={tickerKey} />}
      />
    </Table>
  )
}

export default ManageTickers
