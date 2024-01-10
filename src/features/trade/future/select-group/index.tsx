// import { oss_svg_image_domain_address } from '@/constants/oss'
import Icon from '@/components/icon'
import { formatCurrency } from '@/helper/decimal'
import { useTradeStore } from '@/store/trade'
import { t } from '@lingui/macro'
import { IncreaseTag } from '@nbit/react'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
// import { useUserStore } from '@/store/user'
import { replaceEmpty } from '@/helper/filters'
import { ActionSheet } from '@nbit/vant'
// import type { CollapseItemInstance } from '@nbit/vant/es/collapse/PropsType'
import { IFutureGroup } from '@/typings/api/future/common'
import { useFutureTradeStore } from '@/store/trade/future'
// import { UserUpsAndDownsColorEnum } from '@/constants/user'
import { useNavigateOwnParams } from '@/hooks/use-navigate-own-params'
import { setFutureGroupCreate } from '@/apis/future/common'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { useCommonStore } from '@/store/common'
import { YapiPostV1PerpetualGroupCreateData } from '@/typings/yapi/PerpetualGroupCreateV1PostApi.d'
import { YapiGetV1OpenapiComCodeGetCodeDetailListData } from '@/typings/yapi/OpenapiComCodeGetCodeDetailListV1GetApi'
// import { YapiGetV1PerpetualGroupListData } from '@/typings/yapi/PerpetualGroupListV1GetApi'
import { useAcountBgAndColor, AcountBgAndColor } from '../use-acount-bg-and-color'
import { useExchangeContext } from '../../common/exchange/context'
import styles from './index.module.css'

export type ISelectGroupProps = {
  visible: boolean
  onSelectOne?: (id: string, group: IFutureGroup) => void
  onVisibleChange: (v: boolean) => void
  excludeContractGroupId?: string
  showCreateNewGroup?: boolean
  setCreateNewGroupDetail?: (item: YapiPostV1PerpetualGroupCreateData | { type: string }) => void
  futureGroupModeClick?: boolean
  selectedfutureGroup?: IFutureGroup & { type: string }
}

function GroupItem({
  group,
  onSelectOne,
  expanded,
  offset,
  acountBgAndColor,
  accountShowTextList,
}: {
  group: any
  onSelectOne: (id: string) => void
  onToggleExpanded: (id: string) => void
  expanded: boolean
  offset: number
  acountBgAndColor: AcountBgAndColor
  accountShowTextList: YapiGetV1OpenapiComCodeGetCodeDetailListData[]
}) {
  // const collapseItemRef = useRef<CollapseItemInstance>(null)

  // const useStore = useUserStore()

  // const { personalCenterSettings } = useStore

  // const showProfitOrLoss = amount => {
  //   if (!amount) {
  //     return
  //   } else if (amount === '0') {
  //     return false
  //   }
  //   return amount?.indexOf('-') > -1
  // }

  // const getOssImageChange = (contractGroup, lost, prolit) => {
  //   return showProfitOrLoss(contractGroup?.unrealizedProfit)
  //     ? personalCenterSettings?.colors === UserUpsAndDownsColorEnum.greenUpRedDown
  //       ? lost
  //       : prolit
  //     : personalCenterSettings?.colors === UserUpsAndDownsColorEnum.greenUpRedDown
  //     ? prolit
  //     : lost
  // }

  return (
    <div
      className={classNames(styles['group-item'], {
        expanded,
      })}
      onClick={() => onSelectOne(group.groupId)}
    >
      <div className="group-item-type">
        <span style={{ ...acountBgAndColor?.[group?.accountType] }}>
          {accountShowTextList?.find(item => item?.codeVal === group?.accountType)?.codeKey}
        </span>
      </div>
      <div className="group-item-icon">
        <Icon name={`login_agreement_${expanded ? 'selected' : 'unselected'}`} />
      </div>
      <div className="mt-3">{group.groupName}</div>
      <div className="group-item-detail">
        <div>
          <div className="text-text_color_02 text-xs">
            {t`features_assets_futures_common_migrate_modal_index_5101344`}({group?.baseCoin})
          </div>
          <div className="text-sm text-text_color_01 font-medium">{formatCurrency(group.marginAvailable, offset)}</div>
        </div>
        <div>
          <div className="text-text_color_02 text-xs">
            {t`features_orders_future_holding_index_603`}({group?.baseCoin})
          </div>
          <div className="text-sm font-medium flex justify-end">
            <IncreaseTag kSign digits={offset} value={group.unrealizedProfit} />
          </div>
        </div>
      </div>
      {/* <div
        className={classNames('top', {
          'profit-top': expanded,
        })}
      >
        <img
          className="profit-loss-img"
          src={`${oss_svg_image_domain_address}${getOssImageChange(group, 'red', 'green')}-contract-group-open.png`}
          alt=""
        />
        <div>
          <div
            className={classNames('left-tag z-1', {
              'left-tag-red': showProfitOrLoss(group?.unrealizedProfit),
            })}
          >{t`features_orders_future_holding_index_603`}</div>
          {!expanded && (
            <div className="flex items-center justify-between">
              <div className="z-1">
                <span className="text-xl mr-1 z-1">
                  <IncreaseTag hasColor={false} digits={offset} value={group.unrealizedProfit} />
                </span>
                <span className="z-1">{group?.baseCoin}</span>
              </div>
              <div className="flex z-1" onClick={onClickIcon}>
                <div
                  className={classNames('group-name', {
                    'group-name-red': showProfitOrLoss(group?.unrealizedProfit),
                  })}
                >
                  {group.groupName}
                </div>
                <div className="contract-group-icon-line"></div>
                <div className="group-name-icon">
                  <Icon name={expanded ? 'asset_view_coin_fold_black' : 'asset_view_coin_unfold_black'} />
                </div>
              </div>
            </div>
          )}
          {expanded && (
            <div className="selected-group-show">
              <div className="flex items-center justify-between selected-container">
                <div className="z-1">
                  <div
                    className={classNames('group-name', {
                      'group-name-red': showProfitOrLoss(group?.unrealizedProfit),
                    })}
                  >
                    {group.groupName}
                  </div>
                </div>
                <div className="flex z-1 profit-tag">
                  <div className="label">{t`features_orders_future_holding_index_603`}</div>
                </div>
              </div>
              <div className="flex items-center justify-between selected-container">
                <div className="z-1">
                  <span className="text-xl mr-1 z-1">
                    <IncreaseTag hasColor={false} digits={offset} value={group.unrealizedProfit} />
                  </span>
                  <span className="z-1">{group?.baseCoin}</span>
                </div>
                <div className="flex z-1 profit-tag">
                  <IncreaseTag digits={offset} hasColor={false} value={group.totalYield} hasPostfix />
                </div>
              </div>
              <div className="contract-group-icon-line"></div>
              <div className="group-name-icon" onClick={onClickIcon}>
                <Icon name={expanded ? 'asset_view_coin_fold_black' : 'asset_view_coin_unfold_black'} />
              </div>
            </div>
          )}
        </div>
      </div>
      <Collapse initExpanded="" value={expanded ? [group?.groupId] : []}>
        <Collapse.Item ref={collapseItemRef} name={group?.groupId}>
          <div className="bottom">
            <div className="prop-item">
              <div className="label">{t`features_assets_futures_futures_details_overview_cnn0xwcvl7m8ty05r8lrq`}</div>
              <div>
                {formatCurrency(group.groupAsset, offset)} {group?.baseCoin}
              </div>
            </div>
            <div className="prop-item">
              <div className="label">{t`features_assets_futures_futures_details_overview_tyfixyyu5ifz2vf5ix6ra`}</div>
              <div>
                {formatCurrency(group.positionAsset, offset)} {group?.baseCoin}
              </div>
            </div>
            <div className="prop-item">
              <div className="label">{t`features_assets_futures_common_migrate_modal_index_5101344`}</div>
              <div>
                {formatCurrency(group.marginAvailable, offset)} {group?.baseCoin}
              </div>
            </div>
            <div className="prop-item">
              <div className="label">{t`features_assets_futures_futures_details_overview_k9va1ke3ja7_fvplkrudf`}</div>
              <div>
                {replaceEmpty(formatCurrency(group?.lockCoinAsset, Number(offset)))}
                <span className="pl-0.5">{replaceEmpty(group?.baseCoin)}</span>
              </div>
            </div>
          </div>
        </Collapse.Item>
      </Collapse> */}
    </div>
  )
}

export function SelectGroup({
  onSelectOne,
  visible,
  onVisibleChange,
  excludeContractGroupId,
  showCreateNewGroup = true,
  setCreateNewGroupDetail,
  futureGroupModeClick,
  selectedfutureGroup,
}: ISelectGroupProps) {
  const { futureGroups, fetchFutureGroups, currentFutureGroup } = useFutureTradeStore()
  const {
    futuresCurrencySettings: { offset = 2 },
  } = useAssetsFuturesStore()
  const [expandedGroupId, setExpandedGroupId] = useState<any>({})
  const onToggleExpanded = (id: string) => {
    // setExpandedGroupId(expandedGroupId === id ? null : id)
  }

  const { isFusionMode } = useCommonStore()

  const showCreateNewGroupRef = useRef<boolean>(true)

  const { navigateOwnLink } = useNavigateOwnParams()

  const { onFutureGroupChange, tradeInfo } = useExchangeContext()

  const { acountBgAndColor, accountShowTextList } = useAcountBgAndColor()

  useEffect(() => {
    if (visible) {
      fetchFutureGroups(excludeContractGroupId)
      setExpandedGroupId(
        futureGroupModeClick
          ? { ...currentFutureGroup, groupId: currentFutureGroup?.groupId }
          : selectedfutureGroup?.type === 'new'
          ? 'new'
          : { ...selectedfutureGroup }
      )
    }
    showCreateNewGroupRef.current = true
  }, [visible, futureGroupModeClick])

  const setAddNewGroup = async item => {
    if (!showCreateNewGroupRef.current) return

    showCreateNewGroupRef.current = false
    if (futureGroupModeClick) {
      if (setCreateNewGroupDetail) {
        // const { isOk, data } = await setFutureGroupCreate({ isAutoAdd: false })
        // if (isOk && data) {
        //   setCreateNewGroupDetail(data)
        // }
        setCreateNewGroupDetail({ type: 'new' })
      } else {
        onFutureGroupChange({ groupName: '' } as any)
        navigateOwnLink(
          { selectgroup: '' },
          {
            keepScrollPosition: true,
            overwriteLastHistoryEntry: true,
          }
        )
      }
      onVisibleChange(false)
    } else {
      setExpandedGroupId(item === expandedGroupId ? {} : 'new')
    }
    showCreateNewGroupRef.current = true
  }

  const onSelectContractGroupChange = async () => {
    if (expandedGroupId === 'new' && setCreateNewGroupDetail) {
      // const { isOk, data } = await setFutureGroupCreate({ isAutoAdd: false })
      // if (isOk && data) {
      //   setCreateNewGroupDetail(data)
      //   onVisibleChange(false)
      // }
      setCreateNewGroupDetail({ type: 'new' })
      onVisibleChange(false)
    } else {
      selectReturnContractIndex(expandedGroupId)
    }
  }

  const selectReturnContractIndex = contractGroups => {
    if (futureGroupModeClick) {
      onFutureGroupChange(contractGroups)
      navigateOwnLink(
        { selectgroup: contractGroups?.groupId },
        {
          keepScrollPosition: true,
          overwriteLastHistoryEntry: true,
        }
      )
    } else {
      onSelectOne?.(expandedGroupId?.groupId, expandedGroupId)
      excludeContractGroupId === tradeInfo?.group?.groupId && onFutureGroupChange({ groupName: '' } as any)
    }

    onVisibleChange(false)
  }

  return (
    <ActionSheet
      className={styles['group-select-modal-wrapper']}
      destroyOnClose
      title={t`features_trade_future_select_group_index_rwkx7oq_k5`}
      closeIcon={<Icon name="close" hasTheme className="text-xl" onClick={() => onVisibleChange?.(false)} />}
      onClose={() => onVisibleChange?.(false)}
      visible={visible}
      onClosed={() => setExpandedGroupId(null)}
    >
      <>
        <div className="px-4">
          {futureGroups.length < 26 && showCreateNewGroup && (
            <div
              className={classNames('new-group', {
                'new-group-selected': expandedGroupId === 'new',
                'new-group-last': futureGroups?.length === 0,
              })}
              onClick={() => setAddNewGroup('new')}
            >
              <div className="new-group-item">
                <span className="name">{isFusionMode ? t`constants_order_746` : t`helper_trade_vlkiz873mu`}</span>
                <span>
                  <Icon name="next_arrow" hasTheme />
                </span>
              </div>
              {/* <div className="contract-group-img">
                <img src={`${oss_svg_image_domain_address}new-contract-group.png`} alt="" />
              </div> */}
            </div>
          )}
          {futureGroups.map(group => {
            const onSelect = () => {
              if (futureGroupModeClick) {
                selectReturnContractIndex(group)
              } else {
                setExpandedGroupId(
                  group?.groupId === expandedGroupId?.groupId ? {} : { ...group, groupId: group.groupId }
                )
              }
            }
            return (
              <GroupItem
                onToggleExpanded={onToggleExpanded}
                expanded={group.groupId === expandedGroupId?.groupId}
                key={group.groupId}
                group={group}
                acountBgAndColor={acountBgAndColor}
                onSelectOne={onSelect}
                offset={Number(offset)}
                accountShowTextList={accountShowTextList}
              />
            )
          })}
        </div>
        {!futureGroupModeClick && (
          <div className="new-group-bottom-button">
            <div
              className={classNames('new-group-button', {
                'new-group-button-disable':
                  (expandedGroupId?.groupId
                    ? excludeContractGroupId === expandedGroupId?.groupId
                    : !expandedGroupId?.groupId) && expandedGroupId !== 'new',
              })}
              onClick={onSelectContractGroupChange}
            >{t`common.confirm`}</div>
          </div>
        )}
      </>
    </ActionSheet>
  )
}
