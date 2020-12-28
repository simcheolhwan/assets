import { Checkbox, Popover, Table } from "antd"
import { useRecoilState, useRecoilValue } from "recoil"
import { formatAmount, formatKRW, formatPrice } from "../../utils/format"
import { percent } from "../../utils/format"
import { todayQuery } from "../../database/date"
import { contentsState } from "../../database/database"
import { tickerRatiosQuery } from "../../database/tickers"
import { withBranchState } from "../../database/branch"
import Change from "../../components/Change"
import TickerName from "../../components/TickerName"
import Icon from "../../components/Icon"

const { Column } = Table

const DashboardTable = () => {
  const today = useRecoilValue(todayQuery)
  const tickerRatios = useRecoilValue(tickerRatiosQuery(today))
  const { branch = {} } = useRecoilValue(contentsState)
  const [withBranch, setWithBranch] = useRecoilState(withBranchState)

  const dataSource = Object.values(tickerRatios)
    .filter(({ balance }) => balance)
    .sort(({ value: a }, { value: b }) => b - a)
    .sort(({ aim: a = 0 }, { aim: b = 0 }) => b - a)

  const renderWallets = (wallets: TickerWallet[]) =>
    wallets.map(({ name, balance }) => (
      <p key={name}>
        {name}: {formatAmount(balance)}
      </p>
    ))

  const ratio = (
    <pre>
      {dataSource
        .map(({ name, ratio }) => [name, percent(ratio, true)].join(": "))
        .join("\n")}
    </pre>
  )

  return (
    <>
      {!!Object.keys(branch).length && (
        <Checkbox
          checked={withBranch}
          onChange={(e) => setWithBranch(e.target.checked)}
        >
          브랜치 합쳐서 보기
        </Checkbox>
      )}

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
          dataIndex="tickerKey"
          render={(tickerKey) => <TickerName tickerKey={tickerKey} />}
          align="center"
          fixed="left"
        />

        <Column<Ticker>
          title="가격"
          dataIndex="price"
          render={(price, { currency }) => formatPrice(price, currency)}
          align="center"
        />
        <Column<TickerBalance>
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
        <Column
          title="가치"
          dataIndex="value"
          render={formatKRW}
          align="right"
        />
        <Column
          title={
            <Popover content={ratio} placement="bottom">
              비율
            </Popover>
          }
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
    </>
  )
}

export default DashboardTable
