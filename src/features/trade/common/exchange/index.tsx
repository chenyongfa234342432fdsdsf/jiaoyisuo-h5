import cn from 'classnames'
import { ReactNode } from 'react'
import styles from './index.module.css'

export type IExchangeProps = {
  children?: ReactNode
}

function Exchange({ children }: IExchangeProps) {
  return <div className={cn(styles.scoped)}>{children}</div>
}

export default Exchange
