/**
 * 三元期权 - 当前持仓 - 盈亏结果弹窗
 */
import { t } from '@lingui/macro'
import { Popup } from '@nbit/vant'
import { OptionsOrderProfitTypeEnum } from '@/constants/assets/common'
import LazyImage from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { formatCurrency } from '@/helper/decimal'
import { useEffect } from 'react'
import styles from './index.module.css'

interface IPositionResultModalProps {
  data?: any
  visible: boolean
  onClose: () => void
}
function PositionResultModal(props: IPositionResultModalProps) {
  const { visible, data, onClose } = props || {}
  const { coinSymbol, profitValue, profitable } = data || {}
  const isProfit = profitable === OptionsOrderProfitTypeEnum.profit
  let timerId: any = null

  const onCountDown = () => {
    timerId = setTimeout(() => {
      onClose()
    }, 2000)
  }

  useEffect(() => {
    visible && onCountDown()

    !visible && clearTimeout(timerId)
  }, [visible])

  return (
    <Popup visible={visible} className={styles['position-result-modal-root']} onClose={onClose}>
      <LazyImage
        lazyload={false}
        src={`${oss_svg_image_domain_address}option/${
          isProfit ? 'icon_position_result_profit' : 'icon_position_result_loss'
        }.png`}
        className="result-icon"
      />
      <div className="result-modal-wrap">
        <div className="result-info-wrap">
          <div className="result-title">
            {isProfit
              ? t`features_ternary_option_position_result_modal_index_hc1lotqu_a`
              : t`features_ternary_option_position_result_modal_index_tfphzsuobg`}
          </div>
          <div className={`result-text ${isProfit ? 'text-success_color' : 'text-warning_color'}`}>
            {`${
              isProfit ? t`features_orders_future_holding_close_685` : t`features_orders_future_holding_close_686`
            } ${formatCurrency(profitValue)} ${coinSymbol} `}
          </div>
        </div>

        <LazyImage
          lazyload={false}
          src={`${oss_svg_image_domain_address}option/${
            isProfit ? 'bg_position_result_profit' : 'bg_position_result_loss'
          }.png`}
          className="modal-bg"
        />
      </div>
    </Popup>
  )
}

export { PositionResultModal }
