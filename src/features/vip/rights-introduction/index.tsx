import NavBar from '@/components/navbar'
import Icon from '@/components/icon'
import { useEffect, useMemo, useState } from 'react'
import { Button, Tabs } from '@nbit/vant'
import { t } from '@lingui/macro'
import classNames from 'classnames'
import LazyImage from '@/components/lazy-image'
import { link } from '@/helper/link'
import { getCodeDetailList } from '@/apis/common'
import { useCommonStore } from '@/store/common'
import { useMount } from 'ahooks'
import { ThemeEnum } from '@/constants/base'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import { useUserStore } from '@/store/user'
import { useVipCenterStore } from '@/store/vip'
import { usePageContext } from '@/hooks/use-page-context'
import styles from './index.module.css'
import {
  LEVEL_RATE_CODE,
  RIGHTS_LIST_DIC_CODE,
  SPECIAL_AVATAR_CODE,
  VIP_LEVEL_ICON_MAP,
  VIP_RIGHTS_ICON_MAP,
} from '../common'

interface dataDictionaryType {
  [key: string]: string
}

export default function RightsIntroduction() {
  const pageContext = usePageContext()
  const { locale, theme } = useCommonStore()
  const { userInfo } = useUserStore()
  const { getVipRightsList, vipRightsList } = useVipCenterStore()
  const level = useMemo(() => {
    return userInfo?.levelCode?.slice(2) || 0
  }, [userInfo?.levelCode])
  const benefitCode = pageContext.urlParsed.search?.benefitCode

  const [index, setIndex] = useState<string | number>(0)
  const [recordType, setRecordType] = useState<dataDictionaryType>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getVipRightsList()
  }, [getVipRightsList])

  useEffect(() => {
    if (vipRightsList && vipRightsList.length > 0) setLoading(false)
  }, [vipRightsList])

  useEffect(() => {
    if (benefitCode) {
      const idx = vipRightsList.findIndex(i => i.benefitCode === benefitCode)
      setTimeout(() => {
        setIndex(idx || 0)
      }, 300)
    }
  }, [benefitCode, vipRightsList])

  const getRecordsType = async () => {
    const res = await getCodeDetailList({ codeVal: RIGHTS_LIST_DIC_CODE, lanType: locale })
    if (res.isOk && res.data) {
      const data: dataDictionaryType = {}
      res.data.forEach(item => (data[item?.codeVal] = item?.codeKey))
      setRecordType(data)
    }
  }

  useMount(() => {
    getRecordsType()
  })

  const isSpecialRight = benefitCode => {
    return vipRightsList[index]?.benefitCode === benefitCode
  }

  const onClick = () => {
    if (isSpecialRight(LEVEL_RATE_CODE)) {
      link('/vip/vip-funding')
    }
    if (isSpecialRight(SPECIAL_AVATAR_CODE)) {
      link('/vip/special-avatar')
    }
  }

  return (
    <section className={styles['rights-introduction-page']}>
      <FullScreenLoading isShow={loading} className="h-screen" mask />

      <NavBar title={t`modules_user_personal_center_vip_rights_introduction_index_page_p35loycub3`} />
      <div className="wrap">
        {vipRightsList && vipRightsList.length > 0 ? (
          <Tabs
            swipeable
            lazyRender={false}
            swipeThreshold={3}
            animated
            active={index}
            onChange={idx => setIndex(idx)}
            className={classNames({
              first: index === 0,
              last: index === vipRightsList.length - 1,
            })}
          >
            {vipRightsList.map(i => (
              <Tabs.TabPane key={i.benefitCode} title={recordType?.[i.benefitCode] || ''}>
                <div
                  className={classNames('tab-pane-item', {
                    dark: ThemeEnum.dark === theme,
                  })}
                >
                  <LazyImage src={VIP_RIGHTS_ICON_MAP[i.benefitCode]} className="rights-icon" />

                  <div className="title">{recordType?.[i.benefitCode] || ''}</div>
                  <div className="title-desc">{i.description}</div>
                  <div className="subtitle">
                    <Icon name="icon_rights_text" className="icon" hasTheme />
                    {t`modules_user_personal_center_vip_rights_introduction_index_page_p35loycub3`}
                  </div>
                  <div className="subtitle-desc">{i.introduction}</div>
                  <div className="subtitle">
                    <Icon name="icon_rights_man" className="icon" hasTheme />
                    {t`features_user_personal_center_vip_rights_introduction_index_bzxwp_6eqx`}
                  </div>
                  <div
                    className="subtitle-desc"
                    dangerouslySetInnerHTML={{
                      __html: t({
                        id: 'features_user_personal_center_vip_rights_introduction_index_10insqigof',
                        values: { 0: i.levelCode },
                      }),
                    }}
                  />

                  <div className="subtitle">
                    <Icon name="icon_rights_crown" className="icon" hasTheme />
                    {t`features_user_personal_center_vip_rights_introduction_index_v5jmz8p5od`}
                  </div>
                  <div className="subtitle-desc">
                    <LazyImage src={VIP_LEVEL_ICON_MAP[userInfo?.levelCode]} className="level-icon" />
                  </div>
                </div>
                <div className="light-bar" />
              </Tabs.TabPane>
            ))}
          </Tabs>
        ) : (
          <div />
        )}

        <div className="btn-wrap">
          <Button
            nativeType="submit"
            type="primary"
            block
            className={classNames('button', {
              'over-level':
                !isSpecialRight(LEVEL_RATE_CODE) &&
                !isSpecialRight(SPECIAL_AVATAR_CODE) &&
                level < vipRightsList[index]?.level,
              'finish':
                !isSpecialRight(LEVEL_RATE_CODE) &&
                !isSpecialRight(SPECIAL_AVATAR_CODE) &&
                level >= vipRightsList[index]?.level,
            })}
            onClick={onClick}
          >
            {isSpecialRight(LEVEL_RATE_CODE)
              ? t`features_user_personal_center_vip_rights_introduction_index_nw0ycl8int`
              : isSpecialRight(SPECIAL_AVATAR_CODE)
              ? t`features_user_personal_center_vip_rights_introduction_index_tmz2tgwvrh`
              : level >= vipRightsList[index]?.level
              ? t`features_user_personal_center_vip_rights_introduction_index_b3yzmcx3mm`
              : t`features_user_personal_center_vip_rights_introduction_index_ymxdsabuxt`}
          </Button>
        </div>
      </div>
    </section>
  )
}
