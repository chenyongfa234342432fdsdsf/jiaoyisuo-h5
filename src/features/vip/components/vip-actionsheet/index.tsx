import { ActionSheet } from '@nbit/vant'
import Icon from '@/components/icon'
import LazyImage from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import Link from '@/components/link'
import { t } from '@lingui/macro'
import { baseVipCenterStore } from '@/store/vip'
import { useEffect, useMemo, useState } from 'react'
import { getV1MemberVipBaseConfigListApiRequest } from '@/apis/vip'
import styles from './index.module.css'
import { VIP_DERIVE_AS_ICON_MAP } from '../../common'

export default function VipActionSheet({ title, visible, setVisible, list }) {
  const { vipBaseInfo } = baseVipCenterStore.getState()
  const [configList, setConfigList] = useState<any>([])

  const getConfigList = async () => {
    const res: any = await getV1MemberVipBaseConfigListApiRequest({})
    if (res?.isOk) {
      const cur = res?.data.find(i => i.levelCode === vipBaseInfo.levelCode)
      if (cur && cur.derivatives) {
        setConfigList(cur.derivatives)
      }
    }
  }

  useEffect(() => {
    getConfigList()
  }, [])

  const filterList = useMemo(() => {
    return list[0]?.id ? list?.filter(i => configList.includes(i.vipDerivative)) : list
  }, [configList, list])

  const getDeriIcon = url => {
    const iconUrl = Object.keys(VIP_DERIVE_AS_ICON_MAP)
    const icon = iconUrl.find(key => url?.includes(key)) || ''
    return VIP_DERIVE_AS_ICON_MAP?.[icon]
  }
  return (
    <>
      <ActionSheet className={`${styles['vip-action-sheet']}`} visible={visible} onCancel={() => setVisible(false)}>
        <div className="container">
          <div className="header">
            <div className="title">{title}</div>
            <div className="close" onClick={() => setVisible(false)}>
              <Icon name="close" hasTheme />
            </div>
          </div>
          <div className="action-list">
            {filterList && filterList.length > 0
              ? filterList.map(item => (
                  <Link key={item?.title} href={item?.url}>
                    <div className="action-item">
                      <div>
                        <div className="item-title">{item?.title}</div>
                        <div className="item-desc">{item?.desc}</div>
                        <div className="item-btn">
                          <span className="item-btn-text">{t`features_user_personal_center_components_vip_actionsheet_index__kjsrva8mf`}</span>
                          <span className="item-btn-icon-wrap">
                            <Icon name="icon_agent_next" />
                          </span>
                        </div>
                      </div>
                      <div className="item-icon-wrap">
                        <LazyImage
                          src={`${item?.id ? getDeriIcon(item.icon) : oss_svg_image_domain_address + item.icon}`}
                        />
                      </div>
                    </div>
                  </Link>
                ))
              : null}
          </div>
        </div>
      </ActionSheet>
    </>
  )
}
