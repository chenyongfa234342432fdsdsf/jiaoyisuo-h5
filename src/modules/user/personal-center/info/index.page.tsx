import { t } from '@lingui/macro'
import { getUserPageDefaultDescribeMeta } from '@/helper/user'
import { UserModuleDescribeKeyEnum } from '@/constants/user'
import MyInfo from '@/features/user/personal-center/info'

function Page() {
  return <MyInfo />
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
        t`features_user_personal_center_info_index_x8exarcbsh`,
        UserModuleDescribeKeyEnum.default
      ),
    },
  }
}

export { Page, onBeforeRender }
