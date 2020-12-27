import { Redirect, Route, Switch } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { Layout } from "antd"
import { loadingState, useDatabase } from "../database/database"
import Loading from "../components/Loading"
import routes from "../routes"
import Nav from "./Nav"
import SignOut from "./SignOut"

const { Content } = Layout

const App = () => {
  useDatabase()
  const loading = useRecoilValue(loadingState)

  return (
    <Layout>
      <Nav />

      <Content style={{ maxWidth: 768, width: "100%", margin: "auto" }}>
        {loading ? (
          <Loading />
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
