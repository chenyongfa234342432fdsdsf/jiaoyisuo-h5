import { t } from '@lingui/macro'
import { getUserPageDefaultDescribeMeta } from '@/helper/user'
import { UserModuleDescribeKeyEnum } from '@/constants/user'
import UpgradeCondition from '@/features/vip/upgrade-condition'

function Page() {
  return <UpgradeCondition />
}

async function onBeforeRender(pageContext: PageContext) {
  const pageProps = {}
  const layoutParams = {}
  return {
    pageContext: {
      pageProps,
      layoutParams,
      unAuthTo: '/login?redirect=/vip/upgrade-condition',
      documentProps: getUserPageDefaultDescribeMeta(
        t`modules_user_personal_center_vip_upgrade_condition_index_page_cm7tozxjfz`,
        UserModuleDescribeKeyEnum.default
      ),
    },
  }
}

export { Page, onBeforeRender }
