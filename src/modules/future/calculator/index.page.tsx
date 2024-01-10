import FutureComputer from '@/features/future/computer'
import { t } from '@lingui/macro'

export function Page() {
  return <FutureComputer />
}

export async function onBeforeRender(pageContext: PageContext) {
  return {
    pageContext: {
      documentProps: {
        title: t`store_home_config_index_510114`,
      },
    },
  }
}
