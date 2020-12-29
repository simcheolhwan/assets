import { useRecoilValue } from "recoil"
import { Button } from "antd"
import { ko } from "date-fns/locale"
import { formatDistanceStrict } from "date-fns"
import { addMinutes, isAfter } from "date-fns"
import { contentsState } from "../database/database"
import { nowState } from "../database/date"

const config = {
  addSuffix: true,
  roundingMethod: "floor" as const,
  locale: ko,
}

const UpdatedAt = () => {
  const { updatedAt } = useRecoilValue(contentsState)
  const now = useRecoilValue(nowState)
  const loading = isAfter(now, addMinutes(updatedAt, 1))

  return loading ? (
    <Button loading disabled key="loading" />
  ) : (
    <Button disabled key="distance">
      {formatDistanceStrict(updatedAt, now, config)}
    </Button>
  )
}

export default UpdatedAt
