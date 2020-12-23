import { PageHeader, Table } from "antd"
import { useRecoilValue } from "recoil"
import { isNil } from "ramda"
import { yesterday } from "../utils/history"
import { contentsState } from "../database/database"
import { todayDataQuery } from "../database/today"
import { useTitle } from "../layouts/routes"
import AddTickerModal from "./AddTickerModal"
import Change from "../components/Change"

const { Column } = Table

const Tickers = () => {
  const title = useTitle()
  const { tickers, prices } = useRecoilValue(contentsState)
  const { priceItem } = useRecoilValue(todayDataQuery)
  const priceItemYesterday = prices[yesterday]

  const dataSource = Object.values(tickers)
    .map((ticker) => {
      const { tickerKey } = ticker
      const price = priceItem[tickerKey]?.price
      const yesterday = priceItemYesterday[tickerKey]?.price
      const change = price ? price / yesterday - 1 : undefined
      return { ...ticker, price, change }
    })
    .sort(({ change: a = 0 }, { change: b = 0 }) => b - a)
    .sort(({ change: a }, { change: b }) => Number(isNil(a)) - Number(isNil(b)))

  return (
    <PageHeader title={title} extra={[<AddTickerModal key="add" />]}>
      <Table
        dataSource={dataSource}
        pagination={false}
        rowKey="tickerKey"
        scroll={{ x: true }}
      >
        <Column title="이름" dataIndex="name" align="center" fixed="left" />
        <Column title="통화" dataIndex="currency" align="center" />
        <Column title="가격" dataIndex="price" align="center" />
        <Column
          title="변동"
          dataIndex="change"
          render={(change) => <Change color>{change}</Change>}
          align="center"
        />
        <Column
          title="Key"
          dataIndex="tickerKey"
          align="center"
          render={(key) => <code>{key}</code>}
          responsive={["sm"]}
        />
      </Table>
    </PageHeader>
  )
}

export default Tickers
