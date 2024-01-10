import { getUserPageDefaultDescribeMeta } from '@/helper/user'
import { UserModuleDescribeKeyEnum } from '@/constants/user'
import TaskRecord from '@/features/welfare-center/my-task/task-record'
import { t } from '@lingui/macro'

function Page() {
  return <TaskRecord />
}

async function onBeforeRender() {
  return {
    pageContext: {
      layoutParams: {
        footerShow: false, // 是否需要 footer
        documentProps: getUserPageDefaultDescribeMeta(
          t`features_welfare_center_my_task_task_record_index_uhp9q_q6iq`,
          UserModuleDescribeKeyEnum.default
        ),
      },
    },
  }
}

export { Page, onBeforeRender }
