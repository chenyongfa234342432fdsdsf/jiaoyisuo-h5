import { t } from '@lingui/macro'
import { getUserPageDefaultDescribeMeta } from '@/helper/user'
import { UserModuleDescribeKeyEnum } from '@/constants/user'
import SpecialAvatar from '@/features/vip/special-avatar'

function Page() {
  return <SpecialAvatar />
}

async function onBeforeRender(pageContext: PageContext) {
  const pageProps = {}
  const layoutParams = {}
  return {
    pageContext: {
      pageProps,
      layoutParams,
      unAuthTo: '/login?redirect=/vip/special-avatar',
      documentProps: getUserPageDefaultDescribeMeta(
        t`features_user_personal_center_vip_special_avatar_index_jvj7jftagh`,
        UserModuleDescribeKeyEnum.default
      ),
    },
  }
}

export { Page, onBeforeRender }
