/**
 * 现货 - 下单页资产列表组件
 */
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { link } from '@/helper/link'
import styles from '../common.module.css'

type TradeAssetsHandeItemProps = {
  toRechargeHandle: () => void
  isNotLetGoC2C: boolean
}

function TradeAssetsHandeItem(props: TradeAssetsHandeItemProps) {
  const { toRechargeHandle, isNotLetGoC2C } = props

  const toPurchaseC2C = () => {
    link('/c2c/trade')
  }

  return (
    <div className={styles['trade-assets-hande-item']}>
      <div className="to-trade-handle">
        <div className="flex mt-4 justify-center items-center">
          <div>
            <div className="trade-handle-item" onClick={() => toRechargeHandle()}>
              <Icon name="icon_trade_top_up" />
            </div>
            <div className="trade-handle-text">{t`features_assets_common_trade_assets_hande_item_index_uwszquk1rb`}</div>
          </div>
          {isNotLetGoC2C && (
            <div className="ml-16">
              <div className="trade-handle-item" onClick={() => toPurchaseC2C()}>
                <Icon name="icon_trade_buy" />
              </div>
              <div className="trade-handle-text">{t`features_kyc_index_standards_5101189`}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { TradeAssetsHandeItem }
