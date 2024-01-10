import { SelectActionSheet } from '@/components/select-action-sheet'
import { t } from '@lingui/macro'
import { EntrustTypeEnum } from '@/constants/trade'
import SelectTradePair from '../contract-trade-pair/index'

type TypeChangeParams = {
  typeInd?: string
  entrustTypeInd?: string
  tradeId?: number | string
}

export function SpotCurrentFilters({
  onChange,
  types,
  // showDirection,
  params,
  futureHooksType,
}: {
  params: any
  onChange: (params: TypeChangeParams) => void
  types?: {
    name: string
    value: any
  }[]
  showDirection?: boolean
  futureHooksType?: number
}) {
  const getTakeFutureType = EntrustTypeEnum.normal === futureHooksType ? 'typeInd' : 'entrustTypeInd'

  const onTypeChange = (value: string) => {
    onChange({
      [getTakeFutureType]: value,
    })
  }
  const onTradePairChange = (value: string | number) => {
    onChange({
      tradeId: value,
    })
  }

  return (
    <div className="py-4 px-4 flex bg-card_bg_color_01">
      <SelectTradePair value={params.tradeId} onChange={onTradePairChange} />
      {types && (
        <SelectActionSheet
          value={params[getTakeFutureType]}
          label={t`features/assets/financial-record/record-list/record-list-screen/index-1`}
          actions={types}
          onChange={onTypeChange}
        />
      )}
    </div>
  )
}
