/**
 * 资产 - 合约组详情
 */
import { t } from '@lingui/macro'
import { useEffect, useRef, useState } from 'react'
import { SwipeCellInstance, Tabs, Toast } from '@nbit/vant'
import { usePageContext } from '@/hooks/use-page-context'
import { link } from '@/helper/link'
import {
  getFuturesGroupDetail,
  getPerpetualGroupIsLiquidate,
  getPerpetualGroupMarginList,
  postPerpetualGroupPositionFlashAll,
  postPerpetualGroupPositionList,
} from '@/apis/assets/futures/overview'
import { DetailMarginListChild, FuturesGroupDetailResp } from '@/typings/api/assets/futures'
import {
  getFuturesCurrencySettings,
  onCheckGroupEntrustOrder,
  onFilterSymbolWassName,
  onRevokeGroupEntrustOrder,
} from '@/helper/assets/futures'
import { defaultFuturesDetails, useAssetsFuturesStore } from '@/store/assets/futures'
import { useMemoizedFn, useUnmount, useUpdateEffect } from 'ahooks'
import { fetchAndUpdateUserInfo } from '@/helper/auth'
import { FuturesDetailsTabEnum, FuturesErrorEnum, FuturesPositionStatusTypeEnum } from '@/constants/assets/futures'
import { PerpetualGroupDetail } from '@/plugins/ws/protobuf/ts/proto/PerpetualGroupDetail'
import { getPerpetualMarginSettings, postPerpetualGroupDelete } from '@/apis/assets/futures/common'
import { WSThrottleTypeEnum } from '@/plugins/ws/constants'
import { GuideMapShowEnum } from '@/constants/common'
import { useBaseGuideMapStore } from '@/store/server'
import { requestWithLoading } from '@/helper/order'
import { getAssetsFuturesTransferPageRoutePath } from '@/helper/route'
import { PersonProtectTypeEnum } from '@/constants/trade'
import { setUserAutoMarginGroup } from '@/apis/trade'
import { useFutureTradeStore } from '@/store/trade/future'
import futuresPositionList from '@/helper/assets/json/futuresPositionList.json'
import futuresAccountDetails from '@/helper/assets/json/futuresAccountDetails.json'
import { HintModal, HintModalProps } from '../common/hint-modal'
import { FuturesSelectModal } from '../futures-select-modal'
import { MarginList } from './margin-list'
import { PositionList } from './position-list'
import { EditPositionNameModal } from './edit-position-name-modal'
import { FuturesOverviewLayout } from './overview/layout'
import styles from './index.module.css'

function FuturesDetailsLayout() {
  const pageContext = usePageContext()
  const {
    futuresDetails: { details, activeTab },
    updateFuturesDetails,
    wsPerpetualGroupDetailSubscribe,
    wsPerpetualGroupDetailUnSubscribe,
    positionListFutures: positionList,
    updatePositionListFutures,
    fetchFuturesEnums,
  } = useAssetsFuturesStore()
  const { guideMap } = useBaseGuideMapStore()
  const [selectVisible, setSelectVisible] = useState(false) // 是否展示选择合约组弹窗
  const [editNameVisible, setEditNameVisible] = useState(false)
  const [hintVisible, setHintVisible] = useState(false) // 是否展示提示弹窗
  const [hintProps, setHintProps] = useState({} as HintModalProps)
  const groupId = pageContext.routeParams.id
  const swipeCellRef = useRef<SwipeCellInstance>(null)
  let swipeCellTimeout
  const { isTutorialMode } = useFutureTradeStore()

  /**
   * 查询合约组详情
   */
  const onLoad = async () => {
    const res = isTutorialMode ? futuresAccountDetails : await getFuturesGroupDetail({ groupId })
    const { isOk, data, code } = res || {}

    if (!isOk || !data) {
      code === FuturesErrorEnum.noGroup && history.back()
      return
    }

    updateFuturesDetails({ details: data as FuturesGroupDetailResp })
  }

  /**
   * 持仓详情列表
   */
  const onLoadList = async () => {
    const res = isTutorialMode ? (futuresPositionList as any) : await postPerpetualGroupPositionList({ groupId })
    const { isOk, data, message = '', code } = res || {}

    if (!isOk && code !== FuturesErrorEnum.noGroup) {
      Toast.info(message)
      return
    }
    if (data?.list && data?.list.length > 0) onFilterSymbolWassName(data?.list)
    updatePositionListFutures(data?.list)
  }

  /**
   * 保证金列表
   */
  const onLoadMarginList = async () => {
    const res = await getPerpetualGroupMarginList({ groupId })
    const { isOk, data, message = '' } = res || {}

    if (isOk) {
      updateFuturesDetails({ margin: data })
    } else {
      Toast.info(message)
    }
  }

  /**
   * 获取商户保证金币种配置
   */
  const onLoadMarginSettings = async () => {
    const res = await getPerpetualMarginSettings({})
    const { isOk, data } = res || {}

    if (!isOk) {
      return
    }
    updateFuturesDetails({ marginSettings: data?.merAssetsMarginSettingData })
  }

  /**
   * 合约组详情推送回调
   */
  const onWsCallBack = useMemoizedFn(async (data: PerpetualGroupDetail[]) => {
    if (data && data.length > 0) {
      const resp = data.filter((item: any) => {
        return item.detail.groupId === details?.groupId
      })

      if (resp && resp.length > 0) {
        await onLoad()
        await onLoadList()
        await onLoadMarginList()
      }
    }
  })

  /**
   * 闪电平仓
   */
  const onFlashAll = async () => {
    setHintVisible(false)

    // 判断合约组中是否存在未锁仓仓位
    const params = positionList.filter(positionItem => {
      positionItem.sideInd = `open_${positionItem.sideInd}`
      return positionItem.statusCd === FuturesPositionStatusTypeEnum.opened
    })
    if (params.length === 0) {
      Toast.info(t`helper_assets_futures_hlztrvzkuola666c44exm`)
      return
    }

    // 判断合约组是否强平中
    const resp = await getPerpetualGroupIsLiquidate({ groupId })
    const { isOk: isLiquidateOk, data, message: isLiquidateMsg = '' } = resp || {}
    if (!isLiquidateOk) {
      Toast.info(isLiquidateMsg)
      return
    }

    if (data?.isLiquidate) {
      Toast.info(t`features_assets_futures_futures_details_index__-tg1vvug4zgeunn9kr8o`)
      return
    }

    const res = await postPerpetualGroupPositionFlashAll({ flashOrders: params })
    const { isOk, message = '' } = res || {}

    if (!isOk) {
      Toast.info(message)
      return
    }

    Toast.info(t`features_assets_futures_futures_details_index_5101417`)
  }

  /**
   * 一键合组校验
   */
  const onCheckedMergeGroup = async () => {
    const isSuccess = await onCheckGroupEntrustOrder(details?.groupId || '', (e: boolean) => {
      setHintProps({
        showIcon: true,
        content: t`features_assets_overview_list_futures_futures_list_futures_cell_index_qrahtlorwn54isajccccu`,
        cancelText: t`assets.financial-record.cancel`,
        commitText: t`features_assets_futures_assets_futures_index_5101402`,
        onClose: () => setHintVisible(false),
        onCommit: async () => {
          if (!(await onRevokeGroupEntrustOrder(details?.groupId))) {
            return
          }

          setHintVisible(false)
          requestWithLoading(onLoad(), 0)
        },
      })
      setHintVisible(e)
    })
    if (!isSuccess) {
      return
    }

    setSelectVisible(true)
  }

  /**
   * 调整自动追加保证金
   */
  const onChangeIsAutoAdd = async () => {
    const res = await setUserAutoMarginGroup({
      groupAutoMarginSettingData: [
        {
          groupId,
          isAutoAdd:
            details.isAutoAdd === PersonProtectTypeEnum.open ? PersonProtectTypeEnum.close : PersonProtectTypeEnum.open,
        },
      ],
    })

    const { isOk, data } = res || {}
    if (!isOk || !data) return
    if (data) Toast.info(t`features_user_personal_center_settings_converted_currency_index_587`)
    await onLoad()
    await onLoadList()
    await onLoadMarginList()
  }

  const onCloseAccount = async () => {
    const res = await postPerpetualGroupDelete({ groupId })

    const { isOk, data } = res || {}
    if (!isOk || !data || !data?.isSuccess) return

    Toast.info(t`features_assets_futures_futures_details_index_cprzz1lxe9`)
    history.back()
  }

  const onInitialize = async () => {
    await getFuturesCurrencySettings()
    await onLoadMarginSettings()
    await fetchAndUpdateUserInfo()
    await onLoad()
    await onLoadList()
    !isTutorialMode && (await onLoadMarginList())
  }

  const onInitTutorial = async () => {
    await onLoad()
    await onLoadList()
  }

  useEffect(() => {
    fetchFuturesEnums()
    isTutorialMode ? onInitTutorial() : requestWithLoading(onInitialize(), 0)
    !isTutorialMode && wsPerpetualGroupDetailSubscribe(onWsCallBack, WSThrottleTypeEnum.increment)
  }, [])

  useUnmount(() => {
    wsPerpetualGroupDetailUnSubscribe(onWsCallBack)
    updateFuturesDetails({ details: defaultFuturesDetails })
    clearTimeout(swipeCellTimeout)
  })

  useUpdateEffect(() => {
    activeTab === FuturesDetailsTabEnum.position
      ? requestWithLoading(onLoadList(), 0)
      : requestWithLoading(onLoadMarginList(), 0)
  }, [activeTab])

  return (
    <div className={styles['futures-details-wrapper']}>
      <FuturesOverviewLayout
        onClick={onCheckedMergeGroup}
        closeDisable={positionList && positionList.length === 0}
        onFlashClose={() => {
          setHintProps({
            showIcon: true,
            content: t`features_assets_futures_futures_details_index_r_vfoz16eq4d6povrtldj`,
            cancelText: t`common.modal.close`,
            commitText: t`user.field.reuse_17`,
            onClose: () => setHintVisible(false),
            onCommit: () => requestWithLoading(onFlashAll(), 0),
          })
          setHintVisible(true)
        }}
        onRevision={() => {
          link(getAssetsFuturesTransferPageRoutePath({ groupId }))
        }}
        onSetAutoAddMargin={() => requestWithLoading(onChangeIsAutoAdd(), 0)}
        onEditName={() => setEditNameVisible(true)}
      />

      <Tabs
        align="start"
        className="tabs"
        defaultActive={activeTab}
        onClickTab={e => {
          updateFuturesDetails({ activeTab: e.name })
          swipeCellTimeout = setTimeout(() => {
            e.name === FuturesDetailsTabEnum.margin &&
              swipeCellRef.current &&
              guideMap?.additional_margin === GuideMapShowEnum.yes &&
              swipeCellRef?.current?.open('right')
          }, 500)
        }}
      >
        <Tabs.TabPane
          title={t({
            id: 'features_assets_futures_futures_details_index_5101366',
            values: { 0: positionList.length },
          })}
          name={FuturesDetailsTabEnum.position}
        >
          <PositionList
            onLoadList={onLoadList}
            onCloseAccount={() => {
              setHintProps({
                showIcon: true,
                content: t`features_assets_futures_futures_details_index_cmqpie2dsa`,
                cancelText: t`assets.financial-record.cancel`,
                commitText: t`features_assets_futures_futures_details_index_9ways2jzt8`,
                onClose: () => setHintVisible(false),
                onCommit: () => requestWithLoading(onCloseAccount(), 0),
              })

              setHintVisible(true)
            }}
          />
        </Tabs.TabPane>

        <Tabs.TabPane
          title={t`features_assets_futures_futures_details_index_0v_1bd-c13k3skave7hyl`}
          name={FuturesDetailsTabEnum.margin}
        >
          {activeTab === FuturesDetailsTabEnum.margin && (
            <MarginList
              onClick={(type: string, params?: DetailMarginListChild) =>
                link(getAssetsFuturesTransferPageRoutePath({ groupId, type, symbol: params?.symbol }))
              }
              swipeCellRef={swipeCellRef}
            />
          )}
        </Tabs.TabPane>
      </Tabs>

      {selectVisible && (
        <FuturesSelectModal
          onCommit={(isSuccess: boolean) => {
            setSelectVisible(false)
            isSuccess && history.back()
          }}
          groupId={details?.groupId}
          onClose={() => setSelectVisible(false)}
        />
      )}

      {hintVisible && <HintModal visible={hintVisible} {...hintProps} />}

      {editNameVisible && (
        <EditPositionNameModal
          visible={editNameVisible}
          onClose={() => setEditNameVisible(false)}
          onCommit={() => {
            setEditNameVisible(false)
            requestWithLoading(onLoad(), 0)
          }}
        />
      )}
    </div>
  )
}

export { FuturesDetailsLayout }
