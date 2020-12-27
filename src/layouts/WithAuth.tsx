import { FC } from "react"
import { useRecoilValue } from "recoil"
import { PageHeader } from "antd"
import useAuth, { authState } from "../database/auth"
import Loading from "../components/Loading"
import SignIn from "./SignIn"

const WithAuth: FC = ({ children }) => {
  const auth = useRecoilValue(authState)
  const signIn = useAuth()

  return auth.contents ? (
    <>{children}</>
  ) : auth.state === "loading" ? (
    <Loading />
  ) : (
    <PageHeader title="사용자 인증">
      <SignIn onSignIn={signIn} />
    </PageHeader>
  )
}

export default WithAuth
