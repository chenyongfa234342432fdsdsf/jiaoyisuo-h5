/**
 * 合约持仓 - 调整持仓杠杆
 */
import { t } from '@lingui/macro'
import { Button, Popup, Toast } from '@nbit/vant'
import { PositionList } from '@/typings/api/assets/futures'
import { useEffect, useState } from 'react'
import {
  getGroupMarginAvailable,
  postPerpetualLeverCheckMaxSize,
  postPerpetualPositionModifyLever,
} from '@/apis/assets/futures/position'
import Lever from '@/components/lever'
import {
  calculatorAdditionalOccupationMargin,
  onCheckPositionEntrustOrder,
  onGetTradePairDetails,
} from '@/helper/assets/futures'
import { YapiGetV1PerpetualTradePairDetailData } from '@/typings/yapi/PerpetualTradePairDetailV1GetApi'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { requestWithLoading } from '@/helper/order'
import { useDebounce } from 'ahooks'
import { decimalUtils } from '@nbit/utils'
import { PositionModalHeader } from '../position-modal-header'
import styles from './index.module.css'
import { HintModal } from '../hint-modal'

interface IAdjustLeverageModalProps {
  positionData: PositionList
  onClose: () => void
  onCommit: () => void
}

function AdjustLeverageModal(props: IAdjustLeverageModalProps) {
  const { SafeCalcUtil, formatCurrency } = decimalUtils
  const { positionData, onClose, onCommit } = props
  const { groupId, positionId, lever, size, baseSymbolName, quoteSymbolName, amountOffset, symbol, initMargin } =
    positionData || {}
  const {
    futuresCurrencySettings: { offset = 2 },
  } = useAssetsFuturesStore()
  const [marginAvailable, setMarginAvailable] = useState('')
  const [tradePairDetails, setTradePairDetails] = useState<YapiGetV1PerpetualTradePairDetailData>(
    {} as YapiGetV1PerpetualTradePairDetailData
  )
  const [newLever, setNewLever] = useState(+lever) // 调整目标杠杆倍数
  const debounceLever = useDebounce(newLever, { wait: 200 })
  const [additionalOccupationMargin, setAdditionalOccupationMargin] = useState('') // 额外占用保证金
  const [errorInfo, setErrorInfo] = useState({
    isError: false,
    text: '',
  })
  const [hintVisible, setHintVisible] = useState(false)
  const [popupProps, setPopupProps] = useState<any>({
    title: '',
    content: [],
  })
  const [visible, setVisible] = useState(false)

  const positionInfo = [
    {
      label: t`features_assets_futures_common_adjust_leverage_modal_index_1olkw4ta-yhq2jocxk5d1`,
      value: `${formatCurrency(size, Number(amountOffset))} ${baseSymbolName}`,
    },
    {
      label: t`features_assets_futures_common_adjust_leverage_modal_index_5wkeihgctlkvpaemttw2d`,
      value: `${formatCurrency(marginAvailable, Number(offset))} ${quoteSymbolName}`,
    },
    {
      label: t`features_assets_futures_common_adjust_leverage_modal_index_xne8rc1gohbak3shcgrmf`,
      value: `${formatCurrency(
        `${SafeCalcUtil.add(initMargin, additionalOccupationMargin)}`,
        Number(offset)
      )} ${quoteSymbolName}`,
    },
  ]

  /**
   * 查询合约组可用保证金
   */
  const onLoadMarginAvailable = async () => {
    const res = await getGroupMarginAvailable({ groupId })

    const { isOk, data } = res || {}
    if (!isOk || !data) return

    setMarginAvailable(data?.purchasingPower || '')
  }

  /**
   * 查询币对详情 (杠杆列表)
   */
  const onLoadTradePairDetails = async () => {
    setTradePairDetails(await onGetTradePairDetails(symbol))
  }

  /**
   * 检测仓位是否存在当前委托订单
   */
  const onCheckPositionOrder = async () => {
    onCheckPositionEntrustOrder({
      ...positionData,
      content: t`features_assets_futures_common_adjust_leverage_modal_index_br0liypghgkto1dgwnlhx`,
      onClose,
      onCommit: e => {
        if (!e.isSuccess) {
          setPopupProps({ ...e })
          setHintVisible(true)
        }
      },
      onLock: () => {
        onLoadMarginAvailable()
        setVisible(true)
      },
      onRevokeOrder: () => {
        setHintVisible(false)
        onCommit()
      },
    })
  }

  /**
   * 调整持仓杠杆
   */
  const onAdjustLeverage = async () => {
    const res = await postPerpetualPositionModifyLever({ groupId, positionId, lever: `${newLever}` })

    const { isOk, data } = res || {}
    if (!isOk || !data || !data.isSuccess) {
      Toast.info(t`features_assets_futures_common_adjust_leverage_modal_index_cco-rn29rbgfwhiw5b5xc`)
      return
    }

    Toast.info(t`features_assets_futures_common_adjust_leverage_modal_index_eoskhmzifl6ik6lltpabo`)
    onCommit()
  }

  /**
   * 校验是否超出最大持仓数量
   */
  const onCheckMaxPositionSize = async () => {
    const res = await postPerpetualLeverCheckMaxSize({ groupId, positionId, lever: `${newLever}` })
    const { isOk, data } = res || {}

    if (!isOk || !data || !data?.isSuccess) {
      setErrorInfo({
        isError: true,
        text: t`features_assets_futures_common_adjust_leverage_modal_index_tuvyxe9a-5ih7h6oee5fp`,
      })
    }
  }

  const onInit = async () => {
    await onLoadTradePairDetails()
    await onCheckPositionOrder()
  }

  useEffect(() => {
    onInit()
  }, [])

  useEffect(() => {
    const newMargin = calculatorAdditionalOccupationMargin(positionData, newLever)
    setAdditionalOccupationMargin(newMargin)

    if (+newMargin > +marginAvailable) {
      setErrorInfo({
        isError: true,
        text: t`features_assets_futures_common_adjust_leverage_modal_index_jwbojuwpy_gkbntungmiz`,
      })
      return
    }

    onCheckMaxPositionSize()
    setErrorInfo({
      isError: false,
      text: '',
    })
  }, [debounceLever, marginAvailable])

  return (
    <>
      {visible && (
        <Popup
          className={styles['adjust-leverage-modal-root']}
          position="bottom"
          visible={visible}
          round
          closeOnPopstate
          safeAreaInsetBottom
          destroyOnClose
          onClose={onClose}
        >
          <PositionModalHeader
            title={t`features_assets_futures_common_adjust_leverage_modal_index_lw_nojyqhb6rhb_xaj2my`}
            data={positionData}
            onClose={onClose}
          />
          <div className="adjust-leverage-modal-wrapper">
            <Lever
              leverList={tradePairDetails.tradePairLeverList || []}
              currentValue={+lever}
              value={newLever}
              onChange={setNewLever}
            />
            <div className="position-info">
              {positionInfo.map((info, i) => {
                return (
                  <div key={i} className="info-cell">
                    <div className="info-point " />
                    <span className="info-label">{info.label}</span>
                    <span className="info-value">{info.value}</span>
                  </div>
                )
              })}
            </div>
            {errorInfo.isError && <span className="lever-hint">{errorInfo.text}</span>}

            <Button
              type="primary"
              className="modal-btn"
              onClick={() => requestWithLoading(onAdjustLeverage(), 0)}
              disabled={errorInfo.isError}
            >
              {t`common.confirm`}
            </Button>
          </div>
        </Popup>
      )}

      {hintVisible && <HintModal visible={hintVisible} {...popupProps} />}
    </>
  )
}

export { AdjustLeverageModal }
