import { Popover, Table, Typography } from "antd"
import { useRecoilValue } from "recoil"
import { formatAmountWith, formatAmount, formatKRW } from "../../utils/format"
import { percent } from "../../utils/format"
import { dayQuery } from "../../database/day"
import Change from "../../components/Change"
import Icon from "../../components/Icon"

const { Column } = Table
const { Text } = Typography

const DashboardTable = ({ date }: { date: string }) => {
  const { dataSource } = useRecoilValue(dayQuery(date))

  const renderWallets = (wallets: DashboardWallet[]) =>
    wallets.map(({ name, balance }) => (
      <p key={name}>
        {name}: {formatAmount(balance)}
      </p>
    ))

  return (
    <Table
      dataSource={dataSource}
      pagination={false}
      rowKey="tickerKey"
      size="small"
      scroll={{ x: true }}
    >
      <Column
        dataIndex="tickerKey"
        render={(tickerKey) => <Icon tickerKey={tickerKey} />}
        align="center"
        fixed="left"
      />
      <Column
        title="항목"
        dataIndex="ticker"
        render={(ticker) => <Text strong>{ticker}</Text>}
        align="center"
        fixed="left"
      />

      <Column<Ticker>
        title="가격"
        dataIndex="price"
        render={(price, { currency }) => formatAmountWith(currency)(price)}
        align="center"
      />
      <Column<Dashboard>
        title="잔고"
        dataIndex="balance"
        render={(value, { wallets }) =>
          wallets.length > 1 ? (
            <Popover content={renderWallets(wallets)} placement="bottom">
              {formatAmount(value)}
            </Popover>
          ) : (
            formatAmount(value)
          )
        }
        align="right"
      />
      <Column title="가치" dataIndex="value" render={formatKRW} align="right" />
      <Column
        title="비율"
        dataIndex="ratio"
        render={(value) => percent(value, true)}
        align="center"
      />
      <Column
        title="목표"
        dataIndex="aim"
        render={(value) => percent(value, true)}
        align="center"
      />
      <Column
        title="리밸런싱"
        dataIndex="rebalance"
        render={(amount) => <Change format={formatAmount}>{amount}</Change>}
        align="center"
      />
    </Table>
  )
}

export default DashboardTable