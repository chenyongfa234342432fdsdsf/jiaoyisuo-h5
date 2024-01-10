/**
 * 代理中心 - 返佣总览
 */
import { useRef, useState } from 'react'
import Icon from '@/components/icon'
import { CommonDigital, DigitalModuleTypeEnum } from '@/components/common-digital'
import { Popover, PopoverInstance } from '@nbit/vant'
import { useAgentCenterStore } from '@/store/agent/agent-center/center'
import classNames from 'classnames'
import { getAgentCenterOverviewKeyByModalType, getAgentLevelIconName } from '@/constants/agent/agent-center/center'
import { IAgentRebateOverview } from '@/typings/api/agent/agent-center/center'
import { t } from '@lingui/macro'
import RebateLadderPopup from '@/features/agent/agent-invitation-rebate/component/rebate-ladder-popup'
import { rateFilterAgent } from '@/helper/agent/center'
import styles from './index.module.css'
import { AgentCurrencyModal } from '../../currency-modal/intex'

interface IRebatesOverviewProps {
  /** 是否展示返佣金额 */
  showRebatesAmount?: boolean
  /** 返佣金额标题 */
  rebatesAmountTitle?: string
  /** 是否展示返佣阶梯 */
  showRebatesLadder?: boolean
  /** 返佣阶梯标题 */
  rebatesLadderTitle?: string
  /** 代理模式 */
  agentMode?: string
}

function RebatesOverview(props: IRebatesOverviewProps) {
  const popover = useRef<PopoverInstance>(null)
  const {
    showRebatesAmount = true,
    rebatesAmountTitle = t`features_agent_agent_center_center_common_rebates_overview_index_4htavjcrg2`,
    showRebatesLadder = true,
    rebatesLadderTitle = t`features_agent_agent_center_center_common_rebates_overview_index_4kwqtfef2c`,
  } = props || {}
  const {
    encryption,
    agentCenterOverview,
    currentCurrency,
    currentModalTab,
    agentCurrencyList,
    updateEncryption,
    updateCurrentCurrency,
  } = useAgentCenterStore() || {}
  const overviewData: IAgentRebateOverview = agentCenterOverview[getAgentCenterOverviewKeyByModalType(currentModalTab)]
  const { rebateAmount, rebateRatio, firstRebateRatio, secondRebateRatio, thirdRebateRatio, rebateLevel } =
    overviewData || {}
  const [currencyVisible, setCurrencyVisible] = useState(false)
  const [ladderVisible, setLadderVisible] = useState(false)
  const [currencyMore, setCurrencyMore] = useState(false)

  const onRenderRebateRatio = (label: string, ratio: string) => {
    return (
      <div className="ratio-cell">
        <div className="ratio-label">{label}</div>
        <CommonDigital
          content={`${ratio || '0'}%`}
          className="rebate-ratio"
          isEncrypt
          moduleType={DigitalModuleTypeEnum.agent}
          ellipsis="**"
        />
      </div>
    )
  }

  return (
    <>
      <div className={styles['rebates-overview-root']}>
        {showRebatesAmount && (
          <div className="overview-cell">
            <div className="label-wrap">
              <span className="label">{rebatesAmountTitle}</span>
              <Icon
                name={encryption ? 'eyes_close' : 'eyes_open'}
                hasTheme
                className="amount-hide-icon"
                onClick={() => updateEncryption(!encryption)}
              />
            </div>

            <div className="rebates-amount-wrap">
              <CommonDigital
                content={rateFilterAgent(rebateAmount)}
                className="lump-sum"
                isEncrypt
                moduleType={DigitalModuleTypeEnum.agent}
              >
                <Popover
                  ref={popover}
                  className={styles['unit-popover-wrapper']}
                  placement="bottom"
                  reference={
                    encryption ? (
                      ''
                    ) : (
                      <div className="unit-switch">
                        <div className="unit">{currentCurrency?.currencyEnName || '--'}</div>
                        <Icon
                          name={currencyMore ? 'regsiter_icon_away' : 'regsiter_icon_drop'}
                          hasTheme
                          className="drop-icon"
                        />
                      </div>
                    )
                  }
                  onOpen={() => setCurrencyMore(true)}
                  onClosed={() => setCurrencyMore(false)}
                >
                  {agentCurrencyList?.map((unitInfo, i: number) => {
                    if (i + 1 > 3) return null
                    return (
                      <div
                        key={unitInfo?.currencyEnName}
                        className={classNames('unit-cell', {
                          active: currentCurrency?.currencyEnName === unitInfo?.currencyEnName,
                        })}
                        onClick={() => {
                          updateCurrentCurrency(unitInfo)
                          popover.current?.hide()
                        }}
                      >
                        {unitInfo?.currencyEnName}
                      </div>
                    )
                  })}
                  {agentCurrencyList?.length > 3 && (
                    <div
                      className="unit-more"
                      onClick={() => {
                        setCurrencyVisible(true)
                        popover.current?.hide()
                      }}
                    >
                      <div className="more-text">{t`features_home_more_toolbar_header_toolbar_index_510105`}</div>
                      <Icon name="assets_more" hasTheme className="more-icon" />
                    </div>
                  )}
                </Popover>
              </CommonDigital>
            </div>
          </div>
        )}

        {showRebatesLadder && (
          <div className="overview-cell mt-4">
            <div className="label-wrap">
              <span className="label">{rebatesLadderTitle}</span>
              <Icon name="msg" hasTheme className="msg-icon" onClick={() => setLadderVisible(true)} />
            </div>
            <div className="ladder-wrap">
              {rebateLevel && <Icon name={getAgentLevelIconName(rebateLevel) || ''} className="level-icon" />}
              {rebateRatio && (
                <CommonDigital
                  content={`${rebateRatio || '--'}%`}
                  className="rebate-ratio"
                  isEncrypt
                  moduleType={DigitalModuleTypeEnum.agent}
                />
              )}

              {firstRebateRatio &&
                onRenderRebateRatio(
                  t`features_agent_agent_center_center_common_rebates_overview_index_2lve2pw1yc`,
                  firstRebateRatio
                )}
              {secondRebateRatio &&
                onRenderRebateRatio(
                  t`features_agent_agent_center_center_common_rebates_overview_index_n0nkwzajma`,
                  secondRebateRatio
                )}
              {thirdRebateRatio &&
                onRenderRebateRatio(
                  t`features_agent_agent_center_center_common_rebates_overview_index_8e3aueqbdb`,
                  thirdRebateRatio
                )}
            </div>
          </div>
        )}
      </div>

      {currencyVisible && <AgentCurrencyModal visible={currencyVisible} onClose={() => setCurrencyVisible(false)} />}
      {ladderVisible && (
        <RebateLadderPopup mode={currentModalTab} visible={ladderVisible} setVisible={setLadderVisible} />
      )}
    </>
  )
}

export { RebatesOverview }
