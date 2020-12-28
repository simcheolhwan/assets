import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { Button } from "antd"
import { ko } from "date-fns/locale"
import { formatDistanceStrict, startOfSecond } from "date-fns"
import { addMinutes, isAfter } from "date-fns"
import { contentsState } from "../database/database"

const config = {
  addSuffix: true,
  roundingMethod: "floor" as const,
  locale: ko,
}

const UpdatedAt = () => {
  const { updatedAt } = useRecoilValue(contentsState)
  const [now, setNow] = useState(startOfSecond(Date.now()).getTime())

  useEffect(() => {
    setInterval(() => setNow(startOfSecond(new Date()).getTime()), 1000)
  }, [])

  const loading = isAfter(now, addMinutes(updatedAt, 2))

  return loading ? (
    <Button loading disabled key="loading" />
  ) : (
    <Button disabled key="distance">
      {formatDistanceStrict(updatedAt, now, config)}
    </Button>
  )
}

export default UpdatedAt
