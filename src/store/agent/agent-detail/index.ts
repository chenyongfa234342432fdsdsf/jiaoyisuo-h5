import { create } from 'zustand'
import { createTrackedSelector } from 'react-tracked'
import produce from 'immer'
import { devtools } from 'zustand/middleware'
import { getV1AgentAbnormalApiRequest, getV1AgentCurrencyApiRequest } from '@/apis/agent'
import { YapiGetV1AgentAbnormalDataReal, YapiGetV1AgentCurrencyDataReal } from '@/typings/api/agent/invite'
import { isEmpty } from 'lodash'
import { YapiGetV1OpenapiComCodeGetCodeDetailListData } from '@/typings/yapi/OpenapiComCodeGetCodeDetailListV1GetApi'
import { getCodeDetailListBatch } from '@/apis/common'
import { AgentDictionaryTypeEnum } from '@/constants/agent/common'

type IStore = ReturnType<typeof getStore>

function getStore(set, get) {
  return {
    dictionary: {
      /** 代理类型 */
      agentType: [] as YapiGetV1OpenapiComCodeGetCodeDetailListData[],
      /** 产品线类型 */
      agentProductCode: [] as YapiGetV1OpenapiComCodeGetCodeDetailListData[],
      /**  */
      kycTypeInd: [] as YapiGetV1OpenapiComCodeGetCodeDetailListData[],
    },
    /** 获取数据字典 */
    async fetchAgentDetailBatchCode() {
      const dictionaryQueryParams = [
        {
          codeKey: AgentDictionaryTypeEnum.agentTypeCode,
          /** 代理数据字典 */
          dictionaryMap: 'agentType',
        },
        {
          codeKey: AgentDictionaryTypeEnum.agentProductCode,
          /** 产品线数据字典 */
          dictionaryMap: 'agentProductCode',
        },
        {
          codeKey: AgentDictionaryTypeEnum.kycTypeInd,
          /** 产品线数据字典 */
          dictionaryMap: 'kycTypeInd',
        },
      ]
      const data = await getCodeDetailListBatch(dictionaryQueryParams.map(item => item.codeKey))
      set(
        produce((draft: IStore) => {
          dictionaryQueryParams
            .map(item => item.dictionaryMap)
            ?.forEach((item, index) => {
              draft.dictionary[item] = data[index]
            })
        })
      )
    },
  }
}

const agentDetailStore = create(devtools(getStore, { name: 'agent-detail' }))

const useAgentDetailStore = createTrackedSelector(agentDetailStore)

export { useAgentDetailStore, agentDetailStore }
