import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import NavBar from '@/components/navbar'
import { Button } from '@nbit/vant'
import { createPortal } from 'react-dom'
import Link from '@/components/link'
import { getAssetsRechargePageRoutePath, getC2cFastTradePageRoutePath } from '@/helper/route'
import { ThresholdType } from '../select-version'
import styles from './index.module.css'

type VersionUpgradeType = {
  onClose: () => void
  data?: ThresholdType
}

export default function VersionUpgrade(props: VersionUpgradeType) {
  const { onClose, data } = props
  const back = () => {
    onClose && onClose()
  }
  return createPortal(
    <div className={styles['version-upgrade-content-wrapper']}>
      <NavBar
        title={t`features_trade_future_settings_version_upgrade_index_mxzfq41_qvwjob7kvz393`}
        left={<Icon name="back" hasTheme />}
        onClickLeft={back}
      />
      <div className="version-upgrade-main">
        <div className="flex justify-center mb-6">
          <Icon name="contract_upgrade_failed" hasTheme className="version-upgrade-main-icon" />
        </div>
        <div className="version-upgrade-title">{t`features_trade_future_settings_version_upgrade_index_fawtwuljp6geefpy17l6b`}</div>
        <div className="version-upgrade-desc">
          <div className="version-upgrade-desc-item">{t`features_trade_future_settings_version_upgrade_index_-nlpddu8phzdzjnzx9dss`}</div>
          <div className="version-upgrade-desc-item">
            {t`features_trade_future_settings_version_upgrade_index_1hn2vlqs_iwajsafchh1u`}
            <span className="text-brand_color">{`${data?.threshold || ''} ${data?.symbol}`}</span>
          </div>
        </div>
        <div className="version-upgrade-price">
          <div className="version-upgrade-price-title">{t`features_trade_future_settings_version_upgrade_index_5xebkhsbsdms6upzjojer`}</div>
          <div className="version-upgrade-price-desc">{data?.userThreshold || ''}</div>
        </div>
        <div className="version-upgrade-button">
          <div className="button-items">
            <Link href={getC2cFastTradePageRoutePath()}>
              <Icon name="home_c2c_transaction" className="button-items-icon" />
              <span className="text-text_color_01">{t`features_home_components_navigation_card_index_510103`}</span>
            </Link>
          </div>
          <div className="button-items">
            <Link href={getAssetsRechargePageRoutePath()}>
              <Icon name="home_icon_recharge" className="button-items-icon" />
              <span className="text-text_color_01">{t`assets.financial-record.tabs.Deposit`}</span>
            </Link>
          </div>
        </div>
        <div className="version-upgrade-footer">
          <Button type="primary" className="w-full" onClick={back}>
            {t`features_trade_future_settings_version_upgrade_index_5dz0llsa-so6ltamnhmkj`}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
