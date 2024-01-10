import { useEffect, useState } from 'react'
import { useRequest } from 'ahooks'
import FrontPageContainer from '@/features/front-page/common/container'
import LazyImage, { Type } from '@/components/lazy-image'
import { useLayoutStore } from '@/store/layout'
import { useCommonStore } from '@/store/common'
import { getCommunityGroups } from '@/apis/community-groups'
import { HomeCommunityGroupsType } from '@/typings/api/community-groups'
import { link } from '@/helper/link'
import { t } from '@lingui/macro'
import { getGuidePageComponentInfoByKey } from '@/helper/layout'
import styles from './index.module.css'
import ShouldGuidePageComponentDisplay from '../../common/component-should-display'

function FrontPageCommunity() {
  const [groupsData, setGroupsData] = useState<Array<HomeCommunityGroupsType>>([])

  const { locale, businessId } = useCommonStore()
  const { businessName, webTitle } = useLayoutStore().layoutProps || {}
  const { pageInfoCommunity } = useLayoutStore().guidePageBasicWebInfo || []

  const mainTitle = getGuidePageComponentInfoByKey('mainTitle', pageInfoCommunity)
  const subtitle = getGuidePageComponentInfoByKey('subtitle', pageInfoCommunity)
  const image = getGuidePageComponentInfoByKey('image', pageInfoCommunity)
  const imageMainTitle = getGuidePageComponentInfoByKey('imageMainTitle', pageInfoCommunity)
  const imageSubTitle = getGuidePageComponentInfoByKey('imageSubTitle', pageInfoCommunity)

  const pageCommunityData = async () => {
    const params = {
      businessId,
      lanType: locale,
    }
    const { isOk, data } = await getCommunityGroups(params)
    if (!isOk) return
    setGroupsData(data || [])
  }

  const { run } = useRequest(pageCommunityData, { manual: true })

  useEffect(() => {
    run()
  }, [])

  return (
    <FrontPageContainer
      title={
        <ShouldGuidePageComponentDisplay {...mainTitle}>
          {mainTitle?.value /* || t`features_front_page_components_community_index_o_1trq8rkc` */}
        </ShouldGuidePageComponentDisplay>
      }
      subTitle={
        <ShouldGuidePageComponentDisplay {...subtitle}>
          {subtitle?.value /* || t`features_front_page_components_community_index_pik6o7n4jz` */}
        </ShouldGuidePageComponentDisplay>
      }
    >
      <div className={`community ${styles.scoped}`}>
        <div className="image">
          <ShouldGuidePageComponentDisplay {...image}>
            <LazyImage
              className="w-full"
              src={image?.value /* || `${oss_svg_image_domain_address}home_page/join_pic` */}
            />
          </ShouldGuidePageComponentDisplay>
          <div className="content">
            {businessName && (
              <ShouldGuidePageComponentDisplay {...imageMainTitle}>
                <div className="name">
                  <label>{businessName /* || businessName */}</label>
                </div>
              </ShouldGuidePageComponentDisplay>
            )}
            <ShouldGuidePageComponentDisplay {...imageSubTitle}>
              <div className="describe">
                <p>{t`features_front_page_components_community_index_o_1trq8rkc`}</p>
                <p>{t`features_front_page_components_community_index_cvlcjptxmu`}</p>
              </div>
            </ShouldGuidePageComponentDisplay>
          </div>
        </div>

        <div className="community-group">
          {groupsData?.map((v, index) => (
            <div className="item" key={index} onClick={() => link(v.linkUrl, { target: true })}>
              <div className="icon">
                <LazyImage src={v.imgIcon} />
              </div>

              <div className="name">
                <label>{v.groupName}</label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FrontPageContainer>
  )
}

export default FrontPageCommunity
