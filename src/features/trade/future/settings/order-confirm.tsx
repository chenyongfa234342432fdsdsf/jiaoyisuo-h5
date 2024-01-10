import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import NavBar from '@/components/navbar'
import { useUserStore } from '@/store/user'
import { useState } from 'react'
import { AuthModuleEnum, getAuthModuleStatusByKey } from '@/helper/modal-dynamic'
import { EntrustStopLimitType, EntrustTypeEnum, contractStatusIndEnum } from '@/constants/trade'
import { useFutureTradeStore } from '@/store/trade/future'
import { useSpotTradeStore } from '@/store/trade/spot'
import { Cell, Checkbox } from '@nbit/vant'
import FullTipPopup from '@/features/trade/future/settings/component/full-tip-popup'
import styles from './index.module.css'

type IOrderConfirmSwitchItemProps = {
  label: string
  id: any
  isFuture?: boolean
  hideSpot?: boolean
  hideFuture?: boolean
}
function isChecked(settings: any[][], id: any[]) {
  return !!settings.find(item => item.every((v, i) => v === id[i]))
}

function OrderConfirmSwitchItem({ label, hideFuture, hideSpot, id }: IOrderConfirmSwitchItemProps) {
  const { settings: futuresSettings } = useFutureTradeStore()
  const { settings: spotSettings } = useSpotTradeStore()
  const { personalCenterSettings } = useUserStore()
  const contractStatusInd = personalCenterSettings.isOpenContractStatus

  const onFutureChange = async () => {
    futuresSettings.updateOrderConfirmSettings(id)
  }
  const onSpotChange = async () => {
    spotSettings.updateOrderConfirmSettings(id)
  }
  const futureChecked = isChecked(futuresSettings.orderConfirmSettings, id)
  const spotChecked = isChecked(spotSettings.orderConfirmSettings, id)
  // 暂时不上线合约条目
  if (hideSpot && hideFuture) {
    return <></>
  }

  return (
    <Cell>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-base">{label}</span>
        </div>
        <div className="flex">
          {getAuthModuleStatusByKey(AuthModuleEnum.spot) && !hideSpot && (
            <Checkbox
              shape="square"
              onChange={onSpotChange}
              checked={spotChecked}
              iconRender={({ checked }) =>
                checked ? (
                  <Icon name="login_verify_selected" className="check-icon" />
                ) : (
                  <Icon name="login_verify_unselected" hasTheme className="check-icon" />
                )
              }
            >
              {t`constants_order_742`}
            </Checkbox>
          )}
          {!hideFuture &&
            getAuthModuleStatusByKey(AuthModuleEnum.contract) &&
            contractStatusInd === contractStatusIndEnum.yes && (
              <Checkbox
                shape="square"
                className="ml-6"
                onChange={onFutureChange}
                checked={futureChecked}
                iconRender={({ checked }) =>
                  checked ? (
                    <Icon name="login_verify_selected" className="check-icon" />
                  ) : (
                    <Icon name="login_verify_unselected" hasTheme className="check-icon" />
                  )
                }
              >
                {t`assets.financial-record.tabs.futures`}
              </Checkbox>
            )}
        </div>
      </div>
    </Cell>
  )
}

export function OrderConfirmSettings() {
  const [fullTipVisible, setFullTipVisible] = useState<boolean>(false)
  const { personalCenterSettings } = useUserStore()
  const contractStatusInd = personalCenterSettings.isOpenContractStatus
  const groups = [
    {
      name: t`features_trade_future_settings_order_confirm_634`,
      items: [
        {
          label: t`constants/trade-0`,
          id: [EntrustTypeEnum.normal, EntrustTypeEnum.limit, EntrustStopLimitType.none],
        },
        {
          label: t`constants/trade-1`,
          id: [EntrustTypeEnum.normal, EntrustTypeEnum.market, EntrustStopLimitType.none],
        },
        {
          label: t`features_trade_future_settings_order_confirm_635`,
          isFuture: true,
          id: [EntrustTypeEnum.normal, EntrustTypeEnum.limit, EntrustStopLimitType.stopProfitAndLoss],
        },
        {
          label: t`features_trade_future_settings_order_confirm_636`,
          isFuture: true,
          id: [EntrustTypeEnum.normal, EntrustTypeEnum.market, EntrustStopLimitType.stopProfitAndLoss],
        },
      ] as IOrderConfirmSwitchItemProps[],
    },
    {
      name: t`constants/trade-3`,
      items: [
        {
          label: t`features_trade_future_settings_order_confirm_637`,
          id: [EntrustTypeEnum.plan, EntrustTypeEnum.limit, EntrustStopLimitType.none],
        },
        {
          label: t`features_trade_future_settings_order_confirm_638`,
          id: [EntrustTypeEnum.plan, EntrustTypeEnum.market, EntrustStopLimitType.none],
        },
        {
          label: t`features_trade_future_settings_order_confirm_639`,
          hideSpot: true,
          isFuture: true,
          id: [EntrustTypeEnum.plan, EntrustTypeEnum.limit, EntrustStopLimitType.stopProfitAndLoss],
        },
        {
          label: t`features_trade_future_settings_order_confirm_640`,
          hideSpot: true,
          isFuture: true,
          id: [EntrustTypeEnum.plan, EntrustTypeEnum.market, EntrustStopLimitType.stopProfitAndLoss],
        },
      ] as IOrderConfirmSwitchItemProps[],
    },
    {
      name: t`features_orders_order_filters_rfvgyk8h6q`,
      items: [
        {
          label: t`features_orders_order_filters_rfvgyk8h6q`,
          id: [EntrustTypeEnum.stop, EntrustTypeEnum.limit, EntrustStopLimitType.stopProfitAndLoss],
          hideFuture: true,
        },
      ] as IOrderConfirmSwitchItemProps[],
    },
  ]

  const onFullTip = () => {
    setFullTipVisible(true)
  }

  const onChangeClose = () => {
    setFullTipVisible(false)
  }

  return (
    <div className={styles['order-confirm-page-wrapper']}>
      <NavBar title={t`features_trade_future_settings_index_631`} left={<Icon name="back" hasTheme />} />
      <div className="px-4 py-2 bg-brand_color_special_02">
        <div className="flex text-brand_color text-xs">
          <div>{t`features_trade_future_settings_order_confirm_641`}</div>
          <Icon name="msg" className="ml-1 mt-0.5" onClick={onFullTip} />
        </div>
      </div>
      <div>
        {groups.map((group, index) => {
          return (
            <div key={group.name}>
              <div className="group-title">{group.name}</div>
              <div>
                {group.items.map(item => {
                  return (
                    <>
                      {(!item?.isFuture || contractStatusInd === contractStatusIndEnum.yes) && (
                        <OrderConfirmSwitchItem
                          hideFuture={item.hideFuture}
                          hideSpot={item.hideSpot}
                          key={item.label}
                          label={item.label}
                          id={item.id}
                        />
                      )}
                    </>
                  )
                })}
              </div>
              {index < groups.length - 1 && <div className="h-1 bg-line_color_02 mb-2" />}
            </div>
          )
        })}
      </div>
      <FullTipPopup visible={fullTipVisible} onClose={onChangeClose} />
    </div>
  )
}
