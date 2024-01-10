import { getBusinessName } from '@/helper/common'
import { t } from '@lingui/macro'

export function generateAgentDefaultSeoMeta(
  // TODO commTitle 备用，后面扩张
  keys: {
    title: string
    description?: string
    commTitle?: string
  },
  values?: any
) {
  const businessName = getBusinessName()
  if (!values) {
    values = { businessName }
  } else {
    values.businessName = businessName
  }
  return {
    title: keys.title,
    description: t({
      id: keys?.description || `store_agent_index_page_ifcz30x2n0`,
      values,
    }),
  }
}
