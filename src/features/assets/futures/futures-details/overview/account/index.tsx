/**
 * 合约账户详情 - 账户总览
 */
import { t } from '@lingui/macro'
import { useRef, useState } from 'react'
import { Popover, PopoverInstance, Toast } from '@nbit/vant'
import Icon from '@/components/icon'
import { CommonDigital } from '@/components/common-digital'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { getTextFromStoreEnums } from '@/helper/store'
import { getFuturesAccountTypeColor } from '@/constants/assets/futures'
import { postPerpetualModifyAccountType } from '@/apis/assets/futures/common'
import { requestWithLoading } from '@/helper/order'
import { useAssetsStore } from '@/store/assets/spot'
import { IncreaseTag } from '@nbit/react'
import { isString } from 'lodash'
import {
  postPerpetualAvailableMarginDetail,
  postPerpetualLockMarginDetail,
  postPerpetualOccupyMarginDetail,
  postPerpetualTotalMarginDetail,
} from '@/apis/assets/futures/overview'
import { GUIDE_ELEMENT_IDS_ENUM } from '@/constants/guide-ids'
import { formatCurrency } from '@/helper/decimal'
import { useCommonStore } from '@/store/common'
import { HintModal } from '../../../common/hint-modal'
import { MarginScaleList, MarginScaleListTypeEnum } from '../../margin-scale-list'
import styles from './index.module.css'

interface IFuturesOverviewAccountProps {
  closeDisable: boolean
}
function FuturesOverviewAccount(props: IFuturesOverviewAccountProps) {
  const { isFusionMode } = useCommonStore()
  const { closeDisable } = props || {}
  const popover = useRef<PopoverInstance>(null)
  const {
    futuresEnums,
    futuresDetails: {
      details: {
        groupId,
        baseCoin,
        groupAsset,
        marginAvailable,
        positionMargin,
        unrealizedProfit,
        openLockAsset,
        accountType,
        groupVoucherAmount,
      },
    },
    futuresCurrencySettings: { offset = 2 },
  } = useAssetsFuturesStore()
  const { encryption } = useAssetsStore().assetsModule || {}
  const accountTypeList = futuresEnums.perpetualAccountTypeEnum.enums
  const [hintVisible, setHintVisible] = useState(false)
  const [scaleModalProps, setScaleModalProps] = useState({
    visible: false,
    title: '',
    data: {} as any,
    showExperience: false,
  }) // 保证金折算率列表弹窗数据

  const assetsInfo = [
    {
      title: t`features_assets_futures_common_migrate_modal_index_5101344`,
      value: `${marginAvailable}`,
      id: MarginScaleListTypeEnum.available,
      isHint: true,
    },
    {
      title: t`features_assets_futures_futures_details_overview_tyfixyyu5ifz2vf5ix6ra`,
      value: `${positionMargin}`,
      id: MarginScaleListTypeEnum.position,
      isHint: true,
      className: 'ml-3',
    },
    {
      title: t`features_orders_future_holding_index_603`,
      value: encryption ? (
        '******'
      ) : (
        <IncreaseTag
          value={closeDisable ? '--' : unrealizedProfit}
          hasColor={!closeDisable}
          digits={offset || 2}
          right={` ${!isFusionMode ? baseCoin : ''}`}
        />
      ),
      isHint: false,
    },
    {
      title: t`features_assets_futures_futures_details_overview_k9va1ke3ja7_fvplkrudf`,
      value: `${openLockAsset}`,
      id: MarginScaleListTypeEnum.freezeMargin,
      isHint: true,
      className: 'ml-3',
    },
  ]

  const onChangeAccountType = async type => {
    if (type === accountType) return
    const res = await postPerpetualModifyAccountType({
      groupId,
      accountType: type,
    })

    const { isOk, data } = res || {}
    if (!isOk || !data || !data?.isSuccess) return
    Toast.info(t`features_user_personal_center_settings_converted_currency_index_587`)
    popover.current?.hide()
  }

  /**
   * 展示保证金折算率列表弹窗
   */
  const onShowScaleList = async (title: string, id: string) => {
    let resp
    switch (id) {
      case MarginScaleListTypeEnum.total:
        resp = await requestWithLoading(postPerpetualTotalMarginDetail({ groupId }), 0)
        break
      case MarginScaleListTypeEnum.available:
        resp = await requestWithLoading(postPerpetualAvailableMarginDetail({ groupId }), 0)
        break
      case MarginScaleListTypeEnum.position:
        resp = await requestWithLoading(postPerpetualOccupyMarginDetail({ groupId }), 0)
        break
      case MarginScaleListTypeEnum.freezeMargin:
        resp = await requestWithLoading(postPerpetualLockMarginDetail({ groupId }), 0)
        break
      default:
        break
    }
    const { isOk, data } = resp || {}
    if (!isOk || !data) return
    setScaleModalProps({
      visible: true,
      title,
      data,
      showExperience:
        (id === MarginScaleListTypeEnum.total || id === MarginScaleListTypeEnum.position) &&
        !!groupVoucherAmount &&
        +groupVoucherAmount > 0,
    })
  }

  return (
    <div className={styles['futures-overview-account-root']}>
      <div className="header-wrap">
        <div className="worth-wrap">
          <div
            className="flex"
            onClick={() =>
              onShowScaleList(
                t`features_assets_futures_futures_details_overview_account_index_rrygouar3m`,
                MarginScaleListTypeEnum.total
              )
            }
          >
            <div className="worth-label">{t`features_assets_futures_futures_details_overview_account_index_rrygouar3m`}</div>
          </div>

          <CommonDigital
            isEncrypt
            className="worth-num"
            content={`${formatCurrency(groupAsset, offset || 2) || '--'} ${!isFusionMode ? baseCoin : ''}`}
          />
        </div>

        <div className="popover-wrap">
          <Popover
            ref={popover}
            placement="bottom"
            className={`${styles['futures-overview-account-popover-root']} ${GUIDE_ELEMENT_IDS_ENUM.futureAccountDetailSwitchAccountType}`}
            reference={
              <div
                className="popover-reference"
                id={GUIDE_ELEMENT_IDS_ENUM.futureAccountDetailSwitchAccountType}
                style={getFuturesAccountTypeColor(accountType)}
              >
                <div className="popover-reference-text">
                  {getTextFromStoreEnums(accountType, futuresEnums.perpetualAccountTypeEnum.enums)}
                </div>
                <Icon name="regsiter_icon_drop" hasTheme className="popover-reference-icon" />
              </div>
            }
          >
            <div className="futures-overview-account-popover-wrap">
              {accountTypeList.map(accountInfo => {
                return (
                  <div
                    key={accountInfo?.value}
                    className={`account-popover-cell ${
                      accountType === accountInfo?.value && 'account-popover-cell-active'
                    }`}
                    onClick={() => requestWithLoading(onChangeAccountType(accountInfo?.value), 0)}
                  >
                    {accountInfo?.label}
                  </div>
                )
              })}
            </div>
          </Popover>

          <Icon name="msg" className="popover-hint-icon" hasTheme onClick={() => setHintVisible(true)} />
        </div>
      </div>

      <div className="info-wrap">
        {assetsInfo.map((info, i: number) => {
          return (
            <div className={`info-cell ${info.className}`} key={i}>
              <div
                className="flex"
                onClick={() => {
                  if (!info.isHint) return

                  info.id && onShowScaleList(info.title, info.id)
                }}
              >
                <div className={`info-label ${!info.isHint && '!border-b-0'}`}>{info.title}</div>
              </div>

              {isString(info.value) ? (
                <CommonDigital
                  isEncrypt
                  className="info-value"
                  content={`${formatCurrency(info.value, offset || 2) || '--'} ${!isFusionMode ? baseCoin : ''}`}
                />
              ) : (
                info.value
              )}
            </div>
          )
        })}
      </div>

      <HintModal
        title={t`features_assets_futures_futures_details_overview_account_index_0cjlk2sgdj`}
        visible={hintVisible}
        content={
          <div className={styles['hint-modal-root']}>
            <div className="hint-label">{t`features_assets_futures_futures_details_overview_account_index_itlmjt1llo`}</div>
            <div className="hint-text">{t`features_assets_futures_futures_details_overview_account_index_8rn42if2br`}</div>
            <div className="hint-label">{t`features_assets_futures_futures_details_overview_account_index_nolhqtxvf_`}</div>
            <div className="hint-text">{t`features_assets_futures_futures_details_overview_account_index__gtae81_hm`}</div>
            <div className="hint-text !text-text_color_03">{t`features_assets_futures_futures_details_overview_account_index_64tv1vlacb`}</div>
          </div>
        }
        onCommit={() => setHintVisible(false)}
      />

      {scaleModalProps.visible && (
        <MarginScaleList
          {...scaleModalProps}
          onClose={() => setScaleModalProps({ ...scaleModalProps, visible: false })}
        />
      )}
    </div>
  )
}

export { FuturesOverviewAccount }
