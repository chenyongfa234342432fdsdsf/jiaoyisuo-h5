import { t } from '@lingui/macro'
import { useState } from 'react'
import { useMount } from 'ahooks'
import Icon from '@/components/icon'
import {
  OrderingUnitEnum,
  DepthColorBlockEnum,
  getOrderingUnitEnumName,
  FutureSettingKLinePositionEnum,
  FutureSettingOrderAreaPositionEnum,
  getFutureSettingKLinePositionEnumName,
  getFutureSettingDepthColorBlockEnumName,
  getFutureSettingOrderAreaPositionEnumName,
} from '@/constants/future/settings'
import { activeFuture } from '@/helper/future'
import { useCommonStore } from '@/store/common'
import { UserUpsAndDownsColorEnum } from '@/constants/user'
import Link from '@/components/link'
import { link } from '@/helper/link'
import NavBar from '@/components/navbar'
import { useUserStore } from '@/store/user'
import { useTradeStore } from '@/store/trade'
import { getMemberBaseSettingsInfo } from '@/apis/user'
import { setUserAutoMarginInfo } from '@/apis/trade'
import { Cell, Popover, Switch, Dialog, Toast } from '@nbit/vant'
import NoDataImage from '@/components/no-data-image'
import { AuthModuleEnum, getAuthModuleStatusByKey } from '@/helper/modal-dynamic'
import { useFutureTradeStore } from '@/store/trade/future'
import { useFutureVersionIsPro } from '@/hooks/features/trade'
import {
  contractStatusIndEnum,
  PersonProtectTypeEnum,
  UserContractVersionEnum,
  PriceProtectTypeEnum,
  TradeUnitMap,
  TradeUnitMapReverse,
} from '@/constants/trade'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { SelectSheet } from '@/features/trade/future/settings/component/select-sheet'
import { OrderingUnit } from '@/features/trade/future/settings/component/ordering-unit'
import LazyImage from '@/components/lazy-image'
import styles from './index.module.css'

function KLineSetting() {
  const KLineImageSrc = {
    0: 'contract_top_display',
    1: 'contract_bottom_display',
    2: 'contract_do_not_display',
  }

  const actions = [
    FutureSettingKLinePositionEnum.top,
    FutureSettingKLinePositionEnum.bottom,
    FutureSettingKLinePositionEnum.none,
  ].map(type => ({
    value: type,
    src: KLineImageSrc[type],
    name: getFutureSettingKLinePositionEnumName(type),
  }))
  const { generalSettings } = useTradeStore()
  const onChange = (value: FutureSettingKLinePositionEnum) => {
    generalSettings.updateKLinePosition(value)
  }

  return (
    <SelectSheet
      value={generalSettings.kLinePosition}
      actions={actions}
      onChange={onChange}
      triggerElement={
        <Cell
          isLink
          title={
            <div onClick={e => e.stopPropagation()}>
              <span className="mr-2">{t`features_trade_future_settings_index_624`}</span>
              <Popover
                placement="top-start"
                offset={[-9, 24]}
                theme="dark"
                reference={<Icon name="msg" className="page-wrapper-icon" />}
              >
                <div className="text-sm" style={{ maxWidth: '90vw' }}>
                  {t`features_trade_future_settings_index_623`}
                </div>
              </Popover>
            </div>
          }
          value={getFutureSettingKLinePositionEnumName(generalSettings.kLinePosition)}
          className="text-base"
        />
      }
    />
  )
}
function OrderAreaSetting() {
  const OrderAreaSettingImageSrc = {
    0: 'contract_left_side',
    1: 'contract_right_side',
  }
  const actions = [FutureSettingOrderAreaPositionEnum.left, FutureSettingOrderAreaPositionEnum.right].map(type => {
    return {
      name: getFutureSettingOrderAreaPositionEnumName(type),
      src: OrderAreaSettingImageSrc[type],
      value: type,
    }
  })
  const { generalSettings } = useTradeStore()
  const onChange = (value: FutureSettingOrderAreaPositionEnum) => {
    generalSettings.updateOrderAreaPosition(value)
  }

  return (
    <SelectSheet
      value={generalSettings.orderAreaPosition}
      actions={actions}
      onChange={onChange}
      triggerElement={
        <Cell
          title={
            <div onClick={e => e.stopPropagation()}>
              <span className="mr-2">{t`features_trade_future_settings_index_625`}</span>
              <Popover
                placement="top-start"
                offset={[-9, 4]}
                theme="dark"
                reference={<Icon name="msg" className="page-wrapper-icon" />}
              >
                <div className="text-sm" style={{ maxWidth: '90vw' }}>
                  {t`features_trade_future_settings_index_623`}
                </div>
              </Popover>
            </div>
          }
          value={getFutureSettingOrderAreaPositionEnumName(generalSettings.orderAreaPosition)}
          isLink
          className="text-base"
        />
      }
    />
  )
}

function DepthColorBlockSetting() {
  const DepthImageSrc = {
    1: 'depth_cumulative',
    2: 'depth_single',
  }
  const { generalSettings } = useTradeStore()
  const actions = [DepthColorBlockEnum.grandTotal, DepthColorBlockEnum.single].map(type => {
    return {
      value: type,
      name: getFutureSettingDepthColorBlockEnumName(type),
      src: DepthImageSrc[type],
    }
  })
  const onChange = (value: DepthColorBlockEnum) => {
    generalSettings.updateDepthColorBlock(value)
  }

  return (
    <SelectSheet
      value={generalSettings.depthColorBlock}
      actions={actions}
      onChange={onChange}
      triggerElement={
        <Cell
          isLink
          className="text-base"
          title={<span className="mr-2">{t`features_trade_future_settings_index_ddqr0hy10w7srsf1ulrq3`}</span>}
          value={getFutureSettingDepthColorBlockEnumName(generalSettings.depthColorBlock)}
        />
      }
    />
  )
}

/** 合约下单单位* */
function OrderingUnitSetting() {
  const { settings } = useFutureTradeStore()
  const actions = [OrderingUnitEnum.buy, OrderingUnitEnum.sell].map(type => {
    return {
      value: type,
      name: getOrderingUnitEnumName(type),
    }
  })

  const setUnitList = async (value: OrderingUnitEnum) => {
    Toast.info(t`features_user_personal_center_settings_converted_currency_index_587`)
    settings.updateTradeUnit(TradeUnitMap[value])
  }

  const onChange = (value: OrderingUnitEnum) => {
    setUnitList(value)
  }

  useMount(() => {
    settings.fetchTradeUnitSetting()
  })

  return (
    <OrderingUnit
      value={TradeUnitMapReverse[settings.tradeUnit]}
      actions={actions}
      onChange={onChange}
      triggerElement={
        <Cell
          isLink
          className="text-base"
          title={<span className="mr-2">{t`features_trade_future_settings_index_r5pchvjfdz`}</span>}
          value={getOrderingUnitEnumName(TradeUnitMapReverse[settings.tradeUnit])}
        />
      }
    />
  )
}

function FutureSettings() {
  const userStore = useUserStore()
  const { personalCenterSettings } = useUserStore()
  const { isFusionMode } = useCommonStore()
  const isPro = useFutureVersionIsPro()
  const { colors } = personalCenterSettings
  const contractStatusInd = personalCenterSettings.isOpenContractStatus
  const [loading, setLoading] = useState<boolean>(false)
  const { preferenceSettings, setPreference, isAutomaticMarginCall, setAutomaticMarginCall } = useFutureTradeStore()

  const onChange = async (value: boolean) => {
    if (loading) return
    setLoading(true)
    const { isOk, data } = await setUserAutoMarginInfo({
      isAutoAdd: value ? PersonProtectTypeEnum.open : PersonProtectTypeEnum.close,
    })
    if (isOk && data) {
      setPreference()
      if (!isAutomaticMarginCall) {
        setAutomaticMarginCall()
        await Dialog.confirm({
          cancelButtonText: t`features_trade_future_settings_margin_index_646`,
          confirmButtonText: t`user.account_security.google_01`,
          message: (
            <div className="add-modal-wrap">
              <LazyImage src={`${oss_svg_image_domain_address}tis`} imageType={'.svg'} className="modal-wrap-icon" />
              <div>{t`features_trade_future_settings_index_yaltcj8sx_`}</div>
            </div>
          ),
          className: styles['auto-add-modal'],
        })
        link('/future/settings/margin/auto-detail')
      }
    }
    setLoading(false)
  }

  const getCurrentVersion = async () => {
    const { data, isOk } = await getMemberBaseSettingsInfo({})
    if (isOk && data) {
      userStore.setPersonalCenterSettings({ perpetualVersion: data?.perpetualVersion })
    }
  }

  useMount(() => {
    getCurrentVersion()
  })

  // /** 自动关闭逐仓* */
  // const onIsolatedMargin = async (value: boolean) => {
  //   if (show) return
  //   setShow(true)
  //   const { isOk, data } = await setUserAutoMarginInfo({
  //     autoCloseIsolatedPosition: value ? IsolatedMarginEnum.open : IsolatedMarginEnum.close,
  //   })
  //   if (isOk && data) {
  //     setPreference()
  //   }
  //   setShow(false)
  // }

  return (
    <div className={styles['index-page-wrapper']}>
      <NavBar title={t`features/trade/future/exchange-14`} left={<Icon name="back" hasTheme />} />
      <div className="page-wrapper-cell">
        <div className="px-4 pt-4 pb-2 text-sm text-text_color_02 font-medium">{t`features_trade_future_settings_index_510281`}</div>
        <Cell
          isLink
          className="page-wrapper-cell-item"
          onClick={() => link('/future/settings/order-confirm')}
        >{t`features_trade_future_settings_index_631`}</Cell>
        <KLineSetting />
        <OrderAreaSetting />
        {!isFusionMode && (
          <Cell
            title={t`user.account_security.settings_03`}
            isLink
            value={
              colors === UserUpsAndDownsColorEnum.greenUpRedDown
                ? t`features_user_personal_center_settings_colors_index_510246`
                : t`user.account_security.settings_04`
            }
            onClick={() => link('/personal-center/settings/colors')}
          />
        )}
        <DepthColorBlockSetting />
      </div>
      {getAuthModuleStatusByKey(AuthModuleEnum.contract) && (
        <div className="future-wrapper-cell">
          <div className="h-1 bg-line_color_02" />
          <div className="px-4 pt-4 pb-2 text-sm text-text_color_02 font-medium">{t`features_trade_future_settings_index_510282`}</div>
          {contractStatusInd === contractStatusIndEnum.yes ? (
            <>
              <Cell
                isLink
                title={t`features/trade/future/settings/select-version-9`}
                value={
                  preferenceSettings?.perpetualVersion === UserContractVersionEnum.professional
                    ? t`features/trade/future/settings/select-version-1`
                    : t`features_c2c_advertise_advertise_history_index_vyu3ktdhjvdhm1vr-_iav`
                }
                onClick={() => link('/future/settings/select-version')}
              />
              <Cell
                isLink
                title={t`features/trade/future/settings/margin-coin-2`}
                onClick={() => link('/future/settings/margin-coin')}
              />
              <OrderingUnitSetting />
              <Cell
                isLink
                title={t`features_trade_future_settings_index_5101354`}
                value={preferenceSettings?.clearCoinSymbol}
                onClick={() => link('/future/settings/settlement-currency')}
              />
              {/* {isPro && (
              <Cell
                isLink
                title={t`features_trade_future_settings_margin_index_655`}
                value={
                  preferenceSettings.retrieveWay === FutureSettingPEnum.auto
                    ? t`features_trade_future_settings_margin_index_651`
                    : t`features_trade_future_settings_margin_index_653`
                }
                onClick={() => link('/future/settings/retrieval-method')}
              />
            )} */}
              {/* {isPro && (
              <Cell
                isLink
                title={t`features_trade_future_settings_additional_margin_index_lxpqlopchuyomy386a0eu`}
                value={
                  preferenceSettings.marginSource === MarginModeSettingEnum.wallet
                    ? t`features_trade_future_settings_index_vxavyxrdq9pneo7eh8ms_`
                    : t`features_trade_future_settings_additional_margin_index_cj7uai4t___xupi4uqbzd`
                }
                onClick={() => link('/future/settings/additional-margin')}
              />
            )} */}
              {/* <Cell>
              <div className="flex items-center justify-between">
                <div>
                  <span className="mr-2 text-base text-text_color_01">{t`features_trade_future_settings_index__kauhcmfytgyhaadiyuai`}</span>
                  <Popover
                    placement="top-start"
                    offset={[-9, 24]}
                    theme="dark"
                    reference={<Icon name="msg" className="page-wrapper-icon" />}
                  >
                    <div className="text-sm" style={{ maxWidth: '90vw' }}>
                      {t`features_trade_future_settings_index_hchrb6qux_ziq_jmrkfcg`}
                    </div>
                  </Popover>
                </div>
                <Switch
                  size={20}
                  loading={show}
                  disabled={show}
                  onChange={onIsolatedMargin}
                  checked={preferenceSettings.autoCloseIsolatedPosition === IsolatedMarginEnum.open}
                />
              </div>
            </Cell> */}
              {/* {isPro && (
              <Cell
                isLink
                onClick={() => link('/future/settings/margin')}
              >{t`features_trade_future_settings_index_632`}</Cell>
            )} */}
              <Cell
                isLink
                title={t`features_trade_future_settings_index_633`}
                value={
                  preferenceSettings.protect === PriceProtectTypeEnum.open
                    ? t`user.security_verification_status_03`
                    : t`features_trade_future_settings_index_ay-ddvrybb1amzhmq14tw`
                }
                onClick={() => link('/future/settings/price-protect')}
              />
              <Cell
                isLink
                title={t`features_trade_future_settings_index_f9fc6ncpipaaas8ydrqts`}
                onClick={() => link('/future/settings/module-order')}
              />
              {isPro && (
                <Cell>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="mr-2 text-base text-text_color_01">{t`features/trade/future/exchange-12`}</span>
                      {/* TODO: tooltip 组件效果有待改进 */}
                      <Popover
                        placement="top-start"
                        theme="dark"
                        reference={<Icon name="msg" className="page-wrapper-icon" />}
                        offset={[-10, 18]}
                      >
                        <div className="text-xs">
                          {t`features_assets_futures_futures_details_overview_utftpudcvthf4zqo9s3qt`}
                        </div>
                      </Popover>
                    </div>
                    <div className="flex items-center">
                      {preferenceSettings.isAutoAdd === PersonProtectTypeEnum.open && (
                        <Link className="text-xs text-brand_color mr-2" href="/future/settings/margin/auto-detail">
                          {t`features_trade_future_settings_margin_index_650`}
                        </Link>
                      )}
                      <Switch
                        size={20}
                        loading={loading}
                        disabled={loading}
                        onChange={onChange}
                        checked={preferenceSettings.isAutoAdd === PersonProtectTypeEnum.open}
                      />
                    </div>
                  </div>
                </Cell>
              )}
            </>
          ) : contractStatusInd ? (
            <NoDataImage
              isIcon
              footerText={
                <div className="flex text-sm font-medium">
                  <span className="text-text_color_01">{t`features_trade_future_settings_index_5101362`}</span>
                  <div onClick={() => activeFuture()}>
                    <span className="text-brand_color">{t`features_trade_future_settings_index_5101363`}</span>
                  </div>
                </div>
              }
            />
          ) : null}
        </div>
      )}
    </div>
  )
}

export default FutureSettings
