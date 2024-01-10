import { AssetsFuturesTransfer } from '@/features/assets/futures/assets-transfer/transfer-layout'
import { getAssetsDefaultSeoMeta } from '@/helper/assets/overview'
import { t } from '@lingui/macro'

export function Page() {
  return <AssetsFuturesTransfer />
}

export async function onBeforeRender() {
  return {
    pageContext: {
      documentProps: getAssetsDefaultSeoMeta(t`modules_assets_asset_transfer_index_page_jcc5w9apof-1nhg9yfo2j`),
    },
  }
}
