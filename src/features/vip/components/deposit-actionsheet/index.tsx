import { t } from '@lingui/macro'
import VipActionSheet from '../vip-actionsheet'

// vip 充值选择弹窗
export default function DepositAS({ visible, setVisible }) {
  const list = [
    {
      title: t`assets.financial-record.tabs.Deposit`,
      desc: t`features_user_personal_center_components_deposit_actionsheet_index_5yqacplqyj`,
      icon: 'vip_image_deposit_coin.png',
      url: '/assets/recharge',
    },
    {
      title: t`features_user_personal_center_components_deposit_actionsheet_index_6giu8pniiw`,
      desc: t`features_user_personal_center_components_deposit_actionsheet_index_xlq47olmo3`,
      icon: 'vip_image_deposit_buy.png',
      url: '/c2c/trade',
    },
  ]
  return (
    <VipActionSheet
      title={t`features_user_personal_center_components_deposit_actionsheet_index_kudgrpbbom`}
      visible={visible}
      setVisible={setVisible}
      list={list}
    />
  )
}
