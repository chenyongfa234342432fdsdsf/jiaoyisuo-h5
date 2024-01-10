import { memo, useState } from 'react'
import { t } from '@lingui/macro'
import { oss_svg_image_domain_address } from '@/constants/oss'
import LazyImage from '@/components/lazy-image'
import cn from 'classnames'
import Icon from '@/components/icon'
import { useUpdateEffect } from 'ahooks'
import { HandleMode } from '../tradeentrust'
import styles from './index.module.css'
import { useExchangeContext } from '../../common/exchange/context'

type Props = {
  imgName: string
}

function LimitOrder(props: Props) {
  const { imgName } = props
  const { isBuy } = useExchangeContext()
  const [buyHandleMode, setBuyHandleMode] = useState<string>(isBuy ? HandleMode.BUY : HandleMode.SELL)

  const setJudgeBuy = () => {
    return buyHandleMode === HandleMode.BUY
  }

  const setJudgeSell = () => {
    return buyHandleMode === HandleMode.SELL
  }

  useUpdateEffect(() => {
    setBuyHandleMode(isBuy ? HandleMode.BUY : HandleMode.SELL)
  }, [isBuy])
  const tip1 = t`features_trade_trade_entrust_modal_limit_order_index_m0pslahjcw`
  const tip2 = t`features_trade_trade_entrust_modal_limit_order_index_ygzymdx2uo`
  const tip3 = t`features_trade_trade_entrust_modal_limit_order_index_c94xptqboq`

  return (
    <div className={styles.scope}>
      <div className="limit-order-tip">{t`features_trade_trade_entrust_modal_limit_order_index_510135`}</div>
      <div className="limit-order-illustration">
        <div className="limit-illustration-title">
          <span>{t`features_trade_trade_entrust_modal_plan_delegation_index_510120`}</span>
          <div className="limit-illustration-handle">
            <div
              className={cn('illustration-handle-buy', {
                'limit-illustration-handle-buy': setJudgeBuy(),
                'limit-illustration-handle-sell': setJudgeSell(),
              })}
              onClick={() => setBuyHandleMode(HandleMode.BUY)}
            >
              <Icon name={setJudgeBuy() ? 'login_password_satisfy' : 'login_password-dissatisfy_white'} />{' '}
              {t`features/market/detail/index-1`}
            </div>
            <div
              className={cn({
                'limit-illustration-handle-buy': setJudgeSell(),
                'limit-illustration-handle-sell': setJudgeBuy(),
              })}
              onClick={() => setBuyHandleMode(HandleMode.SELL)}
            >
              <Icon name={setJudgeSell() ? 'login_password_satisfy' : 'login_password-dissatisfy_white'} />{' '}
              {t`features/market/detail/index-2`}
            </div>
          </div>
        </div>
        <div className="limit-illustration-img">
          <div className="limit-illustration-merit">
            <div>3000</div>
            <div>1500</div>
          </div>
          <div className="illustration-img-detail">
            <LazyImage src={`${oss_svg_image_domain_address}check_k_line_${buyHandleMode}_${imgName}.svg`} />
          </div>
        </div>
        <div className="limit-illustration-explain">
          <div className="illustration-explain-not-text">
            A-{t`features_trade_trade_entrust_modal_plan_delegation_index_510121`}
          </div>
          <div className="illustration-explain-text">B/C-{t`features/trade/future/price-input-1`}</div>
        </div>
      </div>
      <div className="limit-order-content">{tip1}</div>
      <div className="limit-order-remarks">
        <div className="order-remarks">{t`features_trade_trade_entrust_modal_limit_order_index_510139`}</div>
        <div>{tip2}</div>
        <div>{tip3}</div>
      </div>
    </div>
  )
}

export default memo(LimitOrder)
