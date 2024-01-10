import SectorGlateDetail from '@/features/market/market-quatation/market-sector/sector-glate-detail'

export function Page() {
  return <SectorGlateDetail />
}

export async function onBeforeRender() {
  return {
    pageContext: {
      layoutParams: {
        footerShow: true, // 是否需要 footer
        disableTransition: true,
      },
    },
  }
}
