import { Button, Space } from "antd"
import { useRecoilValue } from "recoil"
import { isBefore } from "date-fns"
import { db } from "../../firebase"
import { todayQuery } from "../../database/date"
import { contentsState } from "../../database/database"
import { withBranchState } from "../../database/branch"
import { branchValuesQuery } from "../../database/branch"
import { balancesWithBranchQuery } from "../../database/branch"
import AppendBranch from "./AppendBranch"

const CommandBranch = () => {
  const { balances, deposits } = useRecoilValue(contentsState)
  const today = useRecoilValue(todayQuery)
  const withBranch = useRecoilValue(withBranchState)
  const branchValues = useRecoilValue(branchValuesQuery)
  const balancesWithBranch = useRecoilValue(balancesWithBranchQuery)

  const merge = async (date: string) => {
    const { value } = branchValues.find((item) => item.date === date)!
    const deposit = { date, title: "입금", amount: value }

    const nextDeposits = [
      ...deposits,
      deposit,
    ].sort(({ date: a }, { date: b }) => a.localeCompare(b))

    const nextBalances = Object.entries(balances).reduce<Balances>(
      (acc, [balanceDate, balanceItem]) => ({
        ...acc,
        [balanceDate]: isBefore(new Date(balanceDate), new Date(date))
          ? balanceItem
          : balancesWithBranch[balanceDate],
      }),
      {}
    )

    const updates = {
      balances: nextBalances,
      deposits: nextDeposits,
      branch: null,
    }

    await db.ref(`/`).update(updates)
  }

  const submit = () => {
    const date = window.prompt("병합할 날짜", today)
    date && branchValues.find((item) => item.date === date) && merge(date)
  }

  return !withBranch ? null : (
    <Space style={{ marginTop: 16 }}>
      <Button onClick={submit}>병합하기</Button>
      <AppendBranch />
    </Space>
  )
}

export default CommandBranch
