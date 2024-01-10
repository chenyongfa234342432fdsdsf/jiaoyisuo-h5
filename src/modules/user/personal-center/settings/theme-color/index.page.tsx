import { t } from '@lingui/macro'
import UserPersonalCenterSettingThemeColor from '@/features/user/personal-center/settings/theme-color'
import { getUserPageDefaultDescribeMeta } from '@/helper/user'
import { UserModuleDescribeKeyEnum } from '@/constants/user'

function Page() {
  return <UserPersonalCenterSettingThemeColor />
}

async function onBeforeRender(pageContext: PageContext) {
  const pageProps = {}
  const layoutParams = {}
  return {
    pageContext: {
      pageProps,
      layoutParams,
      documentProps: getUserPageDefaultDescribeMeta(
        t`modules_user_personal_center_settings_theme_color_index_page_wpqivkckel`,
        UserModuleDescribeKeyEnum.default
      ),
    },
  }
}

export { Page, onBeforeRender }
