/**
 * 资产 - 账户列表 - 单元格
 */
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { IncreaseTag } from '@nbit/react'
import { Button, Toast } from '@nbit/vant'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { FuturesAccountTypeEnum } from '@/constants/assets/futures'
import { FuturesList } from '@/typings/api/assets/futures'
import { isString } from 'lodash'
import { CommonDigital } from '@/components/common-digital'
import { useAssetsStore } from '@/store/assets/spot'
import { getTextFromStoreEnums } from '@/helper/store'
import { link } from '@/helper/link'
import {
  getAssetsFuturesDetailPageRoutePath,
  getAssetsFuturesTransferPageRoutePath,
  getFutureTradePagePath,
} from '@/helper/route'
import { AssetsTransferTypeEnum } from '@/constants/assets/common'
import { useContractMarketStore } from '@/store/market/contract'
import { GUIDE_ELEMENT_IDS_ENUM } from '@/constants/guide-ids'
import { formatCurrency } from '@/helper/decimal'
import styles from './index.module.css'

interface IAccountCellProps {
  data: FuturesList
  isFirst: boolean
  showUnit?: boolean
}

function AccountCell(props: IAccountCellProps) {
  const { futuresEnums, futuresCurrencySettings } = useAssetsFuturesStore()
  const { encryption } = useAssetsStore().assetsModule || {}
  const { currentCoin: currentFutureCoin, defaultCoin } = useContractMarketStore()
  const { data, showUnit = true } = props || {}

  const infoList = [
    {
      label: showUnit
        ? t({
            id: 'features_assets_overview_list_futures_futures_list_account_cell_index_xgehgrh1ao',
            values: { 0: data?.baseCoin },
          })
        : t`features_assets_futures_common_migrate_modal_index_5101344`,
      content: data?.marginAvailable,
    },
    {
      label: showUnit
        ? t({
            id: 'features_assets_overview_list_futures_futures_list_account_cell_index_p51_dn9tuy',
            values: { 0: data?.baseCoin },
          })
        : t`features_orders_future_holding_index_603`,
      content: encryption ? (
        '******'
      ) : (
        <IncreaseTag
          value={data?.unrealizedProfit}
          hasPrefix
          digits={futuresCurrencySettings?.offset || 2}
          delZero={false}
        />
      ),
      class: 'text-end',
    },
  ]

  const operateList = [
    {
      label: t`features_assets_overview_list_futures_futures_list_account_cell_index_oowpx7q26e`,
      onClick: () =>
        link(
          getAssetsFuturesTransferPageRoutePath({
            groupId: data?.groupId,
            type: AssetsTransferTypeEnum.to,
          })
        ),
    },
    {
      label: t`features_assets_overview_list_futures_futures_list_account_cell_index_onsc5m3mch`,
      onClick: () => {
        if (+data?.groupAsset <= 0) {
          Toast.info(t`features_assets_overview_list_futures_futures_list_account_cell_index_dstqanmp9k`)
          return
        }

        link(
          getAssetsFuturesTransferPageRoutePath({
            groupId: data?.groupId,
            type: AssetsTransferTypeEnum.from,
          })
        )
      },
    },
    {
      label: t`assets.coin.trade.go_to_trade`,
      type: 'primary',
      class: '!bg-brand_color !text-button_text_02',
      onClick: () =>
        link(
          getFutureTradePagePath({
            symbolName: currentFutureCoin.symbolName || defaultCoin.symbolName || 'BTCUSD',
            selectGroup: data?.groupId,
          })
        ),
    },
  ]

  const getAccountTypeColor = () => {
    let colors = {}
    switch (data?.accountType) {
      case FuturesAccountTypeEnum.immobilization:
        colors = {
          background: 'rgba(63, 124, 242, 0.1)',
          color: '#3F7CF2',
        }
        break
      case FuturesAccountTypeEnum.temporary:
        colors = {
          background: 'rgba(242, 100, 17, 0.1)',
          color: '#F26411',
        }
        break
      default:
        break
    }

    return colors
  }

  return (
    <div
      className={styles['futures-account-list-root']}
      onClick={e => {
        e.stopPropagation()
        link(getAssetsFuturesDetailPageRoutePath(data?.groupId))
      }}
      id={props.isFirst ? GUIDE_ELEMENT_IDS_ENUM.futureTradePositionAccountCell : ''}
    >
      <div className="tag-wrap">
        <div className="tag-cell" style={getAccountTypeColor()}>
          <span className="tag-text">
            {getTextFromStoreEnums(data?.accountType || '', futuresEnums.perpetualAccountTypeEnum.enums)}
          </span>
        </div>
      </div>

      <div className="futures-account-list-content">
        <div className="futures-account-list-header">
          <span className="name">{data?.groupName}</span>
          <Icon hasTheme name="next_arrow" className="next-icon" />
        </div>

        <div className="info-wrap">
          {infoList.map((info, i: number) => {
            return (
              <div key={i} className={`info-cell ${info.class}`}>
                <div className="info-label">{info.label}</div>

                <div className="info-content">
                  {isString(info.content) ? (
                    <CommonDigital
                      isEncrypt
                      content={formatCurrency(info.content, futuresCurrencySettings?.offset || 2)}
                    />
                  ) : (
                    info.content
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bottom">
        {operateList.map((operate, i: number) => {
          return (
            <Button
              className={`btn-cell ${operate.class}`}
              type={operate.type ? 'primary' : 'default'}
              key={i}
              onClick={e => {
                e.stopPropagation()
                operate.onClick()
              }}
            >
              {operate.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export { AccountCell }
