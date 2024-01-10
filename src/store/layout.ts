import { create } from 'zustand'
import { createTrackedSelector } from 'react-tracked'
import produce from 'immer'
import { YapiGetV1HomeWebsiteGetData } from '@/typings/yapi/HomeWebsiteGetDataV1GetApi'
import { TlayoutProps } from '@/typings/api/layout'
import { extractHeaderData } from '@/helper/layout/header'
import { extractFooterData } from '@/helper/layout/footer'
import { devtools } from 'zustand/middleware'

type TLayoutStore = ReturnType<typeof getStore>

function getStore(set) {
  return {
    layoutProps: {} as YapiGetV1HomeWebsiteGetData | TlayoutProps | undefined,
    setLayoutProps: (layoutProps?: YapiGetV1HomeWebsiteGetData | TlayoutProps | undefined) =>
      set(() => {
        if (layoutProps) {
          // temporary until customer service feature is ready
          // layoutProps.customerJumpUrl = '/stay-tuned'
          return { layoutProps }
        }
        return {
          // temporary until customer service feature is ready
          // app 可以复现，首次进入的时候，layout props 没有被加载，导致客服页面跳转错误等问题
          customerJumpUrl: '/stay-tuned',
        }
      }),
    footerData: undefined as ReturnType<typeof extractFooterData>,
    setFooterData: data =>
      set(
        produce((draft: TLayoutStore) => {
          draft.footerData = data
        })
      ),

    headerData: { businessName: '' } as ReturnType<typeof extractHeaderData>,
    setHeaderData: data =>
      set(
        produce((draft: TLayoutStore) => {
          draft.headerData = data
        })
      ),
    columnsDataByCd: {} as Record<string, any>,
    setColumnsDataByCd: data =>
      set(
        produce((draft: TLayoutStore) => {
          draft.columnsDataByCd = data
        })
      ),
    guidePageBasicWebInfo: {} as any,
    setGuidePageBasicWebInfo: data =>
      set(
        produce((draft: TLayoutStore) => {
          draft.guidePageBasicWebInfo = data
        })
      ),
  }
}
const baseLayoutStore = create(devtools(getStore, { name: 'layout-store' }))

const useLayoutStore = createTrackedSelector(baseLayoutStore)

export { useLayoutStore, baseLayoutStore }
