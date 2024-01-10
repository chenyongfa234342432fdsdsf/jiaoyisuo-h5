import { useScaleDom } from '@/hooks/use-scale-dom'
import { ReactNode, useRef } from 'react'
import classNames from 'classnames'
import { Button, ButtonProps } from '@nbit/vant'
import styles from './index.module.css'

type IDomAutoScaleWrapperProps = {
  children: ReactNode
  dep: any
  className?: string
  minScale?: number
  /** 让后缀紧跟在内容后面不会被缩放，也不会因为 dom 占据了空间而远远隔开 */
  suffix?: ReactNode
}
/**
 * 配合 overflow-ellipsis-flex-1 useScaleDom 使用，实现占据剩余宽度，自动缩放，超出省略效果 *
 */
function DomAutoScaleWrapper({ children, minScale, suffix, dep, className }: IDomAutoScaleWrapperProps) {
  const domRef = useScaleDom(0, dep, minScale)
  const suffixRef = useRef<HTMLDivElement>(null)

  const { width: suffixWidth = 0 } = suffixRef.current?.getBoundingClientRect() || {}

  const maxWidth = suffixWidth ? `calc(100% - ${suffixWidth}px)` : '100%'

  return (
    <div className={`${styles.scoped} ${className || ''} flex overflow-ellipsis-flex-1`}>
      <div
        ref={domRef}
        style={{
          maxWidth,
        }}
        className={classNames('max-w-full overflow-hidden text-ellipsis whitespace-nowrap', {
          'flex-1 w-0': !suffix,
        })}
      >
        {children}
      </div>
      <div ref={suffixRef}>{suffix}</div>
    </div>
  )
}

export default DomAutoScaleWrapper

export function AutoScaleButton({
  className,
  dep = null,
  children,
  ...props
}: ButtonProps & {
  dep?: any
}) {
  return (
    <Button block className={classNames(className, styles['button-wrapper'])} {...props}>
      <DomAutoScaleWrapper minScale={0.6} className="scale-wrapper" dep={dep}>
        {children}
      </DomAutoScaleWrapper>
    </Button>
  )
}
