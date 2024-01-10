import { useFutureTradeIsOpened } from '@/hooks/features/trade'
import classNames from 'classnames'
import { ReactNode } from 'react'

export type INotLoginProps = {
  children?: ReactNode
  className?: string
  placeNode?: ReactNode
}
/**
 * 合约不可用组件，可用会正常展示，不可用则展示不可用提示
 */
function FutureNotAvailable({ children, className, placeNode }: INotLoginProps) {
  const available = useFutureTradeIsOpened()
  if (available) {
    return children! as JSX.Element
  }
  return <div className={classNames(className)}>{placeNode || <div></div>}</div>
}

export default FutureNotAvailable
