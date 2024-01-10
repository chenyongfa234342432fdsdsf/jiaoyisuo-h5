import { t } from '@lingui/macro'
import { getCommunityGroupsDefaultSeoMeta } from '@/helper/community-groups'

export async function onBeforeRender(pageContext: PageContext) {
  const pageProps = {}
  const layoutParams = {
    footerShow: false,
  }
  return {
    pageContext: {
      needSeo: true,
      pageProps,
      layoutParams,
      documentProps: getCommunityGroupsDefaultSeoMeta(t`modules_community_groups_index_page_server_5101267`),
    },
  }
}
