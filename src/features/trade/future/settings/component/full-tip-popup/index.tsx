import { t } from '@lingui/macro'
import { useCommonStore } from '@/store/common'
import { ThemeEnum } from '@/constants/base'
import { Button, Popup } from '@nbit/vant'
import DynamicLottie from '@/components/dynamic-lottie'
import styles from './index.module.css'

const OrderConfirmationDark = 'order-confirmation-dark'
const OrderConfirmationLight = 'order-confirmation-light'

type FullTipPopup = {
  visible: boolean
  onClose: (v?: boolean) => void
}

export default function FullTipPopup(props: FullTipPopup) {
  const { visible, onClose } = props

  const { theme } = useCommonStore()

  return (
    <Popup visible={visible} onClose={() => onClose && onClose()} className={styles['future-settings-popup']}>
      <div className="future-settings-wrap">
        <div className="settings-wrap-video">
          <DynamicLottie
            loop
            className={'w-full h-full'}
            animationData={theme === ThemeEnum.light ? OrderConfirmationLight : OrderConfirmationDark}
          />
        </div>
        <Button type="primary" className="w-full mt-4" onClick={() => onClose && onClose()}>
          {t`features_trade_common_notification_index_5101066`}
        </Button>
      </div>
    </Popup>
  )
}
