import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import Icon from '@/components/icon'
import LazyImage from '@/components/lazy-image'
import { useCommonStore } from '@/store/common'
import { useLayoutStore } from '@/store/layout'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { getAgentRebateRulesRoutePath } from '@/helper/route/agent'
import styles from './index.module.css'

export default function RebateHeader() {
  const commonState = useCommonStore()
  const { headerData } = useLayoutStore()

  return (
    <div className={styles['rebate-header-wrap']}>
      <p className="rebate-header-text">{t`features_agent_agent_invitation_rebate_component_rebate_header_index_dryeubusw4`}</p>
      <span className="rebate-header-desc">{`${t`features_agent_agent_invitation_rebate_component_rebate_header_index_0s84imv2k2`} ${
        headerData?.businessName || ''
      } ${t`features_agent_agent_invitation_rebate_component_rebate_header_index_r6bqj0i_t6`}`}</span>
      <LazyImage
        src={`${oss_svg_image_domain_address}agent/v3/new_invite_rebate${
          commonState?.theme === 'dark' ? '_black' : '_white'
        }.png`}
      />
      <div
        className="process-wrap"
        // style={{
        //   height: commonState?.locale !== I18nsEnum['zh-HK'] ? '146px' : '108px',
        // }}
      >
        <div
          className="process"
          //   style={{
          //     height: commonState?.locale !== I18nsEnum['zh-HK'] ? '98px' : '70px',
          //   }}
        >
          <div className="process-item">
            <Icon hasTheme className="common-icon" name="rebate_icon_invitation" />
          </div>
          <label className="process-text">{t`features_agent_invite_operation_index_5101446`}</label>
        </div>
        <Icon hasTheme className="process-wrap-icon" name="icon_agent_arrow" />
        <div className="process">
          <div className="process-item">
            <Icon hasTheme className="common-icon" name="rebate_icon_registration" />
          </div>
          <label className="process-text">{t`features_agent_agent_invitation_rebate_component_rebate_header_index_4lckfisg0r`}</label>
        </div>
        <Icon hasTheme className="process-wrap-icon" name="icon_agent_arrow" />
        <div className="process width-set">
          <div className="process-item">
            <Icon hasTheme className="common-icon" name="rebate_icon_transaction" />
          </div>
          <label className="process-text">{t`features_agent_agent_invitation_rebate_component_rebate_header_index_5ibb6fishh`}</label>
        </div>
      </div>
      <div className="rebate-header-rulers" onClick={() => link(getAgentRebateRulesRoutePath())}>
        {t`features_agent_agent_invitation_rebate_component_rebate_header_index_7ajx_ahuyp`}
      </div>
    </div>
  )
}
