import { t } from '@lingui/macro'
import UserRegisterResidence from '@/features/user/register/residence'
import { getUserPageDefaultDescribeMeta } from '@/helper/user'
import { getBusinessName } from '@/helper/common'
import { UserModuleDescribeKeyEnum } from '@/constants/user'

function Page() {
  return <UserRegisterResidence />
}

async function onBeforeRender(pageContext: PageContext) {
  const values = {
    businessName: getBusinessName(),
  }
  const pageProps = {}
  const layoutParams = {}
  return {
    pageContext: {
      authTo: '/',
      pageProps,
      layoutParams,
      documentProps: getUserPageDefaultDescribeMeta(
        t({
          id: `modules_user_register_index_page_bqirp1zfnv`,
          values,
        }),
        UserModuleDescribeKeyEnum.register
      ),
    },
  }
}

export { Page, onBeforeRender }
