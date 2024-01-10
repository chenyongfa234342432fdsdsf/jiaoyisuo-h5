import FrontPageContainer from '@/features/front-page/common/container'
import { t } from '@lingui/macro'
import { useLayoutStore } from '@/store/layout'
import { getGuidePageComponentInfoByKey } from '@/helper/layout'
import LazyImage from '@/components/lazy-image'
import styles from './index.module.css'
import ShouldGuidePageComponentDisplay from '../../common/component-should-display'

function FrontPageServiceAdvantage() {
  // const itemList = [
  //   {
  //     title: t`features_front_page_components_service_advantage_index_ve4yw_cjvv`,
  //     text: t`features_front_page_components_service_advantage_index_crobjtdlsv`,
  //     icon: 'no_handling_fee',
  //   },
  //   {
  //     title: t`features_front_page_components_service_advantage_index_4qfanu451y`,
  //     text: t`features_front_page_components_service_advantage_index_blzjqcclpk`,
  //     icon: 'transaction_icon',
  //   },
  //   {
  //     title: t`features_front_page_components_service_advantage_index_ifvc2f53og`,
  //     text: t`features_front_page_components_service_advantage_index_paa2kjfsz3`,
  //     icon: 'secure_icon',
  //   },
  //   {
  //     title: t`features_front_page_components_service_advantage_index_baqspfd0o3`,
  //     text: t`features_front_page_components_service_advantage_index_uo0qnlxvmy`,
  //     icon: 'support_icon',
  //   },
  //   {
  //     title: t`features_front_page_components_service_advantage_index_o6mtkplnvy`,
  //     text: t`features_front_page_components_service_advantage_index_glm5ysg85w`,
  //     icon: 'stabilize_icon',
  //   },
  //   {
  //     title: t`features_help_center_support_index_5101072`,
  //     text: t`features_front_page_components_service_advantage_index_km9camsjqa`,
  //     icon: 'problem_icon',
  //   },
  // ]

  const { pageInfoAboutUs } = useLayoutStore().guidePageBasicWebInfo || {}

  const mainTitle = getGuidePageComponentInfoByKey('mainTitle', pageInfoAboutUs)
  const subtitle = getGuidePageComponentInfoByKey('subtitle', pageInfoAboutUs)
  const content = getGuidePageComponentInfoByKey('content', pageInfoAboutUs)
  const contentList = content?.value || []

  return (
    <FrontPageContainer
      title={
        <ShouldGuidePageComponentDisplay {...mainTitle}>
          {mainTitle?.value /* || t`features_front_page_components_service_advantage_index_i8g5wzvdfq` */}
        </ShouldGuidePageComponentDisplay>
      }
      subTitle={<ShouldGuidePageComponentDisplay {...subtitle}>{subtitle?.value}</ShouldGuidePageComponentDisplay>}
    >
      <div className={`service-advantage ${styles.scoped}`}>
        <ShouldGuidePageComponentDisplay {...content}>
          {contentList?.map((v, index) => (
            <div key={index} className="item">
              <div className="icon">
                <LazyImage src={v.contentIcon} className={'rounded-full'} />
              </div>

              <div className="content">
                <div className="title">
                  <label>{v.contentMainText}</label>
                </div>

                <div className="text">
                  <p>{v.contentSubText}</p>
                </div>
              </div>
            </div>
          ))}
        </ShouldGuidePageComponentDisplay>
      </div>
    </FrontPageContainer>
  )
}

export default FrontPageServiceAdvantage
