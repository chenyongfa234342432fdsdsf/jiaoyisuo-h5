import { YapiGetV1PerpetualStrategyHistoryApiRequest } from '@/typings/yapi/PerpetualStrategyHistoryV1GetApi.d'
import { OptionCycle } from '@/constants/trade'
import { t } from '@lingui/macro'
import { setOptionOrdersCancelAll } from '@/apis/ternary-option/order'
import { Dialog } from '@nbit/vant'
import AlertTip from '@/components/alert-tip'
import { getSpotFiltersModalDefaultParams } from './ternary-history/ternary-filters-modal'
// import styles from './ternaryorder.module.css'

const capitalSelectParamsProps = getSpotFiltersModalDefaultParams()

type CapitalSelectParams = typeof capitalSelectParamsProps

interface HistorySelectParams extends CapitalSelectParams {
  tradeId: string
}

type CurrentNormalParams = {
  entrustTypeInd: string
}

type HistoryNormalParams = {
  statusArr?: string[]
  entrustTypeInd?: string
  typeInd?: string
}

type IQuerySpotOrderReqParams = Partial<YapiGetV1PerpetualStrategyHistoryApiRequest> & {
  dateType?: string
  statusArr?: string[]
  beginDateNumber?: number
  endDateNumber?: number
  hideCanceled?: boolean
}

enum IsAccept {
  // 接管单
  TakeoverOrder = 1,
  // 非接管单
  NotTakeoverOrder = 2,
}

const getJudgeShowColor = nums => {
  if (nums === '0' || nums === '0%') {
    return 'zero'
  } else if (nums?.indexOf('-') > -1) {
    return 'down'
  } else {
    return 'up'
  }
}

const getTimesUnit = unit => {
  return {
    MINUTES: t`features_ternary_option_option_order_ternary_history_spot_select_filters_hdyxin04z4`,
    SECONDS: t`features_ternary_option_option_order_ternary_order_item_index_h6owzk3zf6`,
  }[unit]
}

const useSideInd = () => {
  const sideInd = {
    [OptionCycle.Call]: t`features_ternary_option_option_order_ternaryorder_f_si7hjpac`,
    [OptionCycle.Put]: t`features_ternary_option_option_order_ternaryorder_mqgoiyo9p4`,
    [OptionCycle.OverCall]: t`features_ternary_option_option_order_ternaryorder_e6o4ayhxuy`,
    [OptionCycle.OverPut]: t`features_ternary_option_option_order_ternaryorder_4qjf6opstr`,
  }

  const sideIndColor = {
    [OptionCycle.Call]: 'up',
    [OptionCycle.Put]: 'down',
    [OptionCycle.OverCall]: 'up',
    [OptionCycle.OverPut]: 'down',
  }

  return { sideInd, sideIndColor }
}

const useCancelAll = () => {
  const cancelAll = async () => {
    const res = await Dialog.confirm({
      className: 'dialog-confirm-wrapper confirm-black  cancel-bg-gray',
      message: (
        <AlertTip>
          <div className="text-text_color_01 text-sm">{t`features_ternary_option_option_order_ternaryorder_dpx0amo8ci`}</div>
        </AlertTip>
      ),
    })

    if (res) {
      setOptionOrdersCancelAll({})
    }
  }
  return { cancelAll }
}

enum Intelligent {
  IntelligentDoubling = 1,
  NotIntelligentDoubling = 2,
}

export {
  IQuerySpotOrderReqParams,
  HistorySelectParams,
  CapitalSelectParams,
  CurrentNormalParams,
  HistoryNormalParams,
  IsAccept,
  useSideInd,
  getJudgeShowColor,
  useCancelAll,
  Intelligent,
  getTimesUnit,
}
