import { create } from 'zustand'
import { createTrackedSelector } from 'react-tracked'
import produce from 'immer'
import { devtools } from 'zustand/middleware'
import dayjs from 'dayjs'

type TStore = ReturnType<typeof getStore>

function getStore(set) {
  return {
    tooltipMap: {},
    setTooltipMap: (key, value) =>
      set(
        produce((draft: TStore) => {
          draft.tooltipMap = {
            ...draft.tooltipMap,
            [key]: value,
          }
        })
      ),

    resetTooltipMap(key?: string) {
      set(
        produce((draft: TStore) => {
          if (key) delete draft.tooltipMap?.[key]
          else draft.tooltipMap = {}
        })
      )
    },
  }
}

const baseAgentChartStore = create(devtools(getStore, { name: 'market-agent-chart-store' }))

const useAgentChartStore = createTrackedSelector(baseAgentChartStore)

export { useAgentChartStore, baseAgentChartStore }
