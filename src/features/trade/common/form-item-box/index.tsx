import classNames from 'classnames'
import { HTMLAttributes, ReactNode } from 'react'
import styles from './index.module.css'

export type ITradeFormBoxProps = {
  children?: ReactNode
  className?: string
  hasBorder?: boolean
  disabled?: boolean
} & HTMLAttributes<HTMLDivElement>

function TradeFormItemBox({ children, disabled, className, hasBorder, ...rest }: ITradeFormBoxProps) {
  return (
    <div
      className={classNames(className, styles['trade-from-box'], {
        'has-border': hasBorder,
        'rv-hairline--surround': hasBorder,
        'disabled': disabled,
      })}
      {...rest}
    >
      {children}
    </div>
  )
}

export default TradeFormItemBox
