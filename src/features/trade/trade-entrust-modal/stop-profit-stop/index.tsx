import { memo } from 'react'
import { t } from '@lingui/macro'
import LazyImage from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import styles from './index.module.css'

function StopProfitStop() {
  return (
    <div className={styles.scope}>
      <div className="plandelegation-order-tip">
        {t`features_trade_trade_entrust_modal_stop_profit_stop_index_g3ktoylq2y`}
      </div>
      <div className="plandelegation-order-illustration">
        <div className="plandelegation-illustration-title">
          <span>{t`features_trade_trade_entrust_modal_stop_profit_stop_index_llin_p6esf`}</span>
        </div>
        <div className="plandelegation-illustration-img">
          <div className="illustration-img-detail">
            <LazyImage src={`${oss_svg_image_domain_address}stop_profit_examples.png`} hasTheme />
          </div>
        </div>
        <div className="plandelegation-illustration-explain mb-6">
          <div className="illustration-explain-not-text">
            <span></span>
            <span>{t`features_trade_trade_entrust_modal_plan_delegation_index_510121`}</span>
          </div>
          <div className="illustration-explain-text">
            <span></span>
            <span>{t`features/trade/future/price-input-2`}</span>
          </div>
          <div className="illustration-explain-entrust">
            <span></span>
            <span>{t`features/trade/future/price-input-1`}</span>
          </div>
        </div>
      </div>
      <div className="plandelegation-order-content">
        <div>{t`features_trade_trade_entrust_modal_stop_profit_stop_index_esht7br7ce`}</div>
        <div>{t`features_trade_trade_entrust_modal_stop_profit_stop_index_ji12zxcibk`}</div>
        <div className="mt-2">{t`features_trade_trade_entrust_modal_stop_profit_stop_index_vhooabntxh`}</div>
        <div className="mt-2">{t`features_trade_trade_entrust_modal_stop_profit_stop_index_wga4nougls`}</div>
        <div className="mt-2">{t`features_trade_trade_entrust_modal_stop_profit_stop_index_zgpjjtzaj0`}</div>
        <div className="mt-2">{t`features_trade_trade_entrust_modal_stop_profit_stop_index_uqk2soklqf`}</div>
        <div className="mt-2 mb-6">{t`features_trade_trade_entrust_modal_stop_profit_stop_index___wtnndw4f`}</div>
      </div>
    </div>
  )
}

export default memo(StopProfitStop)
