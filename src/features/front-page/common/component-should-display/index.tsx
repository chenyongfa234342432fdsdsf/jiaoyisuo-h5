import { enabledStatusEnum, showStatusEnum } from '@/constants/layout/basic-web-info'
import { useUserStore } from '@/store/user'

function ShouldGuidePageComponentDisplay({ children, showStatusCd, enabledInd }) {
  const { isLogin } = useUserStore()

  if (!showStatusCd || !enabledInd) return <>{children}</>

  if (enabledInd === enabledStatusEnum.isDisabled) return <></>

  if (showStatusCd === showStatusEnum.login) return <>{isLogin && children}</>

  if (showStatusCd === showStatusEnum.notLogin) return <>{!isLogin && children}</>

  return <>{children}</>
}

export default ShouldGuidePageComponentDisplay
