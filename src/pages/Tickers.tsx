import { Table } from "antd"
import { useRecoilValue } from "recoil"
import { today } from "../utils/history"
import { dayPricesQuery } from "../database/day"
import Change from "../components/Change"
import Page from "../layouts/Page"
import AddTickerModal from "./AddTickerModal"

const { Column } = Table

const Tickers = () => {
  const dataSource = useRecoilValue(dayPricesQuery(today))

  return (
    <Page>
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

      <div style={{ marginTop: 16 }}>
        <AddTickerModal key="add" />
      </div>
    </Page>
  )
}

export default Tickers
