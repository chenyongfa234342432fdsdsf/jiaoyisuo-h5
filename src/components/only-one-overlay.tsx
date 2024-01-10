/** 创建一个本地存储的状态管理，用于控制多个 popup 时的显示控制 */

import { useDelayInvisible } from '@/hooks/use-delay-visible'
import { ActionSheet, ActionSheetProps, Popup, PopupProps } from '@nbit/vant'
import { useSafeState } from 'ahooks'
import { useEffect, useState } from 'react'

const queue: {
  key: any
  onVisibleChange: (visible: boolean) => void
}[] = []

function useOnlyOneOverlayVisible(visible: boolean) {
  const [visibleKey] = useState(Math.random())
  const [innerVisible, setInnerVisible] = useState(false)
  function findIndex() {
    return queue.findIndex(v => visibleKey === v.key)
  }
  function setAnotherToVisible() {
    if (queue.length === 0) {
      return
    }
    const last = queue[queue.length - 1]
    last.onVisibleChange(true)
  }
  function remove() {
    const index = findIndex()
    if (index !== -1) {
      queue.splice(index, 1)
    }
  }

  useEffect(() => {
    // 如果可见，把所有其它置为不可见，并将其加入队列
    if (visible) {
      queue.forEach(v => {
        v.onVisibleChange(false)
      })
      setInnerVisible(true)
      queue.push({
        key: visibleKey,
        onVisibleChange: setInnerVisible,
      })
    } else {
      // 否则移除，并将上一个置为可见
      remove()
      setAnotherToVisible()
    }

    // 这同样适用于被销毁时
    return () => {
      remove()
      setAnotherToVisible()
    }
  }, [visible])

  return innerVisible
}
/**
 * 重置 ios 不正确的渲染布局
 * ios 软键盘展开收起过程中出现弹窗，可能会显示错乱（审查元素发现位置是正确的，只是展示的位置不对），强制触发多次重排来避免
 * 在能触发对应 bug 的情况下，会导致弹窗闪烁一两次，不触发的话则不会闪烁
 */
function useRerenderIos(selectors: string, visible: boolean) {
  useEffect(() => {
    let timer: any = null
    const time = Date.now()
    const reRender = () => {
      timer = setTimeout(() => {
        const willEnd = Date.now() - time > 1000
        // 首先尝试对底部弹窗进行渲染，其它的暂时没发现有错位的情况
        const popups: NodeListOf<HTMLDivElement> = document.querySelectorAll(selectors)
        popups.forEach(popup => {
          popup.style.bottom = popup.style.bottom === '0px' && !willEnd ? '0.3px' : '0px'
        })
        if (!willEnd) {
          reRender()
        }
      }, 400)
    }
    reRender()
    timer = setTimeout(reRender)
    return () => {
      clearTimeout(timer)
    }
  }, [visible])
}

export function OnlyOnePopup({ visible, destroyOnClose, children, ...rest }: PopupProps) {
  const delayVisible = useDelayInvisible(visible || false)
  const innerVisible = useOnlyOneOverlayVisible(visible || false)
  useRerenderIos('.rv-popup.rv-popup--bottom', !!(innerVisible && visible))
  return (
    <Popup visible={innerVisible && visible} {...rest}>
      {(!destroyOnClose || delayVisible) && children}
    </Popup>
  )
}
export function OnlyOneActionSheet({ visible, destroyOnClose, children, ...rest }: ActionSheetProps) {
  const innerVisible = useOnlyOneOverlayVisible(visible || false)
  return (
    <ActionSheet visible={innerVisible && visible} {...rest}>
      {(!destroyOnClose || visible) && children}
    </ActionSheet>
  )
}
