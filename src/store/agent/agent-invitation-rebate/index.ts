import create from 'zustand'
import produce from 'immer'
import { createTrackedSelector } from 'react-tracked'
import { IStoreEnum } from '@/typings/store/common'
import { getCodeDetailListBatch } from '@/apis/common'
import { AgentDictionaryTypeEnum } from '@/constants/agent/invite'
import { getAgentInvitationRebateCache, setAgentInvitationRebateCache } from '@/helper/cache/agent'

type IStore = ReturnType<typeof getStore>
function getStore(set, get) {
  return {
    agentInvitationRebateData: getAgentInvitationRebateCache() || {},
    setAgentData: value =>
      set(
        produce((draft: IStore) => {
          setAgentInvitationRebateCache(value)
          draft.agentInvitationRebateData = value
        })
      ),
    /** 代理商所需数据字典 */
    agentEnums: {
      agentAreaGradeRulesEnum: {
        codeKey: AgentDictionaryTypeEnum.agentAreaGradeRules,
        enums: [],
      } as IStoreEnum,
      /** 代理等级规则 - 三级返佣阶梯规则 */
      agentThreeGradeRulesEnum: {
        codeKey: AgentDictionaryTypeEnum.agentThreeGradeRules,
        enums: [],
      } as IStoreEnum,
    },
    async fetchAgentEnums() {
      const state: IStore = get()
      const data = await getCodeDetailListBatch(Object.values(state.agentEnums).map(item => item.codeKey))
      set(
        produce((draft: IStore) => {
          const items = Object.values(draft.agentEnums)
          items.forEach((item, index) => {
            item.enums = data[index].map(enumValue => {
              return {
                label: enumValue.codeKey,
                value:
                  parseInt(enumValue.codeVal, 10).toString() === enumValue.codeVal
                    ? parseInt(enumValue.codeVal, 10)
                    : enumValue.codeVal,
              }
            })
          })
        })
      )
    },
  }
}

const baseAgentStore = create(getStore)
const useAgentStore = createTrackedSelector(baseAgentStore)

export { useAgentStore, baseAgentStore }
