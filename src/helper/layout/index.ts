import { getBasicWebApiData, getV1HomeColumnGetListApiRequest } from '@/apis/layout'
import { baseLayoutStore } from '@/store/layout'
import { TlayoutProps } from '@/typings/api/layout'
import {
  YapiGetV1HomeWebsiteGetData,
  YapiGetV1HomeWebsiteGetDataApiRequest,
} from '@/typings/yapi/HomeWebsiteGetDataV1GetApi'
import { extractFooterData, recursiveColumnMap } from './footer'
import { extractHeaderData } from './header'

async function getLayoutPropsWithFooter(
  lanType: YapiGetV1HomeWebsiteGetDataApiRequest['lanType'],
  bid: string
): Promise<TlayoutProps | undefined> {
  const businessId = bid
  if (businessId) {
    const params = { businessId, lanType }
    const req = Promise.all([getBasicWebApiData(params), getV1HomeColumnGetListApiRequest(params)])
    const res = await req
    return res[0].data && res[1].data
      ? {
          ...res[0].data,
          ...res[1].data,
        }
      : undefined
  }
}

async function getLayoutProps(
  lanType: YapiGetV1HomeWebsiteGetDataApiRequest['lanType'],
  bid: string
): Promise<YapiGetV1HomeWebsiteGetData | TlayoutProps | undefined> {
  return await getLayoutPropsWithFooter(lanType, bid)
}

function initializeLayoutStore(pageContext) {
  const layoutStore = baseLayoutStore.getState()
  const { setFooterData, setHeaderData, setLayoutProps, setColumnsDataByCd } = layoutStore
  const { layoutProps } = pageContext
  setLayoutProps(pageContext?.layoutProps)
  const headerData = extractHeaderData(layoutProps)
  const footerData = extractFooterData(layoutProps)
  setColumnsDataByCd(recursiveColumnMap(layoutProps?.columnsDatas || []))
  setHeaderData(headerData)
  setFooterData(footerData)
}

function getGuidePageComponentInfoByKey(key: string, componentInfo: []) {
  const found =
    componentInfo?.find(each => {
      const currentKey = Object.keys(each)[0]
      return key === currentKey
    }) || {}
  return found[key]
}

function flattenArrToObj(data) {
  return data?.reduce((p, c) => {
    const key = Object.keys(c)[0]
    const value = c[key]
    p[key] = value
    return p
  }, {})
}

export { getLayoutProps, initializeLayoutStore, getGuidePageComponentInfoByKey, flattenArrToObj }
