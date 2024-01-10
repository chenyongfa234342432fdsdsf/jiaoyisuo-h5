import 'intro.js/introjs.css'
import { Steps, StepsProps } from 'intro.js-react'
import classNames from 'classnames'
import { LegacyRef, forwardRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useInterval, useUpdate } from 'ahooks'
import styles from './index.module.css'

type IProps = Omit<StepsProps, 'initialStep'> & {
  initialStep?: number
  stepEnabled: boolean
  onStartCallback?: () => void
  /**
   * 需使用 style 引入。作用于所有 steps 的样式。
   */
  highlightClassCustom?: string
  tooltipClassCustom?: string
  onChange?: (e?: number) => void
  ref?: LegacyRef<Steps>
}

/**
 * 更多注解参考此 commit：https://gitlab.nbttfc365.com/fe/newbit/newbit-h5/-/merge_requests/848#939cf66f2e7f8fe778342cfc10498276ac0dccd7
 */
function IntroStepsCom(
  { stepEnabled, steps, onExit, onComplete, onChange, onBeforeChange, initialStep = 0, ...rest }: IProps,
  ref
) {
  return (
    <Steps
      enabled={stepEnabled}
      steps={steps}
      ref={ref}
      initialStep={initialStep}
      onExit={onExit}
      onComplete={onComplete}
      onStart={() => {
        rest.onStartCallback && rest.onStartCallback()
      }}
      /**
       * @doc https://introjs.com/docs/intro/options
       */
      options={{
        ...(rest.options ? rest.options : {}),

        highlightClass: classNames(styles['introjs-helperLayer-custom-default'], {
          [rest.highlightClassCustom || '']: !!rest.highlightClassCustom,
        }),
        tooltipClass: classNames(styles['introjs-tooltip-custom-default'], {
          [rest.tooltipClassCustom || '']: !!rest.tooltipClassCustom,
        }),
      }}
      onChange={onChange && onChange}
      onBeforeChange={onBeforeChange}
    />
  )
}

export const IntroSteps = forwardRef(IntroStepsCom)

/**
 * 在需要一些自定义事件处理的时候使用，有些 jsx 是转成了 dom 字符串
 *  原理是定时更新去查找容器元素做更新
 */
export function IntervalPortalWrapper({ children, selector }) {
  const [targetEl, setTargetEl] = useState(null)
  useInterval(() => {
    const el = document.querySelector(selector)
    setTargetEl(el)
  }, 500)

  if (!targetEl) {
    return null
  }

  return createPortal(children, targetEl as any)
}
