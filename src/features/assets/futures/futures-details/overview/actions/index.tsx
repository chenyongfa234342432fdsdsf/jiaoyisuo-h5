/**
 * 合约账户详情 - 总览操作模块
 */
import { t } from '@lingui/macro'
import { Button } from '@nbit/vant'
import Icon from '@/components/icon'
import { PersonProtectTypeEnum, UserContractVersionEnum } from '@/constants/trade'
import { link } from '@/helper/link'
import { getFutureTradePagePath } from '@/helper/route'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { useContractMarketStore } from '@/store/market/contract'
import { useFutureTradeStore } from '@/store/trade/future'
import styles from './index.module.css'

interface IFuturesOverviewActionsProps {
  closeDisable: boolean
  onClick: () => void
  onFlashClose: () => void
  onRevision: () => void
  onSetAutoAddMargin: () => void
}

function FuturesOverviewActions(props: IFuturesOverviewActionsProps) {
  const { closeDisable, onClick, onFlashClose, onRevision, onSetAutoAddMargin } = props || {}
  const {
    futuresDetails: {
      details: { groupId, groupCount, isAutoAdd },
    },
  } = useAssetsFuturesStore()
  const { preferenceSettings } = useFutureTradeStore()
  const { currentCoin: currentFutureCoin, defaultCoin } = useContractMarketStore()

  return (
    <div className={styles['futures-overview-actions-root']}>
      <div className="futures-overview-actions-wrap">
        {groupCount > 1 && preferenceSettings.perpetualVersion === UserContractVersionEnum.professional && (
          <Button size="small" className="operate-btn" onClick={onClick}>
            {t`features_assets_overview_list_futures_futures_list_futures_cell_index_xumymhu7ilggkrk4u7sfy`}
          </Button>
        )}
        <Button size="small" className="operate-btn" disabled={closeDisable} onClick={() => onFlashClose()}>
          {t`features_assets_futures_futures_details_operate_5101423`}
        </Button>
        <Button size="small" className="operate-btn" onClick={onRevision}>
          {t`features_trade_leveraged_leveraged_trade_index_5101278`}
        </Button>
        <Button
          size="small"
          type="primary"
          className="operate-btn trade-btn !mr-0"
          onClick={() =>
            link(
              getFutureTradePagePath({
                symbolName: currentFutureCoin.symbolName || defaultCoin.symbolName || 'BTCUSD',
                selectGroup: groupId,
              })
            )
          }
        >
          {t`assets.coin.trade.go_to_trade`}
        </Button>
      </div>

      {preferenceSettings.perpetualVersion === UserContractVersionEnum.professional &&
        preferenceSettings.isAutoAdd === PersonProtectTypeEnum.open && (
          <div className="margin-cell">
            <div className="margin-left">
              <div className="title-cell">
                <span className="title">{t`features/trade/future/exchange-12`}</span>
              </div>
              <span className="margin-hint">
                {t`features_assets_futures_futures_details_overview_dfhgrlzmnyqpr3xne9-zu`}{' '}
                {preferenceSettings.isAutoAdd === PersonProtectTypeEnum.open && (
                  <span
                    className="text-brand_color"
                    onClick={() => link(`/future/settings/margin/auto-detail?autoRefresh='1'`)}
                  >
                    {t`features_trade_future_settings_margin_index_650`}&gt;
                  </span>
                )}
              </span>
            </div>
            <Icon
              name={isAutoAdd === PersonProtectTypeEnum.open ? 'user_safety_icon_open' : 'user_safety_icon_close'}
              hasTheme={isAutoAdd !== PersonProtectTypeEnum.open}
              className="margin-switch"
              onClick={onSetAutoAddMargin}
            />
          </div>
        )}
    </div>
  )
}

export { FuturesOverviewActions }
