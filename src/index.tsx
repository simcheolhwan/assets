import { render } from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import { RecoilRoot } from "recoil"

import { register } from "./serviceWorkerRegistration"
import reportWebVitals from "./reportWebVitals"

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

register()
reportWebVitals()
