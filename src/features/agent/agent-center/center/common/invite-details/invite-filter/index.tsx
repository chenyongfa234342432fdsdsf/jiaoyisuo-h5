/**
 * 代理中心 - 邀请详情 - 筛选组件
 */
import Icon from '@/components/icon'
import {
  AgentModalTypeEnum,
  InviteDetailRegisterSortTypeEnum,
  getInviteDetailRegisterSortIcon,
  setInviteDetailRegisterSort,
} from '@/constants/agent/agent-center/center'
import { useAgentCenterStore } from '@/store/agent/agent-center/center'
import { Popover, PopoverInstance, Sticky } from '@nbit/vant'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { AgentCenterChildInviteListReq, AgentCenterInviteDetailReq } from '@/typings/api/agent/agent-center/center'
import { onGetAreaAgentLevelList } from '@/helper/agent/center'
import { SearchInput } from '@/features/assets/common/search-input'
import { t } from '@lingui/macro'
import { isApp } from '@/helper/is-app'
import styles from '../layout/index.module.css'
import { InviteFilterModal } from '../invite-filter-modal'

interface InviteFilterProps {
  form: AgentCenterInviteDetailReq | AgentCenterChildInviteListReq
  uidVisible?: boolean
  uidInputVisible?: boolean
  model?: string
  onChange: (e) => void
  onSearchUid?: () => void
}

function InviteFilter(props: InviteFilterProps) {
  const levelPopover = useRef<PopoverInstance>(null)
  const { form, uidVisible = true, uidInputVisible = false, model, onChange, onSearchUid } = props || {}
  const { currentModalTab, areaAgentLevelList } = useAgentCenterStore() || {}
  const [isOpen, setIsOpen] = useState(false)
  const [filterVisible, setFilterVisible] = useState(false)
  const agentModel = model ?? currentModalTab

  const onChangeRegisterDateSort = () => {
    if (form?.registerDateSort) {
      const newSort = setInviteDetailRegisterSort(form?.registerDateSort)
      onChange({ registerDateSort: newSort })
    }
  }

  const onChangeLevel = (level: number | string) => {
    onChange({ rebateLevel: level })
    levelPopover.current?.hide()
  }

  useEffect(() => {
    agentModel === AgentModalTypeEnum.area && onGetAreaAgentLevelList()
  }, [])

  return (
    <>
      <Sticky offsetTop={isApp() ? 0 : 46}>
        <div className={styles['invite-filter-wrap']}>
          {uidInputVisible && (
            <SearchInput
              value={form.uid ? `${form.uid}` : ''}
              placeholder={t`features_agent_agent_center_center_common_invite_details_invite_filter_index_cwvj2ftqse`}
              onChange={val => onChange({ uid: val })}
              className="search-input-wrapper"
            />
          )}
          {uidVisible && (
            <div className="filter-search" onClick={onSearchUid}>
              <Icon name="search" hasTheme className="search-icon" />
              <div className="search-hint">
                {form?.uid || t`features_agent_agent_invite_invite_info_invite_info_content_list_search_index_5101399`}
              </div>
            </div>
          )}

          <div className={`filter-sort-wrap ${!uidInputVisible && !uidVisible && '!mt-0'}`}>
            <div className="flex items-center">
              <div className="filter-cell" onClick={onChangeRegisterDateSort}>
                <div className="filter-label">{t`features_trade_future_c2c_25101571`}</div>

                <Icon
                  name={
                    getInviteDetailRegisterSortIcon(
                      form?.registerDateSort || InviteDetailRegisterSortTypeEnum.default
                    ) || ''
                  }
                  hasTheme
                  className="sort-icon"
                  onClick={() =>
                    onChange({
                      registerDateSort: setInviteDetailRegisterSort(
                        form?.registerDateSort || InviteDetailRegisterSortTypeEnum.default
                      ),
                    })
                  }
                />
              </div>

              {currentModalTab === AgentModalTypeEnum.area && (
                <div className="filter-cell ml-6">
                  <div className="filter-label">{t`features_agent_agent_center_center_common_invite_details_invite_filter_index_loe8l6m3wy`}</div>
                  <Popover
                    ref={levelPopover}
                    className={styles['level-popover-root']}
                    placement="bottom"
                    reference={
                      <div className="flex items-center">
                        <div className="filter-label">
                          {!form?.rebateLevel
                            ? t`constants_market_market_list_market_module_index_5101071`
                            : `V${form?.rebateLevel}`}
                        </div>
                        <Icon name={isOpen ? 'icon_agent_away' : 'icon_agent_drop'} hasTheme className="sort-icon" />
                      </div>
                    }
                    onOpened={() => setIsOpen(true)}
                    onClosed={() => setIsOpen(false)}
                  >
                    <div
                      className={classNames('level-popover-cell', {
                        active: !form?.rebateLevel,
                      })}
                      onClick={() => onChangeLevel('')}
                    >{t`constants_market_market_list_market_module_index_5101071`}</div>
                    {areaAgentLevelList?.map((level: number) => {
                      return (
                        <div
                          className={classNames('level-popover-cell', {
                            active: form?.rebateLevel && form?.rebateLevel === level,
                          })}
                          key={level}
                          onClick={() => onChangeLevel(level)}
                        >
                          V{level}
                        </div>
                      )
                    })}
                  </Popover>
                </div>
              )}
            </div>

            <Icon name="asset_record_filter" hasTheme className="filter-icon" onClick={() => setFilterVisible(true)} />
          </div>
        </div>
      </Sticky>

      {filterVisible && (
        <InviteFilterModal
          {...props}
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          model={agentModel}
        />
      )}
    </>
  )
}

export { InviteFilter }
