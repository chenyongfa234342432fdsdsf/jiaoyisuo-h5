/**
 * 提币 - 主网选择
 */
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { MainTypeWithdrawTypeEnum } from '@/constants/assets'
import { useAssetsStore } from '@/store/assets/spot'
import { Popover } from '@nbit/vant'
import styles from '../layout/index.module.css'

interface IWithdrawNeworkProps {
  onChangeNetwork: () => void
}

function WithdrawNetwork(props: IWithdrawNeworkProps) {
  const { formData, amountInfo } = useAssetsStore().withdrawModule || {}
  const { onChangeNetwork } = props || {}

  return (
    <div className="form-cell">
      <div className="form-label">
        <span>{t`features_assets_common_main_network_index_510101`}</span>
        {amountInfo?.contractInfo && (
          <Popover
            placement="bottom"
            theme="dark"
            reference={<Icon name="msg" className="network-hint-icon" hasTheme />}
            className={styles['withdraw-network-popover-root']}
          >
            <div className="flex items-center justify-between">
              <span>{t`future.funding-history.title`}</span>
              <span>{`********${amountInfo?.contractInfo.slice(-6)}`}</span>
            </div>
            <div>{t`features_assets_withdraw_network_index_roqmhl88kc`}</div>
          </Popover>
        )}
      </div>
      <div className="form-input" onClick={onChangeNetwork}>
        {formData.network?.id ? (
          <div className="form-network">
            <div
              className={
                formData.network?.isWithdraw === MainTypeWithdrawTypeEnum.yes ? 'network-name' : 'network-name-pause'
              }
            >
              {formData.network?.mainType}
            </div>
            {formData.network?.isWithdraw === MainTypeWithdrawTypeEnum.no && (
              <div className="network-pause">
                <span className="network-pause-text">{t`assets.common.main-network.paused`}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="form-network text-text_color_04">{t`features_assets_recharge_network_index_mbsbpgwygu`}</div>
        )}
        <Icon name="regsiter_icon_drop" hasTheme className="form-network-icon" />
      </div>
    </div>
  )
}

export { WithdrawNetwork }
