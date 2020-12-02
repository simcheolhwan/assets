import { useLocation } from "react-router-dom"
import Dashboard from "../pages/Dashboard"
import Tickers from "../pages/Tickers"
import DepositsHistory from "../pages/DepositsHistory"
import Chart from "../pages/Chart"

const routes = [
  { path: "/", label: "현황", component: Dashboard },
  { path: "/tickers", label: "종목", component: Tickers },
  { path: "/deposits", label: "입출금", component: DepositsHistory },
  { path: "/charts", label: "차트", component: Chart },
]

export const useTitle = () => {
  const { pathname } = useLocation()
  return routes.find(({ path }) => path === pathname)?.label
}

export default routes
