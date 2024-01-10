import { t } from '@lingui/macro'
import classNames from 'classnames'
import Icon from '@/components/icon'
import { useCommonStore } from '@/store/common'
import LazyImage, { Type } from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { isFusionApiImage } from '@/helper/fusion-api'
import { ReactNode } from 'react'
import styles from './index.module.css'

type NoDataImageType = {
  isIcon?: boolean
  iconName?: string
  footerText?: string | ReactNode
  className?: string
  imageType?: Type
}

const NoDataImage = ({ className, footerText, iconName, isIcon = false, imageType = Type.png }: NoDataImageType) => {
  const { isFusionMode } = useCommonStore()
  return (
    <div className={classNames(styles.scoped, className, 'no-data-content')}>
      <div className="no-data">
        {isIcon ? (
          <Icon name="contract_upgrade_failed" hasTheme className="main-icon" />
        ) : (
          <LazyImage
            hasTheme
            whetherManyBusiness
            className="no-data-image"
            src={`${oss_svg_image_domain_address}${isFusionApiImage(iconName)}`}
            imageType={imageType}
          />
        )}
        {footerText ? (
          <div className="no-footer-text mt-2">{footerText}</div>
        ) : (
          <div className="no-data-text mt-2">
            {isFusionMode ? t`components_no_data_image_index_ir9s7j0mk8` : t`features_orders_order_detail_510288`}
          </div>
        )}
      </div>
    </div>
  )
}
export default NoDataImage
