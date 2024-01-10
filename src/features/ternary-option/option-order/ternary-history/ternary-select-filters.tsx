import { SelectActionSheet } from '@/components/select-action-sheet'
import { t } from '@lingui/macro'
import { getOptionTradePairList } from '@/apis/ternary-option/order'
import { useMount } from 'ahooks'
import { useState } from 'react'
import { getCodeDetailList } from '@/apis/common'
import { decimalUtils } from '@nbit/utils'
import TernaryTradePair from '../ternary-trade-pair'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

export type TypeChangeParams = {
  optionId?: string
  sideInd?: number | string
  period?: number | string
}

export function SpotCurrentFilters({
  onChange,
  params,
}: {
  params: any
  onChange: (params: TypeChangeParams) => void
}) {
  const [sideIndList, setSideIndList] = useState<Record<'name' | 'value', string>[]>([
    { name: t`constants_market_market_list_market_module_index_5101071`, value: '' },
  ])

  const [speriodDataList, setPeriodDataList] = useState<Record<'name' | 'value', string>[]>([
    { name: t`constants_market_market_list_market_module_index_5101071`, value: '' },
  ])

  const getCodeDetailListChange = async () => {
    const res = await Promise.all([
      getCodeDetailList({ codeVal: 'product_period_cd' }),
      getCodeDetailList({ codeVal: 'options_side_ind' }),
    ])
    const [periodData, sideIndData] = res
    if (periodData?.isOk && sideIndData?.isOk) {
      const sideList =
        sideIndData?.data?.map(item => {
          return {
            name: item?.codeKey,
            value: item?.codeVal,
          }
        }) || []

      const periodList =
        periodData?.data?.map(item => {
          return {
            name:
              Number(item?.codeKey) >= 60
                ? `${SafeCalcUtil.div(
                    Number(item?.codeVal),
                    60
                  )}${t`features_ternary_option_option_order_ternary_history_spot_select_filters_hdyxin04z4`} `
                : `${item?.codeVal} ${t`features_ternary_option_option_order_ternary_order_item_index_h6owzk3zf6`}`,
            value: item?.codeVal,
          }
        }) || []

      setPeriodDataList([...speriodDataList, ...periodList])
      setSideIndList([...sideIndList, ...sideList])
    }
  }
  useMount(() => {
    getCodeDetailListChange()
  })

  const [optionIdList, setOptionIdList] = useState<Record<'name' | 'id', string>[] | undefined>([])

  const onTypeChange = (value: string) => {
    onChange({
      optionId: value,
    })
  }

  const onTradeDirectionChange = (value: string | number) => {
    onChange({
      sideInd: value,
    })
  }

  const onCycleChange = (value: string | number) => {
    onChange({
      period: value,
    })
  }

  const getOptionTradePairListChange = async () => {
    const { isOk, data } = await getOptionTradePairList({})
    if (isOk) {
      const list = data?.list?.map(item => {
        return {
          name: item?.symbol,
          id: item?.id,
        }
      })
      setOptionIdList(list as any)
    }
  }

  useMount(() => {
    getOptionTradePairListChange()
  })

  return (
    <div className="py-4 px-4 flex bg-card_bg_color_01">
      <TernaryTradePair pairList={optionIdList || []} value={params.optionId} onChange={onTypeChange} />
      <SelectActionSheet
        value={params?.sideInd}
        label={t`features_orders_spot_spot_filters_modal_510258`}
        actions={sideIndList}
        onChange={onTradeDirectionChange}
      />
      <SelectActionSheet
        value={params?.period}
        label={t`features_ternary_option_option_order_ternary_history_spot_select_filters_bjztybgzk9`}
        actions={speriodDataList}
        onChange={onCycleChange}
      />
    </div>
  )
}
