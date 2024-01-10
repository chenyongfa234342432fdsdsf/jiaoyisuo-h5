import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import classNames from 'classnames'
import { ReactNode } from 'react'
import styles from './index.module.css'

type propsType = {
  /** pop 弹窗的位置左或者右 */
  tipPosition: 'left' | 'right'
  /** 好友名称 */
  name: string
  /** 对话框的显示内容 */
  popTip: ReactNode
}
export default function PyramidFriend({ tipPosition, name, popTip }: propsType) {
  return (
    <div className={classNames(styles['earn-col'])}>
      <div className="friend-icon-bg">
        <Icon className="peo-icon" hasTheme name="icon_agent_pyramid_friends" />
      </div>
      <span className="common-step-text text-center mt-2">
        {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101409`}
        <span>{name}</span>
      </span>
      <div
        className={classNames('common-pop', {
          'common-left-pop': tipPosition === 'left',
          'common-right-pop': tipPosition === 'right',
        })}
      >
        {popTip}
      </div>
    </div>
  )
}
