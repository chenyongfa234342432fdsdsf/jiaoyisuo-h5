import { memo, useState } from 'react'
import { t } from '@lingui/macro'
import LazyImage from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import cn from 'classnames'
import Icon from '@/components/icon'
import { useUpdateEffect } from 'ahooks'
import styles from './index.module.css'
import { HandleMode } from '../tradeentrust'
import { useExchangeContext } from '../../common/exchange/context'

type Props = {
  imgName: string
}

function PlanDelegation(props: Props) {
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

  return (
    <div className={styles.scope}>
      <div className="plandelegation-order-tip">
        {t`features_trade_trade_entrust_modal_plan_delegation_index_510119`}
      </div>
      <div className="plandelegation-order-illustration">
        <div className="plandelegation-illustration-title">
          <span>{t`features_trade_trade_entrust_modal_plan_delegation_index_510120`}</span>
          <div className="plandelegation-illustration-handle">
            <div
              className={cn('illustration-handle-buy', {
                'plandelegation-illustration-handle-buy': setJudgeBuy(),
                'plandelegation-illustration-handle-sell': setJudgeSell(),
              })}
              onClick={() => setBuyHandleMode(HandleMode.BUY)}
            >
              <Icon name={setJudgeBuy() ? 'login_password_satisfy' : 'login_password-dissatisfy_white'} />{' '}
              {t`features/market/detail/index-1`}
            </div>
            <div
              className={cn({
                'plandelegation-illustration-handle-buy': setJudgeSell(),
                'plandelegation-illustration-handle-sell': setJudgeBuy(),
              })}
              onClick={() => setBuyHandleMode(HandleMode.SELL)}
            >
              <Icon name={setJudgeSell() ? 'login_password_satisfy' : 'login_password-dissatisfy_white'} />{' '}
              {t`features/market/detail/index-2`}
            </div>
          </div>
        </div>
        <div className="plandelegation-illustration-img">
          <div className="plandelegation-illustration-merit">
            {setJudgeSell() && <div className="illustration-merit-sell">2500</div>}
            <div className={cn({ 'illustration-merit-middle': setJudgeSell() })}>2400</div>
            {setJudgeBuy() && <div className="illustration-merit-buy">2300</div>}
          </div>
          <div className="illustration-img-detail">
            <LazyImage src={`${oss_svg_image_domain_address}plan_k_line_${buyHandleMode}_${imgName}.svg`} />
          </div>
        </div>
        <div className="plandelegation-illustration-explain">
          <div className="illustration-explain-not-text">
            A-{t`features_trade_trade_entrust_modal_plan_delegation_index_510121`}
          </div>
          <div className="illustration-explain-text">B-{t`features/trade/future/price-input-2`}</div>
          <div className="illustration-explain-entrust">C-{t`features/trade/future/price-input-1`}</div>
        </div>
      </div>
      <div className="plandelegation-order-content">
        {t`features_trade_trade_entrust_modal_plan_delegation_index_510127`}
      </div>
    </div>
  )
}

export default memo(PlanDelegation)
