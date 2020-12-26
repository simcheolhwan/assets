import { Redirect, Route, Switch } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { Layout, PageHeader, Spin } from "antd"
import { loadingState, useDatabase } from "../database/database"
import useAuth, { authState } from "../database/auth"
import routes from "./routes"
import Nav from "./Nav"
import SignIn from "./SignIn"
import SignOut from "./SignOut"

const { Content } = Layout

const App = () => {
  useDatabase()

  const auth = useRecoilValue(authState)
  const loading = useRecoilValue(loadingState)
  const signIn = useAuth()

  const spin = (
    <Spin style={{ marginTop: 120, textAlign: "center", width: "100%" }} />
  )

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Nav />

      <Content style={{ maxWidth: 768, width: "100%", margin: "auto" }}>
        {auth.state === "loading" || (auth.state === "done" && loading) ? (
          spin
        ) : !auth.contents ? (
          <PageHeader title="사용자 인증">
            <SignIn onSignIn={signIn} />
          </PageHeader>
        ) : (
          <Switch>
            {routes.map((route) => (
              <Route {...route} exact={route.path === "/"} key={route.path} />
            ))}

            <Route path="/signout" component={SignOut} />
            <Redirect to={routes[0].path} />
          </Switch>
        )}
      </Content>
    </Layout>
  )
}

export default App
