import NotLogin from '@/components/not-login'
import { useTradeStore } from '@/store/trade'
import { t } from '@lingui/macro'
import { useEffect, useState, useRef } from 'react'
import classNames from 'classnames'
import { FutureSettingOrderAreaPositionEnum } from '@/constants/future/settings'
import { getIsLogin } from '@/helper/auth'
import { link } from '@/helper/link'
import { IFutureGroup } from '@/typings/api/future/common'

import { useFutureTradeIsOpened, useTradeCurrentFutureCoin } from '@/hooks/features/trade'
import { useCountDown } from 'ahooks'
import { useFutureTradeStore } from '@/store/trade/future'
import { fillZero, getFutureFundingRateNextDate } from '@/helper/date'
import { getFutureFundingRatePagePath, getOpenFuturePagePath } from '@/helper/route'
import { formatNumberDecimalWhenExceed } from '@/helper/decimal'
import { FutureHelpCenterEnum } from '@/constants/future/future-const'
import { useHelpCenterUrl } from '@/hooks/use-help-center-url'
import Icon from '@/components/icon'
import { GUIDE_ELEMENT_IDS_ENUM } from '@/constants/guide-ids'
import { getFutureGroupNameDisplay } from '@/helper/trade'
import { activeFuture } from '@/helper/future'
import PopupHeader from '@/components/popup-header'
import { OnlyOnePopup } from '@/components/only-one-overlay'
import { Button, Swiper, Toast } from '@nbit/vant'
import { useScaleDom } from '@/hooks/use-scale-dom'
import { envIsServer } from '@/helper/env'
import DynamicLottie from '@/components/dynamic-lottie'
import { useExchangeContext } from '../common/exchange/context'
import TradeFormItemBox from '../common/form-item-box'
import Lever from '../common/lever'
import FutureNotAvailable from './not-available'
import styles from './header.module.css'
import { SelectGroup } from './select-group'
import UnderlineTip from '../common/underline-tip'

function FundingRate() {
  const currentFutureCoin = useTradeCurrentFutureCoin()
  const targetDate = getFutureFundingRateNextDate(currentFutureCoin.cycle || '', currentFutureCoin.settlementRules!)
  let [, { hours, minutes, seconds }] = useCountDown({
    targetDate,
  })
  const toFundingHistory = () => {
    link(
      getFutureFundingRatePagePath({
        tradeId: currentFutureCoin.id,
      })
    )
  }
  const fundingRateUrl = useHelpCenterUrl(FutureHelpCenterEnum.fundingRate)

  return (
    <div className="text-right">
      <UnderlineTip
        title={t`future.funding-history.funding-rate.column.rate`}
        moreLink={fundingRateUrl}
        onOk={toFundingHistory}
        confirmButtonText={t`features_trade_future_header_5101386`}
        popup={<div>{t`features_trade_future_header_5101387`}</div>}
        className="text-text_color_02"
      >
        <span className="text-xs">{t`features_trade_future_header_5101388`}</span>
      </UnderlineTip>
      <div className="text-xs mt-px font-medium">
        <span>{formatNumberDecimalWhenExceed((currentFutureCoin.assetFeeRate || 0) * 100, 4) || '0.00'}%</span>
        <span className="mx-1">/</span>
        <span>
          {fillZero(hours)}:{fillZero(minutes)}:{fillZero(seconds)}
        </span>
      </div>
    </div>
  )
}

function AccountTip({ onClose }) {
  const tips = [
    {
      img: 'trade/future_account_tip_1',
      desc: t`features_trade_future_header_i4dybfhype`,
    },
    {
      img: 'trade/future_account_tip_2',
      desc: t`features_trade_future_header_6ftfc7bhqj`,
    },
    {
      img: 'trade/future_account_tip_3',
      desc: t`features_trade_future_header_wcsn7ls16w`,
    },
  ]
  return (
    <div className={styles['account-tips-wrapper']}>
      <PopupHeader title={t`features_trade_future_header_n7dfzateyj`} onClose={onClose} />
      <div className="px-4 pt-2 mb-6">
        <Swiper>
          {tips.map(tip => {
            return (
              <Swiper.Item key={tip.desc}>
                <div className="pb-4">
                  <div className="flex w-full h-48 items-center justify-center  mb-2 rounded-lg">
                    <DynamicLottie hasTheme animationData={tip.img} loop />
                  </div>
                  <p>{tip.desc}</p>
                </div>
              </Swiper.Item>
            )
          })}
        </Swiper>
      </div>
      <div className="px-4 pb-10">
        <Button block type="primary" onClick={onClose}>
          {t`features_trade_common_notification_index_5101066`}
        </Button>
      </div>
    </div>
  )
}

export function FutureGroupSelect({ groupNameAutoScale = true }) {
  const { tradeInfo } = useExchangeContext()
  const { futureGroups } = useFutureTradeStore()
  const futureEnabled = useFutureTradeIsOpened()
  const [selectGroupVisible, setSelectGroupVisible] = useState(false)
  const accountTipRef = useRef<Record<'openAccountTip', () => void>>()
  const onClick = () => {
    if (!getIsLogin()) {
      link('/login')
      // 合约开通状态
    } else if (!futureEnabled) {
      activeFuture()
    } else {
      setSelectGroupVisible(true)
    }
  }

  const openAccountTipChange = e => {
    e.stopPropagation()
    accountTipRef.current?.openAccountTip()
  }
  const [accountTipVisible, setAccountTipVisible] = useState(false)
  const showAccountTip = e => {
    e.stopPropagation()
    setAccountTipVisible(true)
  }
  const groupScaleRef = useScaleDom((envIsServer ? 0 : window.innerWidth * 0.5) - 114, tradeInfo.group)

  return (
    <TradeFormItemBox onClick={onClick} className="h-26 !py-0 flex items-center justify-between">
      <NotLogin className="text-sm pl-1" notLoginNode={t`features/trade/future/future-trade/index-0`}>
        <FutureNotAvailable
          className="text-sm flex flex-1 justify-between items-center pl-1"
          placeNode={<div className="w-full text-center font-medium">{t`features/trade/future/header-0`}</div>}
        >
          <OnlyOnePopup visible={accountTipVisible} position="bottom">
            <AccountTip onClose={() => setAccountTipVisible(false)} />
          </OnlyOnePopup>
          <div
            className={classNames('flex flex-1 items-center mr-2', {
              [styles['group-name-in-trade-modal']]: !groupNameAutoScale,
            })}
          >
            <Icon onClick={showAccountTip} hiddenMarginTop name="msg" className="text-xs mr-2" hasTheme />
            <div
              className={classNames('font-medium overflow-ellipsis-flex-1', {
                '!w-auto': !groupNameAutoScale,
              })}
            >
              {getFutureGroupNameDisplay(tradeInfo.group?.groupName)}
            </div>
          </div>

          <Icon hiddenMarginTop name="regsiter_icon_drop" className="text-xs scale-75" hasTheme />
        </FutureNotAvailable>
      </NotLogin>
      {/* <AccountTip ref={accountTipRef} /> */}
      <SelectGroup futureGroupModeClick visible={selectGroupVisible} onVisibleChange={setSelectGroupVisible} />
    </TradeFormItemBox>
  )
}

export function FutureLever() {
  const { tradeInfo, onLeverChange } = useExchangeContext()
  const currentFutureCoin = useTradeCurrentFutureCoin()
  const name = t({
    id: 'features/trade/future/header-1',
    values: {
      name: `${currentFutureCoin.symbolName}`,
    },
  })
  const [lever, setLever] = useState(tradeInfo.lever)
  useEffect(() => {
    setLever(tradeInfo.lever)
  }, [tradeInfo.lever])
  const onOk = () => {
    onLeverChange(lever)
  }

  return (
    <div id={GUIDE_ELEMENT_IDS_ENUM.futureLever}>
      <Lever
        buySymbol={currentFutureCoin.quoteSymbolName || ''}
        sellSymbol={currentFutureCoin.baseSymbolName || ''}
        onOk={onOk}
        leverList={currentFutureCoin.tradePairLeverList || []}
        name={name}
        currentValue={tradeInfo.lever}
        value={lever}
        onChange={setLever}
      />
    </div>
  )
}

function FutureExchangeHeader() {
  const { generalSettings } = useTradeStore()

  return (
    <div className="px-4 pb-">
      <div className={classNames(styles['future-trade-header-wrapper'])}>
        <div
          className={classNames('left', {
            'order-1 ml-4': generalSettings.orderAreaPosition === FutureSettingOrderAreaPositionEnum.right,
            'mr-4': generalSettings.orderAreaPosition === FutureSettingOrderAreaPositionEnum.left,
          })}
        >
          <div id={GUIDE_ELEMENT_IDS_ENUM.futureTradeGroup} className="mr-2 flex-1 whitespace-nowrap">
            <FutureGroupSelect />
          </div>
          <FutureLever />
        </div>
        <div className="right">
          <FundingRate />
        </div>
      </div>
    </div>
  )
}

export default FutureExchangeHeader
