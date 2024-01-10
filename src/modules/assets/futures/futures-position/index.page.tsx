import { t } from '@lingui/macro'
import { getAssetsDefaultSeoMeta } from '@/helper/assets/overview'
import { FuturesPositionLayout } from '@/features/assets/futures/futures-position/layout'
import { baseAssetsFuturesStore } from '@/store/assets/futures'
import { FuturesPositionLayoutTabEnum } from '@/constants/assets/futures'

export function Page() {
  return <FuturesPositionLayout />
}

export async function onBeforeRender(pageContext) {
  const { activeTab } = baseAssetsFuturesStore.getState().futuresPosition
  return {
    pageContext: {
      documentProps: getAssetsDefaultSeoMeta(
        activeTab === FuturesPositionLayoutTabEnum.current
          ? t`constants_order_729`
          : t`modules_assets_futures_futures_position_index_page_tr4wznwa_d`
      ),
    },
  }
}
