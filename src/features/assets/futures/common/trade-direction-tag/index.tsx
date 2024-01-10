/**
 * 合约 - 交易方向标签组件
 */
import classNames from 'classnames'
import { FuturesDetailsPositionTypeEnum, getFuturesPositionTypeName } from '@/constants/assets/futures'
import Icon from '@/components/icon'
import styles from './index.module.css'

interface TradeDirectionTagProps {
  /** 是否展示交易方向标签，默认展示 */
  showDirection?: boolean
  /** 是否展示合约组标签，默认展示 */
  showFutures?: boolean
  /** 是否展示杠杆倍数标签，默认展示 */
  showLever?: boolean
  /** 是否可以编辑杠杆，默认不编辑 */
  showEditLever?: boolean
  /** 杠杆倍数 */
  lever?: string
  /** 合约组名 */
  groupName?: string
  /** 仓位类型 */
  sideInd?: string
  className?: string
  onClickDirection?: () => void
  onClickName?: () => void
  onEditLever?: () => void
}
function TradeDirectionTag(props: TradeDirectionTagProps) {
  const {
    showDirection = true,
    showFutures = true,
    showLever = true,
    showEditLever = false,
    lever = '',
    groupName = '--',
    className,
    sideInd = 'long',
    onClickDirection,
    onClickName,
    onEditLever,
  } = props || {}

  return (
    <div className={styles['trade-direction-tag-root']}>
      {showDirection && (
        <div
          className={classNames('direction-tag', className)}
          style={{
            backgroundColor:
              sideInd === FuturesDetailsPositionTypeEnum.long
                ? 'var(--buy_up_color_special_02)'
                : 'var(--sell_down_color_special_02)',
            color: sideInd === FuturesDetailsPositionTypeEnum.long ? 'var(--buy_up_color)' : 'var(--sell_down_color)',
          }}
          onClick={e => {
            e.stopPropagation()
            onClickDirection && onClickDirection()
          }}
        >
          <span className="direction-text">{getFuturesPositionTypeName(sideInd)}</span>
        </div>
      )}
      {showLever && (
        <div
          className="lever-tag"
          onClick={e => {
            e.stopPropagation()
            onClickDirection && onClickDirection()
          }}
        >
          <span>{`${lever}X`}</span>
          {showEditLever && (
            <Icon
              name="contract_adjust_leverage"
              className="lever-edit"
              onClick={e => {
                e.stopPropagation()
                onEditLever && onEditLever()
              }}
            />
          )}
        </div>
      )}
      {showFutures && (
        <div className="futures-tag" onClick={onClickName}>
          <span className="futures-tag-text">{groupName}</span>
        </div>
      )}
    </div>
  )
}

export { TradeDirectionTag }
