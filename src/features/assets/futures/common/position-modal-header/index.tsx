/**
 * 合约持仓 - 弹窗头部
 */

import Icon from '@/components/icon'
import { getFuturesGroupTypeName } from '@/constants/assets/futures'
import { PositionList } from '@/typings/api/assets/futures'
import { TradeDirectionTag } from '../trade-direction-tag'
import styles from './index.module.css'

interface IPositionModalHeaderProps {
  /** 关闭弹窗 */
  onClose: () => void
  /** 标题 */
  title: string
  /** 逐仓信息 */
  data: PositionList
  /** 是否固定 */
  fixed?: boolean
}

function PositionModalHeader(props: IPositionModalHeaderProps) {
  const { onClose, title, data, fixed = false } = props
  const { symbol, typeInd } = data || {}
  return (
    <div className={`${styles['position-modal-header-root']} ${fixed && 'fixed z-10'}`}>
      <div className="position-modal-header-title">
        <span>{title}</span>
        <Icon name="close" hasTheme className="text-xl" onClick={onClose} />
      </div>
      <div className="name-cell">
        <span className="name">
          {symbol || '--'} {getFuturesGroupTypeName(typeInd)}
        </span>

        <TradeDirectionTag showFutures={false} {...data} />
      </div>
      <div className="mt-1">
        <TradeDirectionTag showDirection={false} showLever={false} {...data} />
      </div>
    </div>
  )
}

export { PositionModalHeader }
