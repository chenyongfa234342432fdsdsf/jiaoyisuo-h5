import { FinanceValue } from '@/features/agent/agent-invite/invite-check-more-v3/display-table/table-schema'
import { formatDate } from '@/helper/date'
import { baseAgentStore } from '@/store/agent'
import { baseAgentStatsStore } from '@/store/agent/agent-gains'
import { IncreaseTag } from '@nbit/react'

const getTitleCol = (showDetails = false) => [
  {
    accessorKey: 'baseSymbolName',
    cell: ctx => {
      const data = ctx.row.original
      const { rebateCurrency } = baseAgentStatsStore.getState()
      return (
        <span className="flex flex-col py-4">
          <span className="text-text_color_01 text-base font-medium">{rebateCurrency || '-'}</span>
          {showDetails && (
            <span className="text-text_color_02 text-xs font-normal my-1">{data.settlementCur || '-'}</span>
          )}
          <span className="text-text_color_02 text-xs font-normal mt-1">{formatDate(data.settlementTime) || '-'}</span>
        </span>
      )
    },
  },
]

const getFeesCol = (showDetails = false) => [
  {
    accessorKey: 'last',
    cell: ctx => {
      const data = ctx.row.original
      const { productCodeMap } = baseAgentStatsStore.getState()
      const { agentCurrencyInfo } = baseAgentStore.getState()

      return (
        <span className="flex flex-col py-4">
          <span className="text-text_color_01 text-base font-medium">
            <FinanceValue val={data.settlementCurAmount} precision={agentCurrencyInfo.offset} />
          </span>
          {showDetails && (
            <span className="text-text_color_02 text-xs font-normal my-1">
              <FinanceValue val={data.realSettlementValue} precision={agentCurrencyInfo.offset} />
            </span>
          )}
          <span className="text-text_color_02 text-xs font-normal mt-1">{productCodeMap[data.productCd] || '-'}</span>
        </span>
      )
    },
  },
]

export const getStatsTableCols = () => [...getTitleCol(), ...getFeesCol()]
export const getStatsDetailsTableCols = () => [...getTitleCol(true), ...getFeesCol(true)]
