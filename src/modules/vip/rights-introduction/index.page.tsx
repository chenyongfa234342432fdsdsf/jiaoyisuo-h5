import { t } from '@lingui/macro'
import { getUserPageDefaultDescribeMeta } from '@/helper/user'
import { UserModuleDescribeKeyEnum } from '@/constants/user'
import RightsIntroduction from '@/features/vip/rights-introduction'

function Page() {
  return <RightsIntroduction />
}

async function onBeforeRender(pageContext: PageContext) {
  const pageProps = {}
  const layoutParams = {}
  return {
    pageContext: {
      pageProps,
      layoutParams,
      unAuthTo: '/login?redirect=/vip/rights-introduction',
      documentProps: getUserPageDefaultDescribeMeta(
        t`modules_user_personal_center_vip_rights_introduction_index_page_p35loycub3`,
        UserModuleDescribeKeyEnum.default
      ),
    },
  }
}

export { Page, onBeforeRender }
