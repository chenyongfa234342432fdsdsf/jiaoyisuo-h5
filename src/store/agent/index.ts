import { create } from 'zustand'
import { createTrackedSelector } from 'react-tracked'
import produce from 'immer'
import { devtools } from 'zustand/middleware'
import { getV1AgentAbnormalApiRequest, getV1AgentCurrencyApiRequest } from '@/apis/agent'
import { YapiGetV1AgentAbnormalDataReal, YapiGetV1AgentCurrencyDataReal } from '@/typings/api/agent/invite'
import { isEmpty } from 'lodash'
import { postIsBlackUser } from '@/apis/agent/manage'

type IStore = ReturnType<typeof getStore>

function getStore(set, get) {
  return {
    userInBlackListInfo: {} as YapiGetV1AgentAbnormalDataReal,
    fetchUserInBlackList() {
      postIsBlackUser({}).then(res => {
        if (res.isOk && res.data) {
          set(
            produce((draft: IStore) => {
              draft.userInBlackListInfo =
                (res.data && {
                  ...res.data,
                  onTheBlacklist: res.data.inBlacklist,
                }) ||
                {}
            })
          )
        }
      })
    },
    agentCurrencyInfo: {} as YapiGetV1AgentCurrencyDataReal,
    fetchAgentCurrencyInfo: async () => {
      if (!isEmpty((get() as IStore).agentCurrencyInfo)) return
      const res = await getV1AgentCurrencyApiRequest({})
      if (res.isOk && res.data) {
        set((store: IStore) => {
          return produce(store, _store => {
            _store.agentCurrencyInfo = res.data || {}
          })
        })
      }
    },
  }
}

const baseAgentStore = create(devtools(getStore, { name: 'agent-store' }))

const useAgentStore = createTrackedSelector(baseAgentStore)

export { useAgentStore, baseAgentStore }
