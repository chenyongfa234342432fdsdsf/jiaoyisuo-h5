import { t } from '@lingui/macro'
import { Dialog } from '@nbit/vant'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { ReactNode } from 'react'
import LazyImage from '@/components/lazy-image'

function AlertTip({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <LazyImage src={`${oss_svg_image_domain_address}tis.png`} className="mb-5 w-[36px] h-[36px] !mt-0" />
      {children}
    </div>
  )
}

export default AlertTip

/** 带 tip 的弹窗提示 */
export function alertWithTip(message: ReactNode) {
  return Dialog.alert({
    message: <AlertTip>{message}</AlertTip>,
    confirmButtonText: t`features_trade_common_notification_index_5101066`,
  })
}
