/**
 * 充值 - 主网选择
 */
import { t } from '@lingui/macro'
import Icon from '@/components/icon'

interface IRechargeNetworkProps {
  network: any
  onClick: () => void
}

function RechargeNetwork(props: IRechargeNetworkProps) {
  const { network, onClick } = props

  return (
    <div className="form-cell">
      <div className="form-label">{t`features_assets_common_main_network_index_510101`}</div>
      <div className="form-coin" onClick={onClick}>
        <span className={network?.id ? '' : 'text-text_color_04'}>
          {network?.id ? network?.mainType : t`features_assets_recharge_network_index_mbsbpgwygu`}
        </span>

        <Icon name="regsiter_icon_drop" hasTheme className="network-icon" />
      </div>
    </div>
  )
}

export { RechargeNetwork }
