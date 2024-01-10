import { t } from '@lingui/macro'
import WelcomeBack from '@/features/user/login/welcome-back'
import { getUserPageDefaultDescribeMeta } from '@/helper/user'
import { UserModuleDescribeKeyEnum } from '@/constants/user'

function Page() {
  return <WelcomeBack />
}

async function onBeforeRender(pageContext: PageContext) {
  const pageProps = {}
  const layoutParams = {}
  return {
    pageContext: {
      pageProps,
      layoutParams,
      documentProps: getUserPageDefaultDescribeMeta(
        t`modules_user_login_welcome_back_index_page_laced6qoqv`,
        UserModuleDescribeKeyEnum.default
      ),
    },
  }
}

export { Page, onBeforeRender }
