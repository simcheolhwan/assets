import { render } from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import { RecoilRoot } from "recoil"

import { register } from "./serviceWorkerRegistration"
import reportWebVitals from "./reportWebVitals"

import "./index.scss"
import WithAuth from "./layouts/WithAuth"
import App from "./layouts/App"

render(
  <RecoilRoot>
    <Router>
      <WithAuth>
        <App />
      </WithAuth>
    </Router>
  </RecoilRoot>,
  document.getElementById("root")
)

register()
reportWebVitals()
