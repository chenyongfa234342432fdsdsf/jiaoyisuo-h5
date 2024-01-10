import { t } from '@lingui/macro'
import BindAccount from '@/features/user/personal-center/account-security/bind-account'
import { getUserPageDefaultDescribeMeta } from '@/helper/user'
import { UserModuleDescribeKeyEnum } from '@/constants/user'

function Page() {
  return <BindAccount />
}

async function onBeforeRender(pageContext: PageContext) {
  const pageProps = {}
  const layoutParams = {}
  return {
    pageContext: {
      pageProps,
      layoutParams,
      documentProps: getUserPageDefaultDescribeMeta(
        t`features_user_personal_center_account_security_bind_account_index_yixzhpyugo`,
        UserModuleDescribeKeyEnum.default
      ),
    },
  }
}

export { Page, onBeforeRender }
