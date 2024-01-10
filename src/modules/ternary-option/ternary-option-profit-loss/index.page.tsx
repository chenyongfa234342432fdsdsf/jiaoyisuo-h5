import { TernaryOptionProfitLoss } from '@/features/ternary-option/option-order/ternary-profit-loss'
import { t } from '@lingui/macro'

export function Page() {
  return <TernaryOptionProfitLoss />
}

export async function onBeforeRender(pageContext) {
  return {
    pageContext: {
      unAuthTo: `/login?redirect=${pageContext.path}`,
      layoutParams: {},
      pageProps: {},
      documentProps: {
        title: t`constants_agent_5101367`,
        description: '',
      },
    },
  }
}
