import { getUserPageDefaultDescribeMeta } from '@/helper/user'
import { UserModuleDescribeKeyEnum } from '@/constants/user'
import WelfareCenter from '@/features/welfare-center'
import { t } from '@lingui/macro'

function Page() {
  return <WelfareCenter />
}

async function onBeforeRender() {
  return {
    pageContext: {
      layoutParams: {
        footerShow: false, // 是否需要 footer
        documentProps: getUserPageDefaultDescribeMeta(
          t`features_welfare_center_index_bi_wfzlnl6`,
          UserModuleDescribeKeyEnum.default
        ),
      },
    },
  }
}

export { Page, onBeforeRender }
