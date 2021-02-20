import { useState } from "react"
import { useRecoilValue } from "recoil"
import { Tabs } from "antd"

import { todayQuery } from "../../database/date"
import Page from "../../components/Page"

import ManageTickers from "./ManageTickers"
import ManageWallets from "./ManageWallets"
import ManageBalances from "./ManageBalances"
import ManageAssets from "./ManageAssets"
import ManageDeposits from "./ManageDeposits"

import SetTickerModal from "./SetTickerModal"
import SetWalletModal from "./SetWalletModal"
import SetDepositModal from "./SetDepositModal"
import SetAssetModal from "./SetAssetModal"
import SetBalanceItemModal from "./SetBalanceItemModal"
import SetBalanceModal from "./SetBalanceModal"

const { TabPane } = Tabs

type Tab = "tickers" | "wallets" | "balances" | "deposits"

const Manage = () => {
  const today = useRecoilValue(todayQuery)
  const [tab, setTab] = useState<Tab>("balances")

  const balancesActions = (
    <>
      <SetBalanceItemModal date={today} />
      <SetBalanceModal />
    </>
  )

  const extra = {
    tickers: <SetTickerModal />,
    wallets: <SetWalletModal />,
    balances: balancesActions,
    assets: <SetAssetModal />,
    deposits: <SetDepositModal />,
  }[tab]

  return (
    <Page>
      <Tabs
        activeKey={tab}
        onChange={(tab) => setTab(tab as Tab)}
        tabBarExtraContent={extra}
      >
        <TabPane tab="잔고" key="balances">
          <ManageBalances />
        </TabPane>

        <TabPane tab="종목" key="tickers">
          <ManageTickers />
        </TabPane>

        <TabPane tab="지갑" key="wallets">
          <ManageWallets />
        </TabPane>

        <TabPane tab="자산" key="assets">
          <ManageAssets />
        </TabPane>

        <TabPane tab="입출금" key="deposits">
          <ManageDeposits />
        </TabPane>
      </Tabs>
    </Page>
  )
}

export default Manage
