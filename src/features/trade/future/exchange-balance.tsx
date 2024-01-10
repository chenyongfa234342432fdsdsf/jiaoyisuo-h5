import Icon from '@/components/icon'
import Link from '@/components/link'
import { t } from '@lingui/macro'
import { useState } from 'react'
import { ActionSheet, Button, Popover } from '@nbit/vant'
import { formatCurrency, getPercentDisplay } from '@/helper/decimal'
import { replaceEmpty } from '@/helper/filters'
import { useUserStore } from '@/store/user'
import { link } from '@/helper/link'
import classNames from 'classnames'
import { TradeFutureMarginTypeInReqEnum } from '@/constants/trade'
import { MarginCoinArrayType } from '@/typings/api/trade'
import { useMount, useRequest } from 'ahooks'
import { getAssetsMarginInfo } from '@/apis/trade'
import { getIsLogin } from '@/helper/auth'
import CommonList from '@/components/common-list/list'
import CommonListEmpty from '@/components/common-list/list-empty'
import { requestWithLoading } from '@/helper/order'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { useFutureTradeStore } from '@/store/trade/future'
import { useFutureCurrencySettings, useTradeCurrentFutureCoin } from '@/hooks/features/trade'
import Tooltip from '@/components/tooltip'
import { useScaleDom } from '@/hooks/use-scale-dom'
import { envIsServer } from '@/helper/env'
import { useCommonStore } from '@/store/common'
import { getPerpetualMarginSettings } from '@/apis/assets/futures/common'
import { decimalUtils } from '@nbit/utils'
import RadioButtonGroup from '@/components/radio-button-group'
import { MarginSettingsList } from '@/typings/api/assets/futures'
import { getMemberCurrencyList } from '@/apis/user'
import { getAssetsFuturesTransferPageRoutePath } from '@/helper/route/assets'
import { GUIDE_ELEMENT_IDS_ENUM } from '@/constants/guide-ids'
import TradeBottomModal from '../common/bottom-modal'
import { MarginCoinTabs } from './settings/margin-coin'
import { useExchangeContext } from '../common/exchange/context'
import styles from './common.module.css'

function MarginSourceSelect() {
  const { tradeInfo, onMarginSourceChange, buyDigit } = useExchangeContext()
  const { userAssetsFutures } = useAssetsFuturesStore()
  const { futureGroups } = useFutureTradeStore()
  const groupBalance = Number(futureGroups.find(g => g.groupId === tradeInfo.group?.groupId)?.marginAvailable || 0)
  const options = [
    {
      id: TradeFutureMarginTypeInReqEnum.assets,
      title: t`features_trade_future_c2c_22225101593`,
      balance: userAssetsFutures.availableBalanceValue,
      disabled: false,
      ref: useScaleDom(0, userAssetsFutures.availableBalanceValue, 0.6),
    },
    {
      id: TradeFutureMarginTypeInReqEnum.group,
      title: t`features_trade_future_exchange_balance_mcj5hp7yea`,
      balance: groupBalance,
      ref: useScaleDom(0, groupBalance, 0.6),
      disabled: !tradeInfo.group?.groupId,
    },
  ]
  const currentCoin = useTradeCurrentFutureCoin()

  return (
    <div className={styles['margin-source-select-wrapper']}>
      {options.map(option => {
        const isSelected = tradeInfo.marginSource === option.id
        const onChange = () => {
          if (isSelected) {
            return
          }
          if (option.disabled) {
            return
          }
          onMarginSourceChange(option.id)
        }

        return (
          <div
            key={option.id}
            onClick={onChange}
            className={classNames('option-item', {
              'is-selected': isSelected,
              'is-disabled': option.disabled,
            })}
          >
            <div className="title">{option.title}</div>
            <div className="balance">
              <span className="whitespace-nowrap">{t`features_trade_future_exchange_balance_5101393`}</span>
              <div ref={option.ref} className="balance-number overflow-ellipsis">
                {formatCurrency(option.balance, buyDigit)}
              </div>{' '}
              {currentCoin.quoteSymbolName}
            </div>
            {isSelected && (
              <div className="selected-icon">
                <Icon name="contract_select" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function MarginCoins() {
  const [isAvg, setIsAvg] = useState(false)
  const [coins, setCoins] = useState<MarginCoinArrayType[]>([])
  const { futureCurrencySettings } = useFutureTradeStore()
  const [scaleCoins, setScaleCoins] = useState<MarginSettingsList[]>([])
  const { run: fetchCurrencyList, data: currencyList = [] } = useRequest(
    async () => {
      const res = await getMemberCurrencyList({})
      return res.data?.currencyList || []
    },
    {
      manual: true,
    }
  )
  const { run } = useRequest(
    async () => {
      if (!getIsLogin()) {
        return
      }
      const [res, res2] = await requestWithLoading(
        Promise.all([getAssetsMarginInfo({}), getPerpetualMarginSettings({})])
      )
      setScaleCoins(res2.data?.merAssetsMarginSettingData || [])
      if (res.isOk && res.data) {
        // 暂时保留
        const merAssetsMarginSettingData: any[] = []
        const resCoins: MarginCoinArrayType[] = res.data.coinData
          .filter(item => item.selected)
          .map(item => {
            return {
              ...item,
              rate: decimalUtils.SafeCalcUtil.mul(
                item.rate,
                merAssetsMarginSettingData.find(v => v.coinId === item.coinId)?.scale || 1
              ),
            }
          })
        setCoins(resCoins)
        setIsAvg(res.data.isAvg === 'yes')
      }
    },
    {
      manual: true,
    }
  )
  useMount(run)
  useMount(fetchCurrencyList)
  // 不使用 Link 是因为弹窗内的链接似乎无法被识别，导致刷新
  const toSettingPage = () => {
    link('/future/settings/margin-coin')
  }
  const [isRatio, setIsRatio] = useState(true)
  const optionList = [
    {
      label: '%',
      value: true,
    },
    {
      label: currencyList.find(v => v.currencyEnName === futureCurrencySettings.currencyEnName)?.currencySymbol || '$',
      value: false,
    },
  ]

  return (
    <div className={styles['margin-source-coins-wrapper']}>
      <div className="px-4">
        <div className="flex mb-2 justify-between">
          <div className="flex items-center">
            <div className="text-base font-medium mr-1">{t`features_trade_future_exchange_balance_5101394`}</div>
            <Tooltip content={t`features_trade_future_exchange_balance_612`}>
              <Icon name="msg" hasTheme />
            </Tooltip>
          </div>
          <span className="text-brand_color" onClick={toSettingPage}>{t`user.account_security.google_01`}</span>
        </div>
        <div className="text-text_color_02 hidden">
          <span>{t`features_trade_future_exchange_balance_5101395`}</span>
          <span>
            {!isAvg
              ? t`features_trade_future_settings_component_coin_select_index_5101382`
              : t`features_trade_future_exchange_balance_5101392`}
          </span>
        </div>
        <div className="flex justify-between">
          <RadioButtonGroup
            size="large"
            value={isRatio as any}
            onChange={setIsRatio as any}
            options={optionList as any}
          />
          <span className="text-xs text-text_color_03">
            {isRatio
              ? t`features_trade_future_exchange_balance_nibbz6mwxfyrdro4felxm`
              : t`features_trade_future_exchange_balance_6wddutqwe7sbu96ktvkaj`}
          </span>
        </div>
      </div>

      <div className="coins--list-wrapper overflow-y-auto max-h-60">
        <CommonListEmpty hidden={coins.length > 0} className="py-10" />
        {coins.map(coin => {
          const price = formatCurrency(coin.rate, futureCurrencySettings.offset)
          const ratioCoin = scaleCoins.find(v => v.coinId?.toString() === coin.coinId?.toString())
          return (
            <div key={coin.coinId} className="rv-hairline--bottom coin-item">
              <span>1 {coin.coinName}</span>
              {isRatio ? (
                <span>{getPercentDisplay(ratioCoin?.scale, 0)}</span>
              ) : (
                <span>
                  ≈ {price} {coin.currencySymbol}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MarginSource() {
  return (
    <div className="text-sm">
      <div className="mb-6 px-4">
        <MarginSourceSelect />
      </div>
      <MarginCoins />
    </div>
  )
}

export function FutureBalance() {
  const [rechargeVisible, setRechargeVisible] = useState(false)
  const onCancel = () => setRechargeVisible(false)
  const [balanceModalVisible, setBalanceModalVisible] = useState(false)
  const { isLogin } = useUserStore()
  const { isFusionMode } = useCommonStore()
  const hasC2c = false
  const toRecharge = () => {
    link('/assets/recharge')
  }
  const clickRecharge = () => {
    if (isFusionMode) return
    if (hasC2c) {
      setRechargeVisible(true)
    } else {
      toRecharge()
    }
  }
  const actions = [
    {
      name: t`assets.financial-record.tabs.Deposit`,
      callback: () => {
        onCancel()
        toRecharge()
      },
    },
  ]
  const currentCoin = useTradeCurrentFutureCoin()
  const { quoteBalance, tradeInfo, buyDigit } = useExchangeContext()
  const balanceNumberScaleRef = useScaleDom(0, quoteBalance, 0.6)
  const marginSourceIsAssets = tradeInfo.marginSource === TradeFutureMarginTypeInReqEnum.assets
  const label = marginSourceIsAssets
    ? t`features_trade_future_c2c_22225101593`
    : t`features_trade_future_exchange_balance_31_qmqlf0v`
  const toTransfer = () => {
    link(
      getAssetsFuturesTransferPageRoutePath({
        groupId: tradeInfo.group?.groupId as any,
      })
    )
  }

  return (
    <>
      <div id={GUIDE_ELEMENT_IDS_ENUM.futureBalance} className={classNames('mb-2', styles['exchange-balance-wrapper'])}>
        <div className="text-text_color_02 flex items-center">
          <span className="text-xs" onClick={() => setBalanceModalVisible(true)}>
            {label}({currentCoin.quoteSymbolName})
          </span>{' '}
          <Icon hiddenMarginTop name="regsiter_icon_drop" className="text-xs scale-75" hasTheme />
        </div>

        <div className="right balance-number-wrapper">
          <div className="balance-number overflow-ellipsis-flex-1" ref={balanceNumberScaleRef}>
            {isLogin ? formatCurrency(quoteBalance, buyDigit, false) : replaceEmpty()}
          </div>
          <div className="ml-1 text-xs">
            {marginSourceIsAssets ? (
              !isFusionMode && <Icon name="recharge_brand" onClick={clickRecharge} />
            ) : (
              <Icon onClick={toTransfer} name="icon_trade_transfer" />
            )}
          </div>
        </div>
      </div>
      <TradeBottomModal
        title={t`features_trade_future_exchange_balance_5101389`}
        visible={balanceModalVisible}
        destroyOnClose
        onVisibleChange={setBalanceModalVisible}
      >
        <div>
          <MarginSource />
          <div className="pt-4 px-4 pb-10">
            <Button className="rounded" block type="primary" onClick={() => setBalanceModalVisible(false)}>
              {t`common.confirm`}
            </Button>
          </div>
        </div>
      </TradeBottomModal>
      {/* 具体需要从资产那边用组件 */}
      <ActionSheet
        visible={rechargeVisible}
        onCancel={onCancel}
        actions={actions}
        cancelText={t`common.modal.cancel`}
        closeOnClickOverlay
      />
    </>
  )
}
