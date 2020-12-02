import { PageHeader, Table } from "antd"
import { useRecoilValue } from "recoil"
import { prev } from "../utils/history"
import { contentsState } from "../database/database"
import { useTitle } from "../layouts/routes"
import AddTickerModal from "./AddTickerModal"

const { Column } = Table

const Tickers = () => {
  const title = useTitle()
  const { tickers, prices } = useRecoilValue(contentsState)

  const dataSource = Object.values(tickers).map((ticker) => {
    const { tickerKey } = ticker
    return { ...ticker, price: prev(prices)[tickerKey]?.price }
  })

  return (
    <PageHeader title={title} extra={[<AddTickerModal key="add" />]}>
      <Table dataSource={dataSource} pagination={false} rowKey="tickerKey">
        <Column title="이름" dataIndex="name" align="center" />
        <Column title="통화" dataIndex="currency" align="center" />
        <Column title="가격" dataIndex="price" align="center" />
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
