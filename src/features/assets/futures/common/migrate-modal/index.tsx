/**
 * 合约 - 迁移弹窗组件
 */
import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { Button, Popup, Toast } from '@nbit/vant'
import { useDebounce, useGetState, useUpdateEffect } from 'ahooks'
import Slider from '@/components/slider'
import {
  onChangeInput,
  onChangeSlider,
  onCheckPositionEntrustOrder,
  onGetTradePairDetails,
  onSetPositionOffset,
} from '@/helper/assets/futures'
import { PositionList } from '@/typings/api/assets/futures'
import { FuturesDetailsPositionTypeEnum, getFuturesPositionTypeName } from '@/constants/assets/futures'
import {
  postPerpetualPositionCheckMerge,
  postPerpetualPositionCheckMigrateMargin,
  postPerpetualPositionCheckMinSize,
  postPerpetualPositionMigrate,
  postPerpetualPositionMigrateMargin,
  postPerpetualPositionMigrateSize,
} from '@/apis/assets/futures/position'
import { formatNumberDecimal, removeDecimalZero } from '@/helper/decimal'
import { rateFilter } from '@/helper/assets/spot'
import { SelectGroup } from '@/features/trade/future/select-group'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { requestWithLoading } from '@/helper/order'
import Icon from '@/components/icon'
import { IFutureGroup } from '@/typings/api/future/common'
import { useCommonStore } from '@/store/common'
import TradePriceInput from '@/features/trade/common/price-input'
import { HintModal } from '../hint-modal'
import styles from './index.module.css'
import { PositionModalHeader } from '../position-modal-header'

interface MigrateModalProps {
  positionData: PositionList
  onClose: () => void
  onCommit: () => void
}

function MigrateModal(props: MigrateModalProps) {
  const { onClose, onCommit } = props || {}
  const {
    baseSymbolName,
    quoteSymbolName,
    symbol,
    lever,
    groupId,
    positionId,
    sideInd,
    amountOffset,
    size,
    voucherAmount,
  } = props.positionData
  const {
    futuresCurrencySettings: { currencySymbol, offset = 2 },
  } = useAssetsFuturesStore()
  const { isFusionMode } = useCommonStore()
  const [visible, setVisible] = useState(false)
  const [hintVisible, setHintVisible] = useState(false)
  const [selectVisible, setSelectVisible] = useState(false)
  const [popupProps, setPopupProps] = useState<any>({})
  const [tradePairDetails, setTradePairDetails] = useState<any>({}) // 币对详情
  const [migrateInfo, setMigrateInfo] = useState({
    quantity: '--',
    min: '--',
    max: '--',
  })
  const [form, setForm, getForm] = useGetState({
    size: '', // 迁移数量
    percent: 0,
    margin: '', // 迁移的保证金
    marginPercent: 0,
    group: {} as IFutureGroup & { type: string },
  })
  const [migrateExist, setMigrateExist] = useState(false)

  const debounceSize = useDebounce(form.size, { wait: 200 })

  /**
   * 获取币对详情
   */
  const onloadTradeDetails = async () => {
    setTradePairDetails(await onGetTradePairDetails(symbol))
  }

  /**
   * 获取能迁移的数量
   */
  const onLoadMigrateSize = async () => {
    const res = await postPerpetualPositionMigrateSize({ positionId, fromGroupId: groupId })
    const { isOk, data } = res || {}

    if (!isOk) {
      return
    }

    setMigrateInfo({ ...migrateInfo, quantity: data?.quantity || '' })
  }

  /**
   * 获取能迁移的保证金
   */
  const onLoadMigrateMargin = async () => {
    if (!form.size) {
      setMigrateInfo({ ...migrateInfo, max: '0' })
      return
    }

    const res = await postPerpetualPositionMigrateMargin({ positionId, fromGroupId: groupId, size: form.size })
    const { isOk, data } = res || {}
    if (!isOk || !data) {
      return
    }

    setMigrateInfo({ ...migrateInfo, ...data })
  }

  /**
   * 检查仓位是否存在委托订单
   */
  const onCheckPositionOrder = async () => {
    onCheckPositionEntrustOrder({
      ...props.positionData,
      content: t`features_assets_futures_common_migrate_modal_index_vmrr23j78x`,
      onClose,
      onCommit: e => {
        if (!e.isSuccess) {
          setPopupProps({ ...e })
          setHintVisible(true)
        }
      },
      onLock: () => {
        onLoadMigrateSize()
        setVisible(true)
      },
      onRevokeOrder: () => {
        setHintVisible(false)

        // TODO 撤销订单成功，刷新列表
        onCommit()
      },
    })
  }

  /**
   * 迁移
   */
  const onMigrate = async () => {
    const res = await postPerpetualPositionMigrate({
      positionId,
      fromGroupId: groupId,
      margin: form.margin || '0',
      size: form.size,
      toGroupId: form.group?.groupId || '',
    })

    const { isOk, data } = res || {}
    if (!isOk) return

    Toast.info(
      data?.isSuccess
        ? t`features_orders_future_holding_migrate_716`
        : t`features_assets_futures_common_migrate_modal_index_5101456`
    )
    onCommit()
  }

  /**
   * 检查是否有同方向同杠杆的持仓
   */
  const onCheckMerge = async group => {
    const res = await postPerpetualPositionCheckMerge({
      positionId,
      fromGroupId: groupId,
      toGroupId: group?.groupId,
    })

    const { isOk, data } = res || {}
    if (!isOk || !data) return

    if (data?.lock) {
      Toast.info(t`features_trade_future_exchange_order_5101544`)
      return
    }

    setForm({ ...getForm(), group })
    setMigrateExist(data?.exist)
  }

  /**
   * 检查迁移的保证金
   */
  const onCheckMigrateMargin = async () => {
    const res = await postPerpetualPositionCheckMigrateMargin({
      fromGroupId: groupId,
      positionId,
      ...form,
      margin: form.margin || '0',
    })

    const { isOk, data } = res || {}
    if (!isOk) return

    if (!data?.pass) {
      setPopupProps({
        showIcon: true,
        content: t`features_assets_futures_common_migrate_modal_index_mgbxa7zox94ivx4zwmobp`,
        commitText: t`features_trade_common_notification_index_5101066`,
        onCommit: () => setHintVisible(false),
      })
      setHintVisible(true)
      return
    }

    onMigrate()
  }

  /**
   * 选择合约组前校验
   */
  const onCheckMinSize = async () => {
    if (+voucherAmount > 0 && +form.size < +size) {
      Toast.info(t`features_assets_futures_common_migrate_modal_index_yssce1nsup`)
      return
    }

    const res = await postPerpetualPositionCheckMinSize({
      fromGroupId: groupId,
      positionId,
      size: form.size,
    })

    const { isOk, data } = res || {}
    if (!isOk) return

    if (!data?.pass) {
      Toast.info(t`features_assets_futures_common_migrate_modal_index_5101458`)
      return
    }

    onCheckMigrateMargin()
  }

  /**
   * 选择合约组
   */
  const onSelectGroup = async (id: string, e) => {
    if (!id) {
      return
    }
    requestWithLoading(onCheckMerge(e), 0)
  }

  useEffect(() => {
    onloadTradeDetails()
    onCheckPositionOrder()
  }, [])

  useUpdateEffect(() => {
    onLoadMigrateMargin()
  }, [debounceSize])

  return (
    <>
      {visible && (
        <Popup
          position="bottom"
          visible={visible}
          round
          closeOnPopstate
          safeAreaInsetBottom
          destroyOnClose
          className={styles['migrate-modal-root']}
          onClose={onClose}
        >
          <PositionModalHeader title={t`constants/assets/common-9`} data={props.positionData} onClose={onClose} />
          <div className={'modal-wrapper'}>
            <div className="form-item">
              <div className="form-labels">{t`features_assets_futures_common_migrate_modal_index_umjps7v_cj`}</div>
              <div className="form-input" onClick={() => setSelectVisible(true)}>
                <div
                  className={`${form.group?.groupId || form.group?.type ? 'text-text_color_01' : 'text-text_color_04'}`}
                >
                  {form.group?.groupName ||
                    (form.group?.type
                      ? isFusionMode
                        ? t`constants_order_746`
                        : t`helper_trade_pdclat2njo`
                      : t`features_assets_futures_common_migrate_modal_index_lsdmndpzur`)}
                </div>
                <Icon name="next_arrow" hasTheme />
              </div>
              {migrateExist && (
                <div
                  className="mt-1 text-xs text-text_color_03"
                  dangerouslySetInnerHTML={{
                    __html: t({
                      id: 'features_assets_futures_common_migrate_modal_index_uhycywg3uo',
                      values: {
                        0:
                          sideInd === FuturesDetailsPositionTypeEnum.long
                            ? 'text-buy_up_color'
                            : 'text-sell_down_color',
                        1: `${symbol} ${getFuturesPositionTypeName(sideInd)}${lever}X`,
                      },
                    }),
                  }}
                ></div>
              )}
            </div>

            <div className="form-item">
              <TradePriceInput
                onlyInput
                className="input"
                max={+migrateInfo.quantity}
                value={form.size}
                label={t({
                  id: 'features_assets_futures_common_migrate_modal_index_0j4qvn1uip',
                  values: { 0: baseSymbolName },
                })}
                onChange={(val: string) =>
                  setForm({
                    ...form,
                    size: onSetPositionOffset(val, amountOffset),
                    percent: onChangeSlider(val, migrateInfo.quantity, ''),
                  })
                }
                inputProps={{
                  labelTipContent: form.size
                    ? `≈ ${rateFilter({
                        amount: form.size,
                        symbol: baseSymbolName,
                        rate: quoteSymbolName,
                        showUnit: false,
                        isFormat: true,
                      })} ${quoteSymbolName}`
                    : '',
                }}
              />
              <div className="form-input-hint">
                <span>{t`features_assets_futures_common_migrate_modal_index_5101455`}</span>
                <span className="text-text_color_01 ml-0.5">
                  {removeDecimalZero(formatNumberDecimal(migrateInfo.quantity, tradePairDetails.amountOffset, false))}{' '}
                  {baseSymbolName}
                </span>
              </div>
            </div>

            <div className="form-item form-item-slider">
              <div className="form-labels">{t`features_orders_future_holding_migrate_719`}</div>
              <div className="form-slider">
                <Slider
                  hidePointText
                  value={form.percent}
                  activeColor="var(--brand_color)"
                  showTooltip
                  onChange={(val: number) => {
                    setForm({
                      ...getForm(),
                      percent: val,
                      size: onChangeInput(val, migrateInfo.quantity, true, tradePairDetails.amountOffset),
                    })
                  }}
                />
              </div>
            </div>

            <div className="form-item">
              <TradePriceInput
                onlyInput
                className="input"
                max={+migrateInfo.max}
                value={form.margin}
                label={t({
                  id: 'features_assets_overview_list_futures_futures_list_account_cell_index_xgehgrh1ao',
                  values: { 0: currencySymbol },
                })}
                onChange={(val: string) =>
                  setForm({
                    ...form,
                    margin: onSetPositionOffset(val, offset),
                    marginPercent: onChangeSlider(val, migrateInfo.max),
                  })
                }
              />

              <div className="form-input-hint">
                <span>{t`features_assets_futures_common_migrate_modal_index_5101455`}</span>
                <span className="text-text_color_01 ml-0.5">
                  {removeDecimalZero(formatNumberDecimal(migrateInfo.max, offset, false))} {currencySymbol}
                </span>
              </div>
            </div>

            <div className="form-item form-item-slider">
              <div className="form-labels">{t`features_assets_futures_common_migrate_modal_index_5101345`}</div>
              <div className="form-slider">
                <Slider
                  hidePointText
                  value={form.marginPercent}
                  activeColor="var(--brand_color)"
                  showTooltip
                  onChange={(val: number) => {
                    setForm({
                      ...getForm(),
                      marginPercent: val,
                      margin: onChangeInput(val, migrateInfo.max, true, offset),
                    })
                  }}
                />
              </div>
            </div>

            <Button
              type="primary"
              className="modal-btn"
              disabled={
                !(form.group?.groupId || form.group?.type) ||
                !form.size ||
                Number(form.size) <= 0 ||
                Number(form.size) > Number(migrateInfo.quantity)
              }
              onClick={() => requestWithLoading(onCheckMinSize(), 0)}
            >
              {t`constants/assets/common-9`}
            </Button>
          </div>
        </Popup>
      )}

      {hintVisible && <HintModal visible={hintVisible} {...popupProps} />}

      {selectVisible && (
        <SelectGroup
          visible={selectVisible}
          selectedfutureGroup={form.group}
          onVisibleChange={() => setSelectVisible(false)}
          onSelectOne={onSelectGroup}
          excludeContractGroupId={groupId}
          setCreateNewGroupDetail={(e: any) => {
            setForm({ ...getForm(), group: e })
            setMigrateExist(false)
          }}
        />
      )}
    </>
  )
}

export { MigrateModal }
