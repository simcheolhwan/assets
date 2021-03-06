import { useLocation } from "react-router-dom"
import Charts from "./pages/Charts/Charts"
import Dashboard from "./pages/Dashboard/Dashboard"
import Manage from "./pages/Manage/Manage"

const routes = [
  { path: "/charts", label: "차트", component: Charts },
  { path: "/dashboard", label: "현황", component: Dashboard },
  { path: "/manage", label: "관리", component: Manage },
]

export const useTitle = () => {
  const { pathname } = useLocation()
  return routes.find(({ path }) => path === pathname)?.label
}

export default routes
