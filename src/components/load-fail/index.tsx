import LazyImage from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import styles from './index.module.css'

export default function LoadFail({ name }: { name?: string }) {
  return (
    <div className={styles.scoped}>
      <LazyImage
        src={`${oss_svg_image_domain_address}icon_default_404.png`}
        whetherManyBusiness
        imageName={name || '404~'}
        hasTheme
      />
    </div>
  )
}
