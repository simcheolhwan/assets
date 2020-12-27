import { Tabs } from "antd"
import Page from "../../components/Page"
import ManageTickers from "./ManageTickers"
import ManageWallets from "./ManageWallets"
import ManageBalances from "./ManageBalances"

const { TabPane } = Tabs

const Manage = () => {
  return (
    <Page extra>
      <Tabs defaultActiveKey="1">
        <TabPane tab="종목" key="1">
          <ManageTickers />
        </TabPane>

        <TabPane tab="지갑" key="2">
          <ManageWallets />
        </TabPane>

        <TabPane tab="잔고" key="3">
          <ManageBalances />
        </TabPane>
      </Tabs>
    </Page>
  )
}

export default Manage
