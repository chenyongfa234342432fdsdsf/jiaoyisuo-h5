/**
 * 下拉刷新动画组件
 */
import { useCommonStore } from '@/store/common'
import DynamicLottie from '@/components/dynamic-lottie'
import classNames from 'classnames'

const PullRefreshData = 'refresh_loading'
const FusionApiRefreshLoadingData = 'tt_refresh_fusion'

function PullRefreshAnimation({ className }: { className?: string }) {
  const { isFusionMode } = useCommonStore()
  return (
    <div className={classNames('flex', 'w-full', 'h-12', 'items-center', 'justify-center', className)}>
      <DynamicLottie
        loop
        style={{ width: '25px', height: '25px' }}
        hasTheme={isFusionMode}
        animationData={isFusionMode ? FusionApiRefreshLoadingData : PullRefreshData}
      />
    </div>
  )
}
export default PullRefreshAnimation
