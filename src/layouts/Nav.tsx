import { NavLink, useLocation } from "react-router-dom"
import { Menu } from "antd"
import routes from "./routes"

const Nav = () => {
  const { pathname } = useLocation()

  return (
    <Menu
      mode="horizontal"
      style={{ textAlign: "center" }}
      selectedKeys={[pathname]}
    >
      {routes.map(({ path, label }) => (
        <Menu.Item key={path}>
          <NavLink to={path}>{label}</NavLink>
        </Menu.Item>
      ))}
    </Menu>
  )
}

export default Nav
