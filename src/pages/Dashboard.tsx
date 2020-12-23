import { useRecoilValue } from "recoil"
import { Button, PageHeader, Row, Space, Statistic } from "antd"
import { last, nth } from "ramda"
import { formatExchange, formatKRW } from "../utils/format"
import { depositsHistoryState } from "../database/database"
import { balancesHistoryQuery, todayBalancesQuery } from "../database/today"
import { useUpdateToday } from "../database/today"
import { todayExchangeQuery } from "../database/exchange"
import Change from "../components/Change"
import { useTitle } from "../layouts/routes"
import DashboardTable from "./DashboardTable"

const Dashboard = () => {
  const title = useTitle()
  const exchange = useRecoilValue(todayExchangeQuery)
  const { total } = useRecoilValue(todayBalancesQuery)
  const balancesHistory = useRecoilValue(balancesHistoryQuery)
  const depositsHistory = useRecoilValue(depositsHistoryState)
  const { isChanged, update } = useUpdateToday()

  /* p&l */
  const { balances } = nth(-2, balancesHistory)!
  const pnlDay = total - balances.total
  const changeDay = pnlDay / balances.total
  const isChangedDay = Math.abs(changeDay) >= 0.001

  const { balance: lastBalance } = last(depositsHistory)!
  const pnlDeposit = total - lastBalance
  const changeDeposit = pnlDeposit / lastBalance
  const isChangedDeposit = Math.abs(changeDeposit) >= 0.001

  /* render */
  const button = (
    <Button type="primary" onClick={update} disabled={!isChanged} key="update">
      {isChanged ? "업데이트" : "최신 데이터"}
    </Button>
  )

  return (
    <PageHeader
      title={title}
      subTitle={`환율 ${formatExchange(exchange)}`}
      extra={[button]}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Row>
          <Space size="large" wrap>
            <Statistic title="자본" value={formatKRW(total)} />
            <Statistic
              title="어제보다"
              value={isChangedDay ? formatKRW(pnlDay) : "변동없음"}
              suffix={isChangedDay && <Change color>{changeDay}</Change>}
            />
            <Statistic
              title="투자금보다"
              value={isChangedDeposit ? formatKRW(pnlDeposit) : "변동없음"}
              suffix={
                isChangedDeposit && <Change color>{changeDeposit}</Change>
              }
            />
          </Space>
        </Row>

        <DashboardTable />
      </Space>
    </PageHeader>
  )
}

export default Dashboard
