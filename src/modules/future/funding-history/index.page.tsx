import { FundingHistoryLayout } from '@/features/future/funding-history/layout'
import { getTradeDefaultSeoMeta } from '@/helper/trade'
import { t } from '@lingui/macro'

export function Page() {
  return <FundingHistoryLayout />
}

export async function onBeforeRender() {
  return {
    pageContext: {
      documentProps: getTradeDefaultSeoMeta(t`future.funding-history.title`),
    },
  }
}
