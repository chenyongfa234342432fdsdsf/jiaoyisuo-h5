import { SelectActionSheet } from '@/components/select-action-sheet'
import { OrderDirectionEnum } from '@/constants/order'
import SelectTradePair from '@/features/trade/common/select-trade-pair'
import { storeEnumsToOptions } from '@/helper/store'
import { useBaseOrderSpotStore } from '@/store/order/spot'
import { IQuerySpotOrderReqParams } from '@/typings/api/order'
import { t } from '@lingui/macro'

export function SpotCurrentFilters({
  onChange,
  types,
  params,
  showDirection,
}: {
  params: IQuerySpotOrderReqParams
  onChange: (params: any) => void
  types?: {
    name: string
    value: any
  }[]
  showDirection?: boolean
}) {
  const { orderEnums } = useBaseOrderSpotStore()

  const directions = [
    {
      name: t`common.all`,
      value: '',
    },
    ...storeEnumsToOptions(orderEnums.orderDirection.enums, 'name'),
  ]
  const onTypeChange = (value: string) => {
    onChange({
      orderType: value,
    })
  }
  const onDirectionChange = (value: OrderDirectionEnum) => {
    onChange({
      direction: value,
    })
  }
  const onTradePairChange = (value: any) => {
    onChange({
      tradeId: value,
    })
  }

  return (
    <div className="py-3 px-4 flex">
      <SelectTradePair showSelectTradePairValue={false} value={params.tradeId} onChange={onTradePairChange} />
      {showDirection && (
        <SelectActionSheet
          value={params.direction}
          showSelectTradePairValue={false}
          label={t`features_orders_spot_spot_filters_modal_510258`}
          actions={directions}
          onChange={onDirectionChange}
        />
      )}
      {types && (
        <SelectActionSheet
          value={params.orderType}
          showSelectTradePairValue={false}
          label={t`features/assets/financial-record/record-list/record-list-screen/index-1`}
          actions={types}
          onChange={onTypeChange}
        />
      )}
    </div>
  )
}
