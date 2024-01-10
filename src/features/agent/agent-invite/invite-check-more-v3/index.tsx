import Icon from '@/components/icon'
import { useAgentInviteStore } from '@/store/agent/agent-invite'
import { t } from '@lingui/macro'
import { useUnmount } from 'ahooks'
import { usePageContext } from '@/hooks/use-page-context'
import AgentInviteCheckMoreDisplayTable from '@/features/agent/agent-invite/invite-check-more-v3/display-table'
import { AgentInviteCheckMoreFilterFormPopover } from '@/features/agent/agent-invite/invite-check-more-v3/filter-form'
import { Tabs, Sticky } from '@nbit/vant'
import { InviteDetailsUidTypeEnum } from '@/constants/agent/invite'
import { useEffect, useRef, useState } from 'react'
import NavBar from '@/components/navbar'
import { getAgentList } from '@/apis/agent/invite-v3'
import { agentDetailStore } from '@/store/agent/agent-detail'
import { getCodeDetailList } from '@/apis/common'
import { AgentDictionaryTypeEnum } from '@/constants/agent/common'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import { GetDetailListRequest } from '@/typings/api/agent/invite-v3'
import AgentSearchBar from './agent-search-bar'
import styles from './index.module.css'
import { ScrollToTopButton } from '../../agent-center/center/common/scroll-top-button'

function AgentInviteCheckMoreV3() {
  const { fetchAgentDetailBatchCode, dictionary } = agentDetailStore()

  const uid = usePageContext()?.urlParsed.search?.uid
  const model = usePageContext()?.urlParsed.search?.model
  const store = useAgentInviteStore()
  const filterForm = store.filterSettingCheckMoreV2
  const setFilterForm = store.setFilterSettingCheckMoreV2

  const [proxyTabList, setProxyTabList] = useState<Array<any>>([])
  const [proxyType, setProxyType] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [filterFormVisible, setFilterFormVisible] = useState(false)
  // 是否在重置
  const [isReset, setIsReset] = useState(false)
  const formRef = useRef()
  useEffect(() => {
    if (uid) {
      store.setSelectedInvited({ uid: uid as any })
      setFilterForm({ uid, queryUidType: InviteDetailsUidTypeEnum.upperLevelUid, model })
    } else {
      setFilterForm({ uid: '', queryUidType: InviteDetailsUidTypeEnum.upperLevelUid, model })
    }
  }, [uid, model])
  /** 设置模式筛选条件 */
  const switchChange = async activeTabVal => {
    setIsReset(true)
    store.resetFilterSettingCheckMoreV2({ model: activeTabVal })
    resetSelectedStates()
    if (!currentSearchUid) {
      setFilterForm({ model: activeTabVal })
    }
    setProxyType(activeTabVal as string)
  }

  const setTabSwitch = async () => {
    setIsLoading(true)
    /** 获取用户所有的代理 */
    const agentListResponse = await getAgentList({})
    const agentList = agentListResponse?.data || []
    /** 获取字典接口 */
    const agentTypeCodeListResponse = await getCodeDetailList({ codeVal: AgentDictionaryTypeEnum.agentTypeCode })
    const agentTypeCodeList = agentTypeCodeListResponse.data || []
    const result = agentList.map(i => {
      const title = agentTypeCodeList.find(item => item.codeVal === i)?.codeKey
      return {
        name: i,
        title,
      }
    })
    setProxyTabList(result)
    setProxyType(model || result[0]?.name)
    setFilterForm({ model: model || agentList[0] })
    setIsLoading(false)
  }
  useEffect(() => {
    fetchAgentDetailBatchCode()
    setTabSwitch()
  }, [])
  useUnmount(() => {
    store.resetFilterSettingCheckMoreV2()
  })

  const [selectedStates, setSelectedState] = useState<GetDetailListRequest[]>([])

  function resetSelectedStates() {
    setSelectedState([])
  }
  function setSelectedStatesPop() {
    const lastState = selectedStates[selectedStates.length - 1]
    setSelectedState(prev => {
      return prev.slice(0, prev.length - 1)
    })
    return lastState
  }

  function setSelectedStatesPush(toBeSavedState) {
    const storedState = selectedStates[selectedStates.length - 1]

    setSelectedState(prev => {
      return [...prev, toBeSavedState]
    })
  }

  const getUpperState = () => {
    const lastState = setSelectedStatesPop()
    lastState && setFilterForm(lastState)
  }

  const currentSearchUid = filterForm.uid
  const isShowUpperButton = selectedStates.length > 0

  return (
    <div className={`${styles.scoped}`}>
      <Sticky offsetTop={0}>
        <NavBar title={t`features_agent_common_agent_layout_index_8s0ijmnjld`} />
        <div className="tab-switch">
          {proxyTabList.length ? (
            <Tabs align="start" active={proxyType} onChange={activeTabVal => switchChange(activeTabVal)}>
              {proxyTabList.map(i => {
                return <Tabs.TabPane titleClass="tab-title" key={i.name} name={i.name} title={`${i.title}`} />
              })}
            </Tabs>
          ) : null}
        </div>
        <div className="filter-row">
          <div className="left-input">
            <AgentSearchBar
              inputValue={currentSearchUid}
              onChange={val => {
                const parentUid = filterForm.parentUid
                setFilterForm({
                  uid: val || parentUid,
                })
              }}
              placeholder={t`features_agent_agent_invite_invite_check_more_v3_index_sozu1ult4g`}
            />
          </div>

          <div className="right-filter-icon">
            <Icon name="asset_record_filter" hasTheme onClick={() => setFilterFormVisible(true)} />
          </div>
        </div>
      </Sticky>

      <AgentInviteCheckMoreDisplayTable
        proxyType={proxyType}
        setSelectedStatesPush={setSelectedStatesPush}
        hierarchy={selectedStates.length}
        dictionary={dictionary}
      />
      <AgentInviteCheckMoreFilterFormPopover
        onCloseFunc={() => setFilterFormVisible(false)}
        visible={filterFormVisible}
        dictionary={dictionary}
        proxyType={proxyType}
        ref={formRef}
      />
      <div className="return-back-upper-level" hidden={!isShowUpperButton} onClick={getUpperState}>
        <span className="return-button mx-1">{t`features_agent_agent_invite_invite_check_more_v2_invitation_details_v2_index_rkrb6lduce`}</span>
      </div>
      <div className="to-top">
        <ScrollToTopButton />
      </div>
      <FullScreenLoading isShow={isLoading} className="h-screen" />
    </div>
  )
}

export default AgentInviteCheckMoreV3
