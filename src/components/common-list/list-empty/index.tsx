/**
 * 列表空数据
 */
import cn from 'classnames'
import NoDataImage from '@/components/no-data-image'
import { Type } from '@/components/lazy-image'
import styles from '../index.module.css'

interface CommonListEmptyProps {
  imageName?: string
  text?: string
  className?: string
  hidden?: boolean
  imageType?: Type
}

function CommonListEmpty(props: CommonListEmptyProps) {
  return (
    <div
      className={cn(styles.scoped, 'empty-wrap', {
        // 可让图片不闪烁
        hidden: props.hidden,
      })}
    >
      <div className={cn('empty', props.className || 'py-40')}>
        <NoDataImage
          iconName={props.imageName}
          footerText={props.text}
          className="fusion-img"
          imageType={props.imageType}
        />
      </div>
    </div>
  )
}
export default CommonListEmpty
