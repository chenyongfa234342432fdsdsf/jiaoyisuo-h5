import { t } from '@lingui/macro'
import { getUserPageDefaultDescribeMeta } from '@/helper/user'
import { UserModuleDescribeKeyEnum } from '@/constants/user'
import Profile from '@/features/user/personal-center/info/profile'

function Page() {
  return <Profile />
}

async function onBeforeRender(pageContext: PageContext) {
  const pageProps = {}
  const layoutParams = {}
  return {
    pageContext: {
      pageProps,
      layoutParams,
      unAuthTo: '/login?redirect=/personal-center/info',
      documentProps: getUserPageDefaultDescribeMeta(
        t`features_user_personal_center_info_profile_index_tp2l1izjbl`,
        UserModuleDescribeKeyEnum.default
      ),
    },
  }
}

export { Page, onBeforeRender }
