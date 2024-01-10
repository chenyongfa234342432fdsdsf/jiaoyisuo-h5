import classNames from 'classnames'
import { createPortal } from 'react-dom'
import { envIsServer } from '@/helper/env'
import { useCommonStore } from '@/store/common'
import DynamicLottie from '@/components/dynamic-lottie'
import styles from './index.module.css'

const RefreshLoadingData = 'refresh_loading'
const FusionApiRefreshLoadingData = 'fusion_refresh_loading'

function FullScreenLoading({ isShow, className, mask }: { isShow: boolean; className?: string; mask?: boolean }) {
  const { isFusionMode } = useCommonStore()
  if (envIsServer) {
    return null
  }
  return createPortal(
    <div
      className={classNames(
        styles['full-screen-loading'],
        isShow ? 'flex' : 'hidden',
        {
          'with-mask': mask,
        },
        className
      )}
    >
      <DynamicLottie
        loop
        style={{ width: isFusionMode ? '90px' : '45px', height: isFusionMode ? '90px' : '45px' }}
        animationData={isFusionMode ? FusionApiRefreshLoadingData : RefreshLoadingData}
      />
    </div>,
    document.body
  )
}

export default FullScreenLoading
