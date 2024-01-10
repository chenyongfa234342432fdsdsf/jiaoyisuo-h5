import { getUserPageDefaultDescribeMeta } from '@/helper/user'
import { UserModuleDescribeKeyEnum } from '@/constants/user'
import ExpiredCard from '@/features/welfare-center/expire-card-page'

function Page() {
  return <ExpiredCard />
}

async function onBeforeRender() {
  return {
    pageContext: {
      layoutParams: {
        footerShow: false, // 是否需要 footer
        documentProps: getUserPageDefaultDescribeMeta('福利中心', UserModuleDescribeKeyEnum.default),
      },
    },
  }
}

export { Page, onBeforeRender }
