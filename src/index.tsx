import { render } from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import { RecoilRoot } from "recoil"
import "./index.scss"
import App from "./layouts/App"

render(
  <RecoilRoot>
    <Router>
      <App />
    </Router>
  </RecoilRoot>,
  document.getElementById("root")
)
