import React from "react"
import { useRecoilValue } from "recoil"
import { Button } from "antd"
import { last } from "ramda"
import { addDays, isAfter } from "date-fns"
import { formatDate } from "../../utils/format"
import { latest } from "../../utils/history"
import { todayQuery } from "../../database/date"
import { contentsState, setBranchItem } from "../../database/database"

const AppendBranch = () => {
  const today = useRecoilValue(todayQuery)
  const { branch = {} } = useRecoilValue(contentsState)
  const latestDate = new Date(last(Object.keys(branch))!)
  const date = formatDate(addDays(latestDate, 1))
  const branchItem = latest(branch)

  const submit = async () => {
    await setBranchItem(branchItem, date)
  }

  return isAfter(new Date(date), new Date(today)) ? null : (
    <Button onClick={submit}>날짜 추가</Button>
  )
}

export default AppendBranch
