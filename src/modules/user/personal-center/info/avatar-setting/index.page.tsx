import { t } from '@lingui/macro'
import { getUserPageDefaultDescribeMeta } from '@/helper/user'
import { UserModuleDescribeKeyEnum } from '@/constants/user'
import AvatarSetting from '@/features/user/personal-center/info/avatar-setting'

function Page() {
  return <AvatarSetting />
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
        t`modules_user_personal_center_info_avatar_setting_index_page_i7vfbosgqv`,
        UserModuleDescribeKeyEnum.default
      ),
    },
  }
}

export { Page, onBeforeRender }
