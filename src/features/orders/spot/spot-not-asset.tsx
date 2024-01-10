import { t } from '@lingui/macro'
import { ReactNode } from 'react'
import { TradeAssetsHandeItem } from '@/features/assets/common/trade-assets-hande-item'
import { MainTypeDepositTypeEnum } from '@/constants/assets'
import { Toast } from '@nbit/vant'
import { link } from '@/helper/link'
import { useMarketStore } from '@/store/market/index'
import { getAssetsRechargePageRoutePath } from '@/helper/route'
import { getQuerySubCoinList } from '@/apis/assets/common'
import styles from './index.module.css'

type Props = {
  children: ReactNode
  whetherOrNotShowChildren: boolean
  isNotLetGoC2C: boolean
}

export function SpotNotAsset(props: Props) {
  const { children, whetherOrNotShowChildren, isNotLetGoC2C } = props

  const { currentCoin } = useMarketStore()

  const toRechargeHandle = async () => {
    const { isOk, data } = await getQuerySubCoinList({ coinId: String(currentCoin.buyCoinId) })
    if (isOk) {
      const isNotDeposit = data?.subCoinList?.find(item => item?.isDeposit === MainTypeDepositTypeEnum.yes)
      isNotDeposit
        ? link(getAssetsRechargePageRoutePath(String(currentCoin.sellCoinId)))
        : Toast.info(t`features_orders_spot_spot_not_asset_ipomakf6mw`)
    }
  }

  return (
    <div className={styles['spot-not-wrapper']}>
      {whetherOrNotShowChildren ? (
        children
      ) : (
        <div>
          <div className="text-text_color_03 text-xs flex justify-center mt-8 mb-4">
            {t`features_orders_spot_spot_not_asset_6xdlbvi0jt`}
          </div>
          <div>
            <TradeAssetsHandeItem isNotLetGoC2C={isNotLetGoC2C} toRechargeHandle={toRechargeHandle} />
          </div>
        </div>
      )}
    </div>
  )
}
