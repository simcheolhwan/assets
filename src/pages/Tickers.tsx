import { PageHeader, Table } from "antd"
import { useRecoilValue } from "recoil"
import { yesterday } from "../utils/history"
import { contentsState } from "../database/database"
import { todayQuery } from "../database/today"
import { useTitle } from "../layouts/routes"
import AddTickerModal from "./AddTickerModal"
import Change from "../components/Change"

const { Column } = Table

const Tickers = () => {
  const title = useTitle()
  const { tickers, prices } = useRecoilValue(contentsState)
  const { priceItem } = useRecoilValue(todayQuery)
  const priceItemYesterday = prices[yesterday]

  const dataSource = Object.values(tickers).map((ticker) => {
    const { tickerKey } = ticker
    const price = priceItem[tickerKey]?.price
    const yesterday = priceItemYesterday[tickerKey]?.price
    const change = price ? price / yesterday - 1 : undefined
    return { ...ticker, price, change }
  })

  return (
    <PageHeader title={title} extra={[<AddTickerModal key="add" />]}>
      <Table dataSource={dataSource} pagination={false} rowKey="tickerKey">
        <Column title="이름" dataIndex="name" align="center" />
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
