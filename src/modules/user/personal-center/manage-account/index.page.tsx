import { t } from '@lingui/macro'
import ManageAccount from '@/features/user/personal-center/account-security/manage-account'
import { getUserPageDefaultDescribeMeta } from '@/helper/user'
import { UserModuleDescribeKeyEnum } from '@/constants/user'

function Page() {
  return <ManageAccount />
}

async function onBeforeRender(pageContext: PageContext) {
  const pageProps = {}
  const layoutParams = {}
  return {
    pageContext: {
      pageProps,
      layoutParams,
      documentProps: getUserPageDefaultDescribeMeta(
        t`features_user_personal_center_account_security_manage_account_index_lsl5auuhrn`,
        UserModuleDescribeKeyEnum.default
      ),
    },
  }
}

export { Page, onBeforeRender }
