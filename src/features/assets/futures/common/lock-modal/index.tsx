/**
 * 合约 - 锁仓弹窗组件
 */

import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { Button, CountDown, Popover, Popup, Toast } from '@nbit/vant'
import Icon from '@/components/icon'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import {
  getPerpetualLockPositionSetting,
  postPerpetualPositionCheckLock,
  postPerpetualPositionLock,
  postPerpetualPositionLockFee,
} from '@/apis/assets/futures/position'
import { FuturesLockPositionSettingResp, PositionList, PositionLockFeeResp } from '@/typings/api/assets/futures'
import { onChangeInput, onCheckPositionEntrustOrder } from '@/helper/assets/futures'
import { FuturesPositionStatusTypeEnum, getFuturesGroupTypeName } from '@/constants/assets/futures'
import { decimalUtils } from '@nbit/utils'
import Slider from '@/components/slider'
import { requestWithLoading } from '@/helper/order'
import { useDebounce, useUpdateEffect } from 'ahooks'
import { TradeDirectionTag } from '../trade-direction-tag'
import styles from './index.module.css'
import { HintModal } from '../hint-modal'
import { PositionModalHeader } from '../position-modal-header'

interface LockModalProps {
  positionData: PositionList
  onClose: () => void
  onLockSuccess: () => void
}

function LockModal(props: LockModalProps) {
  const { positionData, onClose, onLockSuccess } = props || {}
  const { positionId, groupId, tradeId, typeInd, statusCd, lockSize, lockPercent, amountOffset } = positionData
  const {
    assetsFuturesSetting,
    futuresCurrencySettings: { currencySymbol },
    updateAssetsFuturesSetting,
  } = useAssetsFuturesStore()
  const [visible, setVisible] = useState(false)
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupProps, setPopupProps] = useState<any>({
    title: '',
    content: [],
  })
  const [percent, setPercent] = useState(+decimalUtils.SafeCalcUtil.mul(lockPercent, 100) || 1)
  const [lockFeeInfo, setLockFeeInfo] = useState<PositionLockFeeResp>({
    fee: '',
    nextTime: 0,
    predictFee: '',
  })
  const [lockSetting, setLockSetting] = useState<FuturesLockPositionSettingResp>({ interval: 0, fees: '' })
  const [isFirst, setIsFirst] = useState(true)
  const debouncePercent = useDebounce(percent, { wait: 200 })

  /**
   * 锁仓
   */
  const onLockPosition = async () => {
    const newSize = percent > 0 ? +onChangeInput(percent, positionData.size, true, amountOffset) : 0
    if (statusCd === FuturesPositionStatusTypeEnum.opened && newSize <= 0) {
      Toast.info(t`features_assets_futures_common_lock_modal_index_5101540`)
      return
    }

    const res = await postPerpetualPositionLock({
      positionId,
      groupId,
      size: `${newSize}`,
      percent: `${decimalUtils.SafeCalcUtil.div(percent, 100)}`,
    })
    const { isOk, data } = res || {}
    if (!isOk) return

    if (!data?.isSuccess) {
      Toast.info(
        statusCd === FuturesPositionStatusTypeEnum.locked
          ? t`features_assets_futures_common_lock_modal_index_5101436`
          : t`features_assets_futures_common_lock_modal_index_5101437`
      )
      return
    }

    Toast.info(
      statusCd === FuturesPositionStatusTypeEnum.locked
        ? t`features_orders_future_holding_lock_position_699`
        : t`features_orders_future_holding_lock_position_700`
    )
    onLockSuccess()
  }

  /**
   * 计算锁仓费用等信息
   */
  const onLoadLockFee = async () => {
    const res = await postPerpetualPositionLockFee({
      positionId,
      groupId,
      size: debouncePercent > 0 ? `${onChangeInput(debouncePercent, positionData.size, true, amountOffset)}` : '0',
    })

    const { isOk, data, message = '' } = res || {}
    if (!isOk) {
      Toast.info(message)
      return
    }

    setLockFeeInfo(data as PositionLockFeeResp)
  }

  /**
   * 检查能否锁仓
   */
  const onCheckLock = async () => {
    if (statusCd === FuturesPositionStatusTypeEnum.locked) {
      onLoadLockFee()
      setVisible(true)
      setIsFirst(false)
      return
    }

    const res = await postPerpetualPositionCheckLock({
      positionId,
      groupId,
    })

    const { isOk, data, message = '' } = res || {}
    if (!isOk) {
      Toast.info(message)
      onClose()
      return
    }

    if (!data?.pass) {
      Toast.info(t`features_assets_futures_common_lock_modal_index_5101434`)
      onClose()
      return
    }

    setVisible(true)
    onLoadLockFee()
  }

  /**
   * 检测仓位是否存在当前委托订单
   */
  const onCheckPositionOrder = async () => {
    onCheckPositionEntrustOrder({
      ...positionData,
      content: t`features_assets_futures_common_lock_modal_index_7opxmzax6orvoiogdwm03`,
      onClose,
      onCommit: e => {
        if (!e.isSuccess) {
          setPopupProps({ ...e })
          setPopupVisible(true)
        }
      },
      onLock: () => onCheckLock(),
      onRevokeOrder: () => {
        setPopupVisible(false)
        onLockSuccess()
      },
    })
  }

  /**
   * 是否展示一键锁仓功能说明弹窗
   */
  const onShowLockIL = async () => {
    const res = await getPerpetualLockPositionSetting({ tradeId })

    const { isOk, data, message = '' } = res || {}
    if (!isOk) {
      Toast.info(message)
      return
    }

    setLockSetting(data as FuturesLockPositionSettingResp)

    if (assetsFuturesSetting.isFirstLock) {
      const { interval = '--', fees = '--' } = data || {}
      setPopupProps({
        title: t`features_trade_future_settings_price_protect_642`,
        content: (
          <>
            <div>{t`features_orders_future_holding_lock_position_701`}</div>
            <div>
              {t({
                id: 'features_assets_futures_common_lock_modal_index_hmkrigmucj',
                values: { 0: fees, 1: interval, 2: interval, 3: interval },
              })}
            </div>
          </>
        ),
        onCommit: () => {
          setPopupVisible(false)
          updateAssetsFuturesSetting({ isFirstLock: false })
          onCheckPositionOrder()
        },
      })

      setPopupVisible(true)
    } else {
      onCheckPositionOrder()
    }
  }

  useEffect(() => {
    onShowLockIL()
  }, [])

  useUpdateEffect(() => {
    onLoadLockFee()
  }, [debouncePercent])

  const onRenderHintPopover = () => {
    return (
      <Popover
        placement="bottom"
        theme="dark"
        reference={<Icon name="msg" className="msg-icon px-2" />}
        className={styles['lock-hint-popover-root']}
      >
        {t({
          id: 'features_assets_futures_common_lock_modal_index_5101435',
          values: {
            0: statusCd === FuturesPositionStatusTypeEnum.locked && isFirst ? '0' : lockSetting?.interval,
          },
        })}
      </Popover>
    )
  }

  const onRenderButton = () => {
    const unlock = statusCd === FuturesPositionStatusTypeEnum.locked && percent === 0
    return (
      <Button
        className={`modal-btn ${unlock && 'lifted-btn'}`}
        type={`${unlock ? 'default' : 'primary'}`}
        onClick={() => requestWithLoading(onLockPosition(), 0)}
        disabled={statusCd === FuturesPositionStatusTypeEnum.opened && percent === 0}
      >
        {unlock
          ? t`features_assets_futures_common_lock_modal_index_5101473`
          : t`features_orders_future_holding_lock_position_710`}
      </Button>
    )
  }

  return (
    <>
      <Popup
        className={styles['lock-modal-root']}
        position="bottom"
        visible={visible}
        round
        closeOnPopstate
        safeAreaInsetBottom
        destroyOnClose
        onClose={onClose}
      >
        <PositionModalHeader
          title={t`features_orders_future_holding_index_609`}
          data={positionData}
          onClose={onClose}
        />

        <div className="lock-modal-wrapper">
          <div className="info-item">
            <span>
              {t`features_orders_future_holding_lock_position_704`}{' '}
              <span style={{ color: 'var(--sell_down_color)' }}>
                {lockFeeInfo?.fee} {currencySymbol}
              </span>{' '}
              {t`features_orders_future_holding_lock_position_705`}
              {onRenderHintPopover()}
            </span>
          </div>

          <div className="info-item flex items-center">
            {t`features_orders_future_holding_lock_position_706`}{' '}
            {Number(lockSize) > 0 && lockFeeInfo?.nextTime ? (
              <CountDown
                time={Number(decimalUtils.SafeCalcUtil.sub(lockFeeInfo?.nextTime, new Date().getTime()))}
                millisecond
                format="mm:ss"
                onFinish={() => onLoadLockFee()}
              >
                {timeData => (
                  <>
                    <span className="count-down-block">{timeData.minutes}</span>
                    <span className="count-down-colon">:</span>
                    <span className="count-down-block">{timeData.seconds}</span>
                  </>
                )}
              </CountDown>
            ) : (
              <>
                <span className="count-down-block">{lockSetting.interval}</span>
                <span className="count-down-colon">:</span>
                <span className="count-down-block">00</span>
              </>
            )}
          </div>
          <div className="info-item mb-0">
            {t`features_orders_future_holding_lock_position_707`} {`${lockFeeInfo?.predictFee} ${currencySymbol}`}
          </div>

          <div className="setting">
            <div>
              {t`features_orders_future_holding_lock_position_708`}
              <span className="hint">{t`features_assets_futures_common_lock_modal_index_5101368`}</span>
              {t`features/trade/common/lever/index-1`} {percent}%
            </div>
            <div className="slider">
              <Slider
                value={percent}
                activeColor="var(--success_color)"
                hidePointText
                points={[0, 25, 50, 75, 100]}
                showTooltip
                onChange={(val: number) => setPercent(val)}
              />
            </div>

            {/* TODO: UI 改了交互，实现还有问题待完善 */}
            {/* <LockSlider value={percent} onChange={val => setPercent(val)} onChangeAfter={onLoadLockFee} /> */}
          </div>

          {onRenderButton()}
        </div>
      </Popup>

      {popupVisible && <HintModal visible={popupVisible} {...popupProps} />}
    </>
  )
}

export { LockModal }
