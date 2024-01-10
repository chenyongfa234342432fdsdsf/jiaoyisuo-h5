import { useLayoutStore } from '@/store/layout'
import FrontPageContainer from '@/features/front-page/common/container'
import { t } from '@lingui/macro'
import {
  YapiGetV1HomeColumnGetListChildColumnsListColumnsDatasData,
  YapiGetV1HomeColumnGetListColumnsDatasData,
} from '@/typings/yapi/HomeColumnGetListV1GetApi'
import { TlayoutProps } from '@/typings/api/layout'
import Link from '@/components/link'
import { determineRedirectionUrl } from '@/helper/layout/footer'
import { useRef } from 'react'
import { useScaleDom } from '@/hooks/use-scale-dom'
import { isEmpty } from 'lodash'
import { flattenArrToObj, getGuidePageComponentInfoByKey } from '@/helper/layout'
import styles from './index.module.css'
import ShouldGuidePageComponentDisplay from '../../common/component-should-display'

function FrontPageServiceSupport() {
  const { footerData } = useLayoutStore() || {}
  const contactUsData = {
    isWeb: 1,
    homeColumnName: t`features_front_page_components_service_support_index_ajx3jfy_l8`,
    childColumns: [
      {
        homeColumnName: t`features_front_page_components_service_support_index_cxsjd2iorz`,
        isWeb: 1,
        homeColumnCd: 'emailCustomer',
      },
      {
        isWeb: 1,
        homeColumnName: t`features_front_page_components_service_support_index_ltjpdpunqk`,
        homeColumnCd: 'emailProduct',
      },
      {
        isWeb: 1,
        homeColumnName: t`features_front_page_components_service_support_index_gldz5xz7f2`,
        homeColumnCd: 'emailBusiness',
      },
      {
        isWeb: 1,
        homeColumnName: t`features_front_page_components_service_support_index_mcxvl1yhfg`,
        homeColumnCd: 'emailJudiciary',
      },
    ] as YapiGetV1HomeColumnGetListChildColumnsListColumnsDatasData[],
  } as YapiGetV1HomeColumnGetListColumnsDatasData

  let list = [...(footerData?.columnsDatas || []), contactUsData]
  // list = list.filter(Boolean)

  const containerRef = useRef<HTMLDivElement>(null)

  const { layoutProps, guidePageBasicWebInfo } = useLayoutStore() || {}
  const { pageInfoServiceSupport } = guidePageBasicWebInfo || {}
  const footerMenuConfig = flattenArrToObj(pageInfoServiceSupport)

  const mainTitle = footerMenuConfig?.mainTitle
  const subtitle = footerMenuConfig?.subtitle

  return (
    <FrontPageContainer
      title={<ShouldGuidePageComponentDisplay {...mainTitle}>{mainTitle?.value}</ShouldGuidePageComponentDisplay>}
      subTitle={<ShouldGuidePageComponentDisplay {...subtitle}>{subtitle?.value}</ShouldGuidePageComponentDisplay>}
    >
      <div className={`service-support ${styles.scoped}`}>
        {list?.map((item, index) => {
          // filter out empty footer list
          if (isEmpty(item?.childColumns)) return <></>
          return (
            <ShouldGuidePageComponentDisplay key={index} {...footerMenuConfig?.[item.homeColumnCd]}>
              <div ref={containerRef} className="item">
                <div className="title">
                  <label>{item?.homeColumnName}</label>
                </div>

                {item?.childColumns?.map((v, row) => (
                  <div className="options" key={row}>
                    <div>
                      <label>{contactUsOrLink(v, layoutProps)}</label>
                    </div>
                  </div>
                ))}
              </div>
            </ShouldGuidePageComponentDisplay>
          )
        })}
      </div>
    </FrontPageContainer>
  )
}

// function ResponsiveCellItem({ data, maxWidth }) {
//   const { layoutProps } = useLayoutStore() || {}
//   const autoScaleRef = useScaleDom(maxWidth, 0)

//   return (
//     <div className="options">
//       <div ref={autoScaleRef}>
//         <label>{contactUsOrLink(data, layoutProps)}</label>
//       </div>
//     </div>
//   )
// }

function contactUsOrLink(
  data: YapiGetV1HomeColumnGetListColumnsDatasData['childColumns'][0],
  layoutProps?: TlayoutProps
) {
  if (layoutProps && layoutProps[data.homeColumnCd]) {
    const emailKey = data.homeColumnCd
    return (
      <span key={data.homeColumnName}>
        <a href={`mailto:${layoutProps[emailKey]}`} className="hover:text-brand_color whitespace-nowrap">
          {`${data.homeColumnName}: `} <span className="text-brand_color underline">{layoutProps[emailKey]}</span>
        </a>
      </span>
    )
  }
  return (
    <span key={data.homeColumnName}>
      <Link href={determineRedirectionUrl(data)} target={data.isLink === 1} className="hover:text-brand_color">
        {data.homeColumnName}
      </Link>
    </span>
  )
}

export default FrontPageServiceSupport
