import { envIsServer } from '@/helper/env'
import { hooks } from '@nbit/vant'
import { useClickAway } from 'ahooks'
import classNames from 'classnames'
import { MutableRefObject, ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './index.module.css'

/** 目前只考虑这几种 */
type Placement = 'left' | 'right' | 'center'
type ITipNodeProps = {
  children: ReactNode
  placement?: Placement
  inBottom?: boolean
  target?: MutableRefObject<HTMLDivElement | null>
  isLight?: boolean
  tipRef: MutableRefObject<HTMLDivElement | null>
  hasArrow?: boolean
  size?: 'normal' | 'small'
  /** 暂未启用 */
  relative?: boolean
}
function TipNode({
  children,
  hasArrow = true,
  tipRef,
  isLight,
  target,
  inBottom,
  relative,
  size = 'normal',
  placement = 'center',
}: ITipNodeProps) {
  const contentRef = tipRef
  const windowHeight = envIsServer ? 675 : window.innerHeight
  const windowWidth = envIsServer ? 375 : window.innerWidth
  const [isShow, setIsShow] = useState(false)
  // 在触发 dom 比较小的时候不使用 center 会有显示问题，不过这种情况也只该使用 center
  // 使用 fixed 是为了避免 transform 时被遮挡，但带来的问题是滚动时不会跟随
  // 解决办法是滚动时消失
  function getPosition() {
    const isSmall = size === 'small'
    const arrowHeight = isSmall ? 2 : 4
    const contentGap = 16
    const targetRect = target?.current?.getBoundingClientRect() || {
      left: 0,
      top: 0,
      bottom: 0,
      width: 0,
      height: 0,
    }
    const contentRefWidth = contentRef.current?.clientWidth || 0
    let arrowLeftOffsetWhenPlacementLeft = 12
    // 预留边距不够时
    if (
      arrowLeftOffsetWhenPlacementLeft > targetRect.width / 2 ||
      arrowLeftOffsetWhenPlacementLeft > contentRefWidth / 2
    ) {
      arrowLeftOffsetWhenPlacementLeft = Math.min(targetRect.width / 2, contentRefWidth / 2)
    }
    const arrowLeft =
      placement === 'left' ? targetRect.left + arrowLeftOffsetWhenPlacementLeft : targetRect.left + targetRect.width / 2
    const arrowBottom = windowHeight - targetRect.top + (isSmall ? 0 : 4)
    const arrowTop = targetRect.bottom
    let contentLeftWhenCenter = arrowLeft - contentRefWidth / 2
    // 超出右边边界
    if (contentLeftWhenCenter + contentRefWidth + contentGap >= windowWidth) {
      contentLeftWhenCenter = windowWidth - contentRefWidth - contentGap
    }
    // 超出左边界
    if (contentLeftWhenCenter < contentGap) {
      contentLeftWhenCenter = contentGap
    }
    const contentLeft =
      placement === 'left'
        ? targetRect.left
        : placement === 'center' && contentRef.current
        ? contentLeftWhenCenter
        : undefined
    const contentRight = placement === 'right' ? targetRect.left + targetRect.width : undefined
    const contentBottom = inBottom ? undefined : arrowBottom + arrowHeight
    const contentTop = inBottom ? arrowTop + arrowHeight : undefined
    const contentMaxWidth =
      placement === 'center'
        ? windowWidth - contentGap * 2
        : placement === 'left'
        ? windowWidth - contentGap - (contentRight || 0)
        : windowWidth - (contentLeft || 0) - contentGap
    return {
      arrowLeft,
      arrowBottom,
      contentLeft,
      contentRight,
      contentBottom,
      contentMaxWidth,
      contentTop,
      arrowTop,
    }
  }

  const [
    { arrowLeft, arrowTop, contentTop, arrowBottom, contentLeft, contentRight, contentBottom, contentMaxWidth },
    setPosition,
  ] = useState(() => getPosition())
  // 每次更新时都重新计算位置
  useEffect(() => {
    setPosition(getPosition())
    setIsShow(true)
    // 这里可能导致频繁计算，但是 tooltip 出现的时间并不长，所以可以忽略性能影响
  }, [placement, inBottom, size, children])
  useEffect(() => {
    function onScroll() {
      setPosition(getPosition())
    }
    window.addEventListener('scroll', onScroll, true)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [])

  if (!target) {
    return null
  }
  return createPortal(
    <div
      className={classNames(styles['tip-wrapper'], {
        'is-relative': relative,
        'opacity-0': !isShow,
        'is-light': isLight,
        'is-small': size === 'small',
      })}
    >
      <div
        className={classNames(
          'arrow',
          {
            hidden: !hasArrow,
          },
          inBottom ? 'arrow-bottom' : 'arrow-top'
        )}
        style={{
          left: arrowLeft,
          bottom: inBottom ? undefined : arrowBottom,
          top: inBottom ? arrowTop : undefined,
        }}
      ></div>
      <div
        className="content"
        ref={contentRef}
        style={{
          left: contentLeft,
          right: contentRight,
          bottom: contentBottom,
          maxWidth: contentMaxWidth,
          top: contentTop,
        }}
      >
        <div className="text">{children}</div>
      </div>
    </div>,
    document.body
  )
}

export type ITooltipProps = {
  children: ReactNode
  content: ReactNode
  className?: string
  placement?: Placement
  inBottom?: boolean
  isLight?: boolean
  hasArrow?: boolean
  onVisibleChange?: (visible: boolean) => void
  /** 总是展示 */
  alwaysOpen?: boolean
  relative?: boolean
  size?: 'normal' | 'small'
}
function Tooltip(props: ITooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    props.onVisibleChange?.(isOpen)
  }, [isOpen])
  useClickAway(
    () => {
      setIsOpen(false)
    },
    [containerRef, tipRef],
    // click 事件可能会被子元素阻止冒泡，同时滚动时消失，避免重新计算定位
    ['touchstart', 'click', 'mousedown']
  )
  return (
    <div ref={containerRef} onClick={() => setIsOpen(!isOpen)} className={classNames('relative', props.className)}>
      {props.children}
      {(isOpen || props.alwaysOpen === true) && (
        <TipNode
          isLight={props.isLight}
          inBottom={props.inBottom}
          target={containerRef}
          placement={props.placement}
          tipRef={tipRef}
          hasArrow={props.hasArrow}
          size={props.size}
          relative={props.relative}
        >
          {props.content}
        </TipNode>
      )}
    </div>
  )
}

export default Tooltip
