import { Button, Space } from "antd"
import { useRecoilValue } from "recoil"
import { head, last } from "ramda"
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

  const merge = async () => {
    const confirm = window.confirm("모두 병합할까요?")
    const { date, value } = head(branchValues)!
    const deposit = { date, title: "입금", amount: value }

    const nextDeposits = [
      ...deposits,
      deposit,
    ].sort(({ date: a }, { date: b }) => a.localeCompare(b))

    const updates = {
      balances: balancesWithBranch,
      deposits: nextDeposits,
      branch: null,
    }

    confirm && (await db.ref(`/`).update(updates))
  }

  const squash = async () => {
    const confirm = window.confirm("오늘 날짜로 입금할까요?")
    const { date, value } = last(branchValues)!
    const deposit = { date, title: "입금", amount: value }
    const nextDeposits = [...deposits, deposit]

    const updates = {
      balances: { ...balances, [today]: balancesWithBranch[today] },
      deposits: nextDeposits,
      branch: null,
    }

    confirm && (await db.ref(`/`).update(updates))
  }

  return !withBranch ? null : (
    <Space style={{ marginTop: 16 }}>
      <Button onClick={merge}>모두 병합하기</Button>
      <Button onClick={squash}>오늘 입금하기</Button>
      <AppendBranch />
    </Space>
  )
}

export default CommandBranch
