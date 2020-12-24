import BigNumber from "bignumber.js"
import { Mirror } from "@mirror-protocol/mirror.js"
import { address, lcd } from "./terra"

const mirror = new Mirror({ lcd })

export const querySymbolPrice = async (symbol: string) => {
  try {
    const asset = mirror.assets[symbol]
    const { assets } = await asset.pair.getPool()
    const [{ amount: uusdAmount }, { amount: assetAmount }] = assets
    const price = new BigNumber(uusdAmount).div(assetAmount)
    return price.gt(1) ? price.dp(2).toNumber() : price.dp(3).toNumber()
  } catch {
    return 0
  }
}

export const queryLpBalance = async (symbol: string) => {
  try {
    const asset = mirror.assets[symbol]
    const { contractAddress } = asset.token

    /* staked balance */
    const { reward_infos } = await mirror.staking.getRewardInfo(address)
    const bondAmount =
      reward_infos.find(({ asset_token }) => asset_token === contractAddress)
        ?.bond_amount ?? 0

    /* withdrawable value */
    const { assets, total_share } = await asset.pair.getPool()
    const [{ amount }] = assets
    const uusd = new BigNumber(bondAmount).times(amount).div(total_share)

    return uusd.times(2).div(1e6).integerValue().toNumber()
  } catch {
    return 0
  }
}
