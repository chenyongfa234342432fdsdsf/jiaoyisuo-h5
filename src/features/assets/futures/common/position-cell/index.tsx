/**
 * 合约 - 仓位列表单元格组件 (资产 - 持仓详情/交易 - 当前持仓)
 */
import { t } from '@lingui/macro'
import { Button, Toast } from '@nbit/vant'
import Icon from '@/components/icon'
import { IncreaseTag } from '@nbit/react'
import Decimal from 'decimal.js'
import {
  FuturesAutoAddMarginTypeEnum,
  FuturesDetailsPositionTypeEnum,
  FuturesMarketUnitTypeEnum,
  FuturesOrderSideTypeEnum,
  FuturesOrderTypeEnum,
  FuturesPlaceUnitTypeEnum,
  FuturesPositionStatusTypeEnum,
  getFuturesGroupTypeName,
  getStopLimitEntrustTypeName,
  PositionOperateTypeEnum,
  StopLimitEntrustTypeEnum,
  StopLimitStrategyTypeEnum,
  StopLimitTabEnum,
  StopLimitTriggerPriceTypeEnum,
} from '@/constants/assets/futures'
import { oss_svg_image_domain_address } from '@/constants/oss'
import LazyImage from '@/components/lazy-image'
import { Dispatch, SetStateAction, useState } from 'react'
import { PositionList } from '@/typings/api/assets/futures'
import { formatCurrency, formatNumberDecimal, removeDecimalZero } from '@/helper/decimal'
import {
  getPerpetualPositionMaxSizeLimit,
  getPerpetualPositionReverseInfo,
  getPerpetualPositionSymbolSize,
  postPerpetualOrdersPlace,
} from '@/apis/assets/futures/position'
import { useUserStore } from '@/store/user'
import { TradeUnitEnum, UserContractVersionEnum } from '@/constants/trade'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { decimalUtils } from '@nbit/utils'
import { link } from '@/helper/link'
import {
  getAssetsFuturesDetailPageRoutePath,
  getAssetsFuturesTransferPageRoutePath,
  getFutureTradePagePath,
} from '@/helper/route'
import { getFutureGroupMarginSource } from '@/helper/trade'
import { isNumber } from 'lodash'
import { requestWithLoading } from '@/helper/order'
import { AssetsGuideIdEnum } from '@/constants/assets/common'
import { useFutureTradeStore } from '@/store/trade/future'
import { GUIDE_ELEMENT_IDS_ENUM } from '@/constants/guide-ids'
import { CommonDigital } from '@/components/common-digital'
import { TradeDirectionTag } from '../trade-direction-tag'
import { HintModal } from '../hint-modal'
import { LockModal } from '../lock-modal'
import { StopLimitModal } from '../stop-limit-modal'
import { MigrateModal } from '../migrate-modal'
import { ClosePositionModal } from '../close-position-modal'
import styles from './index.module.css'
import { AdjustLeverageModal } from '../adjust-leverage-modal'
import { UnrealizedProfitModal } from '../unrealized-profit-modal'

export enum PositionCellPageTypeEnum {
  /** 详情 */
  details = 'details',
  /** 交易 */
  trade = 'trade',
}

interface PositionCellProps {
  // 是否展示法币单位（兼容融合模式）
  showUnit?: boolean
  idFirst?: boolean
  type?: string
  data: PositionList
  onRefreshing: () => void
  priceType: StopLimitTriggerPriceTypeEnum
  setPriceType: Dispatch<SetStateAction<StopLimitTriggerPriceTypeEnum>>
}

function PositionCell(props: PositionCellProps) {
  const SafeCalcUtil = decimalUtils.SafeCalcUtil

  const { personalCenterSettings } = useUserStore()
  const {
    futuresCurrencySettings: { currencySymbol, offset = 2 },
  } = useAssetsFuturesStore()
  const { tradeUnit } = useFutureTradeStore().settings || {}
  const { type = PositionCellPageTypeEnum.trade, idFirst, priceType, showUnit = true, setPriceType } = props || {}

  const {
    groupId = '',
    positionId,
    symbol = '--',
    lever = '',
    unrealizedProfit = '',
    profitRatio = '',
    size = '',
    groupMargin = '',
    marginRatio = '',
    openPrice = '',
    markPrice = '',
    liquidatePrice = '',
    realizedProfit = '',
    profit = '',
    statusCd = '',
    baseSymbolName = '--',
    quoteSymbolName = '--',
    typeInd = '',
    lockFees = '',
    lockRecord,
    profitLossEntrust,
    sideInd,
    maintMarginRatio = '--',
    tradeId,
    amountOffset,
    priceOffset,
    groupName,
    latestPrice,
    positionOccupyMargin = '',
    voucherAmount = '',
  } = props.data || {}
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupProps, setPopupProps] = useState<any>({
    title: '',
    content: [],
  })
  const [lockVisible, setLockVisible] = useState(false)
  const [stopLimitVisible, setStopLimitVisible] = useState(false)
  const [migrateVisible, setMigrateVisible] = useState(false)
  const [closePositionVisible, setClosePositionVisible] = useState(false)
  const [adjustLeverageVisible, setAdjustLeverageVisible] = useState(false)
  const [unrealizedProfitVisible, setUnrealizedProfitVisible] = useState(false)
  const [stopLimitTab, setStopLimitTab] = useState<number>(StopLimitTabEnum.stopLimit)
  const isLock = statusCd === FuturesPositionStatusTypeEnum.locked

  /**
   * 格式化 usd 数量展示
   */
  const onFormat = (val: string | number, offsetVal: string | number = 2, keepDigits = true) => {
    if (!val) {
      return '--'
    }
    return formatCurrency(val, Number(offsetVal), keepDigits)
  }

  /**
   * 一键反向 - 获取订单方向类型
   */
  const onGetSideInd = () => {
    return (
      {
        [FuturesDetailsPositionTypeEnum.short]: FuturesOrderSideTypeEnum.openLong,
        [FuturesDetailsPositionTypeEnum.long]: FuturesOrderSideTypeEnum.openShort,
      }[sideInd] || ''
    )
  }

  /**
   * 一键反向 - 获取币对持仓数量
   */
  const onGetSymbolPositionSize = async () => {
    const res = await getPerpetualPositionSymbolSize({ tradeId, sideInd, lever })
    const { isOk, data } = res || {}
    if (!isOk) {
      return ''
    }

    return data?.size
  }

  /**
   * 一键反向 - 获取反向开仓信息
   */
  const onGetReverseInfo = async () => {
    const res = await getPerpetualPositionReverseInfo({
      groupId,
      positionId,
      marginType: getFutureGroupMarginSource(groupId),
    })
    const { isOk, data } = res || {}

    if (!isOk) {
      Toast.info(t`features_orders_future_holding_close_5101267`)
      return false
    }

    return data
  }

  /**
   * 获取币对最大可开仓数量
   */
  const onGetMaxSizeLimit = async () => {
    const res = await getPerpetualPositionMaxSizeLimit({ tradeId, lever })
    const { isOk, data } = res || {}

    if (!isOk) return
    return data
  }

  /**
   * 一键反向
   */
  const onReverse = async () => {
    /**
     * 标的币数量*（1+taker 手续费）*对手价 > 可用开仓保证金*杠杆倍数
     */
    const reverseInfo = await onGetReverseInfo()
    if (!reverseInfo) return
    const maxSizeLimit = await onGetMaxSizeLimit()
    // 根据合约价格精度计算数量
    const newSize = removeDecimalZero(formatNumberDecimal(size, +amountOffset, Decimal.ROUND_DOWN))

    if (
      +SafeCalcUtil.mul(
        SafeCalcUtil.mul(size, SafeCalcUtil.add(1, reverseInfo?.takerFeeRate)),
        reverseInfo?.opponentPrice
      ) > +SafeCalcUtil.mul(reverseInfo?.availableOpenMargin, lever)
    ) {
      setPopupProps({
        showIcon: true,
        content: (
          <>
            <div>{t`features_assets_futures_common_position_cell_index_5101441`}</div>
            <div className="text-brand_color">{t`features_assets_futures_common_position_cell_index_5101442`}</div>
          </>
        ),
      })
      setPopupVisible(true)
      return
    }

    if (!(Number(await onGetSymbolPositionSize()) <= Number(maxSizeLimit?.maxSize))) {
      setPopupProps({
        showIcon: true,
        content: t({
          id: 'features_assets_futures_common_position_cell_index_5101444',
          values: { 0: maxSizeLimit?.maxSize, 1: maxSizeLimit?.baseSymbolName },
        }),
      })
      setPopupVisible(true)
      return
    }

    const params = {
      groupId,
      tradeId,
      lever,
      size: newSize,
      additionalMargin: 0,
      typeInd: FuturesOrderTypeEnum.marketOrder,
      entrustTypeInd: StopLimitEntrustTypeEnum.market,
      sideInd: onGetSideInd(),
      marketUnit: FuturesMarketUnitTypeEnum.quantity,
      placeUnit: FuturesPlaceUnitTypeEnum.base,
      marginType: getFutureGroupMarginSource(groupId),
      autoAddMargin: FuturesAutoAddMarginTypeEnum.no,
      initMargin: Number(
        formatNumberDecimal(
          SafeCalcUtil.div(SafeCalcUtil.mul(reverseInfo?.opponentPrice, size), lever),
          offset,
          Decimal.ROUND_DOWN
        )
      ),
    }

    const res = await postPerpetualOrdersPlace(params)
    const { isOk, data, message = '' } = res || {}
    if (!isOk || !data) {
      Toast.info(message || t`features_assets_futures_common_position_cell_index_5101438`)
      return
    }

    Toast.info(t`features_assets_futures_common_position_cell_index_5101439`)
    props.onRefreshing()
  }

  /**
   * 根据合约交易下单单位，折算持仓数量
   * 切换为计价币时=标的币数量*标记价格 （结果保留计价法币精度）
   */
  const onFormatPositionSize = () => {
    if (tradeUnit === TradeUnitEnum.indexBase) {
      return onFormat(size, amountOffset, false)
    } else {
      const positionMargin = `${SafeCalcUtil.mul(size, latestPrice)}`
      return onFormat(positionMargin, offset)
    }
  }

  const onSetPopupInfo = (visible: boolean, params) => {
    if (!visible) return

    setPopupProps({ ...params })
    setPopupVisible(true)
  }

  const infoList = [
    {
      title: showUnit
        ? t({
            id: 'features_assets_futures_common_position_cell_index_5101426',
            values: { 0: tradeUnit === TradeUnitEnum.indexBase ? baseSymbolName : quoteSymbolName },
          })
        : t`features_orders_future_holding_index_590`,
      content: sideInd === FuturesDetailsPositionTypeEnum.short ? `-${onFormatPositionSize()}` : onFormatPositionSize(),
      showHint: showUnit,
      position: 'flex-start',
      popupTitle: t`features_orders_future_holding_index_590`,
      popupContent: t({
        id: 'features_assets_futures_common_position_cell_index_7nvjic1x8ktoyeq4jqyn9',
        values: { 0: quoteSymbolName },
      }),
      style: { width: '36%' },
    },
    {
      title: showUnit
        ? t({
            id: 'features_assets_futures_common_position_cell_index_5101427',
            values: { 0: quoteSymbolName },
          })
        : t`features_assets_futures_common_position_cell_index_mvbgrbu1wy`,
      content: onFormat(positionOccupyMargin, offset),
      position: 'flex-start',
      showHint: true,
      showHintIcon: type !== PositionCellPageTypeEnum.details,
      hintIcon: (
        <Icon
          name="position_transfer"
          hasTheme
          className="mag-icon"
          onClick={e => {
            e.stopPropagation()
            link(getAssetsFuturesTransferPageRoutePath({ groupId }))
          }}
        />
      ),
      popupTitle: t`features_trade_contract_contract_order_item_index_5101494`,
      popupContent: (
        <>
          <div>
            {t`features_assets_futures_common_position_cell_index_rmx1ed8uqv`}
            {onFormat(groupMargin, offset)} {showUnit && quoteSymbolName}
          </div>
          <div>
            {t`features_assets_futures_common_position_cell_index__typoxehey`}
            {onFormat(positionOccupyMargin, offset)} {showUnit && quoteSymbolName}
            {+voucherAmount > 0 &&
              t({
                id: 'features_assets_futures_common_position_cell_index_p0onx1r3zy',
                values: { 0: onFormat(voucherAmount, offset), 1: quoteSymbolName },
              })}
          </div>
        </>
      ),
    },
    {
      title: t`features_orders_future_holding_index_593`,
      content: `${removeDecimalZero(formatNumberDecimal(SafeCalcUtil.mul(marginRatio, 100)))}%`,
      showHint: true,
      position: 'flex-end',
      popupTitle: t`features_orders_future_holding_index_593`,
      popupContent: (
        <>
          <div>
            {t`features_orders_future_holding_index_588`}
            {removeDecimalZero(formatNumberDecimal(SafeCalcUtil.mul(marginRatio, 100)))}%
          </div>
          <div>
            {t`features_orders_future_holding_index_589`}
            {removeDecimalZero(formatNumberDecimal(SafeCalcUtil.mul(maintMarginRatio, 100)))}%
          </div>
        </>
      ),
    },
    {
      title: showUnit
        ? t({
            id: 'features_assets_futures_common_position_cell_index_5101428',
            values: { 0: quoteSymbolName },
          })
        : t`features_assets_futures_futures_details_position_details_list_5101351`,
      content: onFormat(openPrice, priceOffset),
      showHintIcon: !!lockRecord,
      hintIcon: (
        <Icon
          name="msg"
          hasTheme
          className="mag-icon"
          onClick={e => {
            e.stopPropagation()
            onSetPopupInfo(!!lockRecord || false, {
              title: t`features_assets_futures_futures_details_position_details_list_5101351`,
              content: (
                <>
                  <div>{t`features_assets_futures_futures_details_position_details_list_5101355`}</div>
                  <div>
                    {t`features_assets_futures_futures_details_position_details_list_5101356`}
                    <span className="text-brand_color">
                      {onFormat(lockRecord?.lockPrice, priceOffset)} {showUnit && quoteSymbolName}
                    </span>
                  </div>
                  <div>
                    {t`features_orders_future_holding_index_602`}
                    <span className="text-brand_color">
                      {formatNumberDecimal(lockRecord?.fees, offset, true)} {showUnit && quoteSymbolName}
                    </span>
                  </div>
                </>
              ),
            })
          }}
        />
      ),
      position: 'flex-start',
      popupTitle: t`features_assets_futures_futures_details_position_details_list_5101351`,
      popupContent: (
        <>
          <div>{t`features_assets_futures_futures_details_position_details_list_5101355`}</div>
          <div>
            {t`features_assets_futures_futures_details_position_details_list_5101356`}
            <span className="text-brand_color">
              {onFormat(lockRecord?.lockPrice, priceOffset)} {showUnit && quoteSymbolName}
            </span>
          </div>
          <div>
            {t`features_orders_future_holding_index_602`}
            <span className="text-brand_color">
              {formatNumberDecimal(lockRecord?.fees, offset, true)} {showUnit && quoteSymbolName}
            </span>
          </div>
        </>
      ),
      style: { width: '36%' },
    },
    {
      title: showUnit
        ? t({
            id: 'features_assets_futures_common_position_cell_index_5101429',
            values: { 0: quoteSymbolName },
          })
        : t`future.funding-history.index-price.column.mark-price`,
      content: onFormat(markPrice, priceOffset),
      position: 'flex-start',
    },
    {
      title: showUnit
        ? t({
            id: 'features_assets_futures_common_position_cell_index_5101430',
            values: { 0: quoteSymbolName },
          })
        : t`features_assets_futures_futures_details_position_details_list_5101352`,
      content:
        Number(liquidatePrice) > 0 && isNumber(+liquidatePrice)
          ? formatCurrency(
              formatNumberDecimal(
                liquidatePrice,
                +priceOffset,
                sideInd === FuturesDetailsPositionTypeEnum.short ? Decimal.ROUND_HALF_UP : Decimal.ROUND_DOWN
              )
            )
          : '--',
      showHint: true,
      position: 'flex-end',
      popupTitle: t`features_assets_futures_futures_details_position_details_list_5101352`,
      popupContent: t`features_assets_futures_common_position_cell_index_qxjvhkjta_esgt_ptujz7`,
    },
    {
      title: showUnit
        ? t({
            id: 'features_assets_futures_common_position_cell_index_5101431',
            values: { 0: currencySymbol },
          })
        : t`features_assets_futures_futures_details_position_details_list_5101358`,
      content: <IncreaseTag value={realizedProfit} hasPrefix={false} kSign digits={offset} />,
      position: 'flex-start',
      style: { width: '36%' },
    },
    {
      title: showUnit
        ? t({
            id: 'features_assets_futures_common_position_cell_index_5101432',
            values: { 0: currencySymbol },
          })
        : t`features/assets/financial-record/record-detail/record-details-info/index-12`,
      content: <IncreaseTag value={profit} hasPrefix={false} kSign digits={offset} />,
      position: 'flex-start',
    },
  ]

  const buttonList = [
    {
      title: t`constants/assets/common-9`,
      id: PositionOperateTypeEnum.migrate,
      onClick: () => setMigrateVisible(true),
      className: AssetsGuideIdEnum.futuresDetailPositionListMerge,
    },
    {
      title: t`features_assets_futures_futures_details_position_details_list_5101360`,
      id: PositionOperateTypeEnum.reverse,
      onClick: () => {
        onSetPopupInfo(true, {
          title: t`features_assets_futures_futures_details_position_details_list_5101360`,
          content: (
            <>
              <span>
                {t`features_assets_futures_common_position_cell_index_bkl_ehvfg9rcnxedul_ch`}
                <span className="text-brand_color">{t`features_assets_futures_common_position_cell_index_iaxeuvjso_-5qoskxsjhc`}</span>
              </span>
              <div className="mt-2">
                <span>{`${t`features_assets_futures_common_position_cell_index_ylbolbrbc8`}：`}</span>
                <span className="text-brand_color">
                  {onFormatPositionSize()}
                  {quoteSymbolName}
                </span>
              </div>
              <div>
                <span>{`${t`features_future_computer_common_input_control_5oauty3eqs1fnkjg39jo1`}：`}</span>
                <span className="text-brand_color">{getStopLimitEntrustTypeName(StopLimitEntrustTypeEnum.market)}</span>
              </div>
            </>
          ),
          cancelText: t`assets.financial-record.cancel`,
          commitText: t`user.login_04`,
          onCommit: () => {
            setPopupVisible(false)
            requestWithLoading(onReverse(), 0)
          },
          onClose: () => setPopupVisible(false),
        })
      },
      className: AssetsGuideIdEnum.futuresDetailPositionListReverse,
    },
    {
      title: t`constants/assets/common-1`,
      id: PositionOperateTypeEnum.close,
      onClick: () => setClosePositionVisible(true),
      className: GUIDE_ELEMENT_IDS_ENUM.futurePositionListClose,
    },
    {
      title: t`features_orders_future_holding_index_610`,
      id: PositionOperateTypeEnum.strategy,
      onClick: () => {
        setStopLimitTab(StopLimitTabEnum.stopLimit)
        setStopLimitVisible(true)
      },
    },
  ]

  /**
   * 过滤仓位止盈/止损数据展示
   */
  const onFilterStopData = (type: string) => {
    const val = profitLossEntrust.filter(item => {
      return item.strategyTypeInd === type
    })[0]

    return onFormat(val?.triggerPrice, priceOffset)
  }

  return (
    <>
      <div
        className={styles['position-cell-root']}
        onClick={e => {
          if (type !== PositionCellPageTypeEnum.trade) return
          e.stopPropagation()

          link(getAssetsFuturesDetailPageRoutePath(groupId))
        }}
      >
        {isLock && (
          <LazyImage src={`${oss_svg_image_domain_address}bg_futures_bedeck.png`} hasTheme className="lock-img" />
        )}
        <div className="item-header">
          <div className="header-info">
            <div
              className="position-info-cell mb-1.5"
              onClick={e => {
                e.stopPropagation()
                link(getFutureTradePagePath({ symbolName: symbol, selectGroup: groupId }))
              }}
            >
              <span className="position-info-name">
                {symbol} {getFuturesGroupTypeName(typeInd)}
              </span>
              <Icon name="next_arrow" hasTheme className="position-info-next" />
              <TradeDirectionTag
                showFutures={false}
                showEditLever={!isLock}
                sideInd={sideInd}
                lever={lever}
                onClickDirection={() => link(getFutureTradePagePath({ symbolName: symbol, selectGroup: groupId }))}
                onEditLever={() => {
                  if (+voucherAmount > 0) {
                    Toast.info(t`features_assets_futures_common_position_cell_index_24kec67teh`)
                    return
                  }

                  setAdjustLeverageVisible(true)
                }}
              />
            </div>

            <div className="position-info-cell">
              <TradeDirectionTag
                showFutures={type === PositionCellPageTypeEnum.trade}
                showDirection={false}
                showLever={false}
                groupName={groupName}
                onClickName={() => link(getAssetsFuturesDetailPageRoutePath(groupId))}
              />
            </div>
          </div>

          <div
            className="lock-root"
            onClick={e => {
              e.stopPropagation()
              setLockVisible(true)
            }}
            id={idFirst ? AssetsGuideIdEnum.futuresDetailPositionListLock : ''}
          >
            <Icon name={isLock ? 'contract_lock_hover' : 'contract_lock'} hasTheme={!isLock} className="lock-icon" />
            <span className="lock-text">
              {isLock ? t`features_orders_future_holding_index_608` : t`features_orders_future_holding_index_609`}
            </span>
          </div>
        </div>

        <div className="item-header mb-1" style={{ marginBottom: '4px' }}>
          <div className="profit-info">
            <span
              className="info-label"
              onClick={e => {
                e.stopPropagation()
                setUnrealizedProfitVisible(true)
              }}
            >
              {t`features_orders_future_holding_index_603`} {showUnit && `(${currencySymbol})`}
            </span>
            <span className="profit-num">
              <IncreaseTag value={unrealizedProfit} digits={offset} />
            </span>
          </div>

          <div className="profit-info" style={{ alignItems: 'flex-end' }}>
            <span
              className="info-label"
              onClick={e => {
                e.stopPropagation()
                onSetPopupInfo(true, {
                  title: t`features/assets/financial-record/record-detail/record-details-info/index-13`,
                  content: (
                    <>
                      <div>
                        {t`features/assets/financial-record/record-detail/record-details-info/index-12`} ={' '}
                        {t`features_orders_future_holding_index_603`} +{' '}
                        {t`features_assets_futures_futures_details_position_details_list_5101358`}
                      </div>
                      <div>
                        {t`features/assets/financial-record/record-detail/record-details-info/index-13`}{' '}
                        {t`features_assets_futures_common_position_cell_index_laq_o3ei2z_fzvsh1e8sa`} 100 %
                      </div>
                    </>
                  ),
                })
              }}
            >
              {t`features/assets/financial-record/record-detail/record-details-info/index-13`}
            </span>
            <span className="profit-num">
              <IncreaseTag value={profitRatio} digits={2} hasPostfix needPercentCalc />
            </span>
          </div>
        </div>

        <div className="info-list">
          {infoList.map((item, index) => {
            return (
              <div key={index} className={`info-item ${(index + 1) % 3 === 0 && '!mr-0'}`} style={item.style}>
                <div className="info-labels" style={{ justifyContent: item.position }}>
                  <span
                    className="info-label"
                    style={{ borderBottomWidth: item.showHint ? '1px' : '0px' }}
                    onClick={e => {
                      e.stopPropagation()
                      onSetPopupInfo(item.showHint || false, {
                        title: item.popupTitle,
                        content: item.popupContent,
                      })
                    }}
                  >
                    {item.title}
                  </span>
                  {item.showHintIcon && item.hintIcon}
                </div>

                <span className="info-content" style={{ textAlign: item.position === 'flex-start' ? 'start' : 'end' }}>
                  {item.content}
                </span>
              </div>
            )
          })}
        </div>

        {profitLossEntrust && profitLossEntrust.length > 0 && (
          <div className="position-info">
            <span>{t`features_orders_future_holding_index_607`}</span>
            <span className="position-info-num">
              {onFilterStopData(StopLimitStrategyTypeEnum.stopProfit)} /{' '}
              {onFilterStopData(StopLimitStrategyTypeEnum.stopLoss)}
            </span>
            <Icon
              name="icon-redact"
              hasTheme
              className="edit-icon"
              onClick={e => {
                e.stopPropagation()
                setStopLimitTab(StopLimitTabEnum.positionStopLimit)
                setStopLimitVisible(true)
              }}
            />
          </div>
        )}

        <div className="list-bottom">
          {buttonList.map(buttonItem => {
            if (
              personalCenterSettings.perpetualVersion !== UserContractVersionEnum.professional &&
              buttonItem.id === PositionOperateTypeEnum.migrate
            ) {
              return
            }
            return (
              <Button
                key={buttonItem.id}
                size="small"
                className={`bottom-btn ${isLock && 'btn-disable'} ${idFirst && buttonItem.className}`}
                onClick={e => {
                  e.stopPropagation()
                  if (isLock) {
                    Toast.info(t`features_assets_futures_common_position_cell_index_5101440`)
                    return
                  }

                  buttonItem.onClick()
                }}
              >
                {buttonItem.title}
              </Button>
            )
          })}
        </div>
      </div>

      {popupVisible && (
        <HintModal
          visible={popupVisible}
          title={popupProps.title}
          content={popupProps.content}
          onCommit={() => setPopupVisible(false)}
          {...popupProps}
        />
      )}

      {lockVisible && (
        <LockModal
          positionData={props.data}
          onClose={() => setLockVisible(false)}
          onLockSuccess={() => {
            setLockVisible(false)
            props.onRefreshing()
          }}
        />
      )}
      {migrateVisible && (
        <MigrateModal
          positionData={props.data}
          onClose={() => setMigrateVisible(false)}
          onCommit={() => {
            setMigrateVisible(false)
            props.onRefreshing()
          }}
        />
      )}
      {closePositionVisible && (
        <ClosePositionModal
          positionData={props.data}
          visible={closePositionVisible}
          onClose={() => setClosePositionVisible(false)}
          onCommit={() => {
            setClosePositionVisible(false)
            props.onRefreshing()
          }}
        />
      )}
      {stopLimitVisible && (
        <StopLimitModal
          positionData={props.data}
          visible={stopLimitVisible}
          type={stopLimitTab}
          onClose={() => setStopLimitVisible(false)}
          onCommit={() => {
            setStopLimitVisible(false)
            props.onRefreshing()
          }}
        />
      )}
      {adjustLeverageVisible && (
        <AdjustLeverageModal
          positionData={props.data}
          onClose={() => setAdjustLeverageVisible(false)}
          onCommit={() => {
            setAdjustLeverageVisible(false)
            props.onRefreshing()
          }}
        />
      )}
      <UnrealizedProfitModal
        showUnit={showUnit}
        visible={unrealizedProfitVisible}
        onClose={() => setUnrealizedProfitVisible(false)}
        currencySymbol={currencySymbol}
        lockFees={lockFees}
        unrealizedProfit={unrealizedProfit}
        offset={offset}
        priceType={priceType}
        setPriceType={setPriceType}
      />
    </>
  )
}

export { PositionCell }
