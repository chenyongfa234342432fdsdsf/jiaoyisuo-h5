import { Dialog } from '@nbit/vant'
import { t } from '@lingui/macro'
import PassVideo from '@/components/pass-video'
import { getBusinessName } from './common'
import { link } from './link'
import { getOpenFuturePagePath } from './route'
import { renderRoot } from './render'

/** 开始激活合约的一系列流程 */
export async function activeFuture() {
  const businessName = getBusinessName()
  const text1 = t({
    id: 'helper_future_i9cl5ahfwb',
    values: { 0: businessName },
  })
  const text2 = t`helper_future_tip_2`
  await Dialog.confirm({
    title: t`helper_future_xinthk0isv`,
    className: 'dialog-confirm-wrapper cancel-gray confirm-black',
    message: (
      <div className="text-left">
        <p>{text1}</p>
        <p className="text-brand_color">{text2}</p>
      </div>
    ),
    cancelButtonText: t`helper_future_kgju5m8z0x`,
    confirmButtonText: t`helper_future_qzp1h8vhjf`,
  })
  renderRoot(unmount => {
    const onVideoConfirm = () => {
      unmount()
      link(getOpenFuturePagePath())
    }
    const onVideoClose = () => {
      unmount()
    }
    return <PassVideo visible isCountDown onConfirm={onVideoConfirm} onClose={onVideoClose} />
  })
}
