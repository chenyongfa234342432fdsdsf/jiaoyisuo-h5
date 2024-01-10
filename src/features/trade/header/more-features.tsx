import Icon from '@/components/icon'
import { HelpFeeTabTypeEnum } from '@/constants/trade'
import { link } from '@/helper/link'
import { t } from '@lingui/macro'
import styles from './index.module.css'

export type IFeature = {
  name: string
  icon: string
  onClick?: () => void
  href?: string
}

type IMoreFeaturesProps = {
  onClose: () => void
  features: IFeature[]
}

function MoreFeatures({ onClose, features }: IMoreFeaturesProps) {
  return (
    <div className={styles['more-features-wrapper']}>
      <div className="flex justify-between p-4 items-center">
        <span className="text-sm font-medium">{t`features_trade_header_more_features_510286`}</span>
        <Icon onClick={onClose} className="text-xl" name="close" hasTheme />
      </div>
      <div className="features">
        {features.map(feature => {
          const onClick = () => {
            if (feature.onClick) {
              feature.onClick?.()
            }
            if (feature.href) {
              link(feature.href)
            }
            onClose()
          }
          return (
            <div key={feature.name} className="feature-item-outer" onClick={onClick}>
              <div className="feature-item">
                <div>
                  <Icon className="icon" name={feature.icon} hasTheme />
                </div>
                <div>{feature.name}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MoreFeatures
