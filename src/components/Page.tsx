import { FC, ReactNode, Suspense } from "react"
import { PageHeader } from "antd"
import { useRecoilValue } from "recoil"
import { formatPrice } from "../utils/format"
import { latest } from "../utils/history"
import { contentsState, databaseState } from "../database/database"
import { useTitle } from "../routes"
import UpdatedAt from "../layouts/UpdatedAt"

const Page: FC<{ extra?: ReactNode }> = ({ children, extra }) => {
  const { state } = useRecoilValue(databaseState)
  const { exchanges } = useRecoilValue(contentsState)
  const exchange = latest(exchanges)

  const title = useTitle()
  const subTitle = `환율 ${formatPrice(exchange, "KRW")}`
  const updatedAt = state === "hydrated" && (
    <Suspense fallback key="suspense">
      <UpdatedAt />
    </Suspense>
  )

  return (
    <PageHeader title={title} subTitle={subTitle} extra={extra ?? updatedAt}>
      {children}
    </PageHeader>
  )
}

export default Page
