import { t } from '@lingui/macro'
import { useVipCenterStore } from '@/store/vip'
import VipActionSheet from '../vip-actionsheet'

// vip  衍生品选择弹窗
export default function DerivativeAS({ visible, setVisible }) {
  const { menulist } = useVipCenterStore()

  return (
    <VipActionSheet
      title={t`features_user_personal_center_components_derivative_actionsheet_index_y3kxvuwdfv`}
      visible={visible}
      setVisible={setVisible}
      list={menulist}
    />
  )
}
