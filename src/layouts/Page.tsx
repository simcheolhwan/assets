import { FC, ReactNode, Suspense } from "react"
import { Button, PageHeader } from "antd"
import { useRecoilValue } from "recoil"
import { formatExchange } from "../utils/format"
import { latest } from "../utils/history"
import { contentsState, databaseState } from "../database/database"
import { useUpdateToday } from "../database/today"
import { useTitle } from "./routes"

const TodayButton = () => {
  const { isChanged, update, refresh } = useUpdateToday()

  return (
    <>
      <Button
        type="primary"
        danger={isChanged}
        onClick={isChanged ? update : refresh}
      >
        {isChanged ? "업데이트" : "새로고침"}
      </Button>
    </>
  )
}

const Page: FC<{ extra?: ReactNode }> = ({ children, extra }) => {
  const { state } = useRecoilValue(databaseState)
  const { exchanges } = useRecoilValue(contentsState)
  const { USD } = latest(exchanges)

  const title = useTitle()
  const subTitle = `환율 ${formatExchange(USD)}`

  const today = state === "hydrated" && (
    <Suspense fallback key="suspense">
      <TodayButton />
    </Suspense>
  )

  return (
    <PageHeader title={title} subTitle={subTitle} extra={extra ?? today}>
      {children}
    </PageHeader>
  )
}

export default Page
