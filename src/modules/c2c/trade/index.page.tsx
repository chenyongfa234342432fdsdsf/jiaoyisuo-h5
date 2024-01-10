import C2cTrade from '@/features/c2c/trade'
import { getC2cDefaultSeoMeta } from '@/helper/c2c/trade'
import { getC2cTradePageRoutePath } from '@/helper/route'

export function Page() {
  return <C2cTrade />
}

export async function onBeforeRender() {
  return {
    pageContext: {
      unAuthTo: `/login?redirect=${getC2cTradePageRoutePath()}`,
      documentProps: await getC2cDefaultSeoMeta(),
    },
  }
}
