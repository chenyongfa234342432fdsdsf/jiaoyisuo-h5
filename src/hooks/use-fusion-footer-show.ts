import { useCommonStore } from '@/store/common'
import { useTimeout } from 'ahooks'

/** 融合模式下展示底部菜单 */
export function useFusionFooterShow() {
  const { setLayout, isFusionMode } = useCommonStore()

  useTimeout(() => {
    setLayout({
      footerShow: isFusionMode,
    })
  }, 20)
}
