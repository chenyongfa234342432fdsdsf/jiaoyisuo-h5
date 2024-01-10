import classnames from 'classnames'
import { Input as VantInput, InputProps } from '@nbit/vant'
import { ReactNode, forwardRef, useState } from 'react'
import { useDebounce } from 'ahooks'
import styles from './index.module.css'
import Icon from '../icon'
import Tooltip from '../tooltip'

const paddingSizeMap = {
  large: 'px-3',
  normal: 'px-2',
}

export type IInputProps = InputProps & {
  /** 标签，开启后将启用标签作为 placeholder ，并聚焦时展示 label，仅适用于 onlyInput 模式 */
  label?: string
  /** 白色背景 */
  isWhite?: boolean
  paddingRightZero?: boolean
  paddingSize?: 'large' | 'normal'
  /**  聚焦与否不会发生变化 */
  noFocus?: boolean
  noBorder?: boolean
  /** 已被重写，不会传递到原始 input，TODO: 已知问题，不适用于有 suffix 的情况，后续如果出现了，将 suffix 移入自身组件中 */
  clearable?: boolean
  /** 主要用于交易输入框弹出价格换算 */
  labelTipContent?: ReactNode
  /** 默认聚焦时透明，在处理一些层级关系时就不行了，所以加上这个属性，适用于确定背景色的情况 */
  focusBgClassName?: string
}

function Input(
  {
    className,
    noBorder,
    noFocus,
    isWhite,
    clearable,
    label,
    paddingSize = 'normal',
    paddingRightZero,
    onBlur: propsOnBlur,
    onFocus: propsOnFocus,
    labelTipContent,
    focusBgClassName,
    ...props
  }: IInputProps,
  ref
) {
  const [focused, setFocused] = useState(false)
  const onFocus = e => {
    setFocused(true)
    propsOnFocus?.(e)
  }
  const onBlur = e => {
    setFocused(false)
    propsOnBlur?.(e)
  }
  // 避免失焦后点击事件无法触发
  const debounceFocused = useDebounce(focused, {
    wait: 200,
  })
  return (
    <div
      className={classnames(className, paddingSizeMap[paddingSize], styles['only-input-wrapper'], {
        // 'rv-hairline--surround': !noBorder,
        'with-border': !noBorder,
        'is-white': isWhite,
        'disabled': props.disabled,
        '!pr-0': paddingRightZero,
        'with-label': label,
        'is-focused': !noFocus && focused,
        'has-value': props.value,
        [`${focusBgClassName || ''} ${focusBgClassName ? 'focused-not-transparent' : ''}`]: !noFocus && focused,
      })}
    >
      {label && (
        <div className={classnames('input-label')}>
          {focused && !!labelTipContent ? (
            <Tooltip placement="left" size="small" alwaysOpen content={labelTipContent}>
              {label}
            </Tooltip>
          ) : (
            <>{label}</>
          )}
        </div>
      )}
      <VantInput
        type="number"
        ref={ref}
        onFocus={onFocus}
        onBlur={onBlur}
        {...props}
        placeholder={label || props.placeholder}
      />
      {clearable && debounceFocused && props.value && (
        <Icon
          onClick={() => props.onChange?.('')}
          hiddenMarginTop
          name="del_input-box"
          hasTheme
          className="clear-icon text-xl"
        />
      )}
    </div>
  )
}

export default forwardRef(Input)
