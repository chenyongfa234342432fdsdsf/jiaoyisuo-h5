/**
 * 资产 - 合约组详情 - 保证金折算率列表弹窗
 */
import { t } from '@lingui/macro'
import { Button, Popup } from '@nbit/vant'
import Icon from '@/components/icon'
import { FuturesDetailMarginScaleDetailResp, IMarginScaleList } from '@/typings/api/assets/futures'
import { decimalUtils } from '@nbit/utils'
import { formatCurrency, formatNumberDecimal, removeDecimalZero } from '@/helper/decimal'
import CommonList from '@/components/common-list/list'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import LazyImage from '@/components/lazy-image'
import { useCommonStore } from '@/store/common'
import styles from './index.module.css'

export enum MarginScaleListTypeEnum {
  /** 总价值 */
  total = 'total',
  /** 可用保证金 */
  available = 'available',
  /** 仓位占有保证金 */
  position = 'position',
  /** 开仓冻结保证金 */
  freezeMargin = 'freezeMargin',
}
interface MarginScaleListProps {
  title: string
  data: FuturesDetailMarginScaleDetailResp
  visible: boolean
  // 是否展示体验金
  showExperience?: boolean
  onClose: () => void
}

function MarginScaleList(props: MarginScaleListProps) {
  const { isFusionMode } = useCommonStore()
  const { visible, title, data, showExperience, onClose } = props || {}
  const { baseCoin, coinValue, marginValue, averageScale, marginScale } = data || {}
  const {
    futuresCurrencySettings,
    futuresDetails: { details },
  } = useAssetsFuturesStore()

  const marginScaleInfo = [
    {
      label: !isFusionMode
        ? t({
            id: 'features_assets_futures_futures_details_margin_scale_list_index_r2f_s6odyk-_nzhsmofqa',
            values: { 0: baseCoin },
          })
        : t`features_assets_futures_futures_details_margin_scale_list_index_kyu35qj1d6`,
      value: formatCurrency(coinValue, futuresCurrencySettings?.offset || 2),
    },
    {
      label: !isFusionMode
        ? t({
            id: 'features_assets_futures_futures_details_margin_scale_list_index_ozwhtutxyqwys29_wicqu',
            values: { 0: baseCoin },
          })
        : t`features_assets_futures_futures_details_margin_scale_list_index_p4axgwp76i`,
      value: formatCurrency(marginValue, futuresCurrencySettings?.offset || 2),
    },
    {
      label: t({
        id: 'features_assets_futures_futures_details_margin_scale_list_index_qo48mdspdr',
        values: { 0: baseCoin },
      }),
      value: formatCurrency(details?.groupVoucherAmount, futuresCurrencySettings?.offset || 2) || '--',
      isHide: !showExperience,
    },
    {
      label: t`features_assets_futures_futures_details_margin_scale_list_index_yblbvwoqh2vllmdtnqdze`,
      value: `${formatNumberDecimal(decimalUtils.SafeCalcUtil.mul(averageScale, 100), 2, false, true)}%`,
    },
  ]

  return (
    <Popup
      visible={visible}
      className={styles['margin-scale-root']}
      position="bottom"
      round
      lockScroll
      destroyOnClose
      closeOnPopstate
      safeAreaInsetBottom
      onClose={onClose}
    >
      <div className="wrapper">
        <div className="scale-content">
          <div className="header">
            <span>{title}</span>
            <Icon className="close-icon" name="close" hasTheme onClick={onClose} />
          </div>

          <div className="margin-info-content">
            {marginScaleInfo.map((info, index) => {
              if (info?.isHide) return
              return (
                <div className="margin-info-cell" key={index}>
                  <span className="info-label">{info.label}</span>
                  <span className="info-value">{info.value}</span>
                </div>
              )
            })}
          </div>

          <div className="list-header">
            <span>{t`assets.layout.tabs.coins`}</span>
            <span>{t`features_assets_futures_futures_details_margin_scale_list_index_5101467`}</span>
          </div>

          <CommonList
            finished
            showEmpty={marginScale.length === 0}
            emptyClassName="empty"
            listChildren={marginScale.map((scaleItem: IMarginScaleList, index) => {
              return (
                <div
                  key={scaleItem.coinId}
                  className={`scale-cell ${index + 1 === marginScale.length && '!border-b-0'}`}
                >
                  <div className="scale-cell-coin">
                    <LazyImage src={scaleItem.appLogo} width={24} height={24} />
                    <span className="ml-2">{scaleItem.coinName}</span>
                  </div>

                  <span>
                    {`${formatNumberDecimal(decimalUtils.SafeCalcUtil.mul(scaleItem.scale, 100), 2, false, true)}%`}
                  </span>
                </div>
              )
            })}
          />
        </div>

        <div className="bottom">
          <Button className="bottom-btn" type="primary" onClick={onClose}>
            {t`features_trade_common_notification_index_5101066`}
          </Button>
        </div>
      </div>
    </Popup>
  )
}

export { MarginScaleList }
