import { t } from '@lingui/macro'
import { useRef, useState } from 'react'
import { IntervalPortalWrapper, IntroSteps } from '@/components/intro-js/intro-steps'
import introStyles from '@/components/intro-js/intro-steps/index.module.css'
import { Steps } from 'intro.js-react'
import classNames from 'classnames'
import { useBaseGuideMapStore } from '@/store/server'
import { useDebounceEffect, useUpdateEffect } from 'ahooks'
import { awaitTime, getBusinessName } from '@/helper/common'
import { requestWithLoading } from '@/helper/order'
import { useOptionTradeStore } from '@/store/ternary-option/trade'
import { useTernaryOptionStore } from '@/store/ternary-option'
import { TernaryOptionPriceSourceEnum } from '@/constants/ternary-option'
import { Dialog } from '@nbit/vant'
import { useHelpCenterUrl } from '@/hooks/use-help-center-url'
import { getGuideSteps } from '@/helper/ternary-option/trade'
import { useUserStore } from '@/store/user'
import { link } from '@/helper/link'
import { OPTION_GUIDE_ELEMENT_IDS_ENUM } from '@/constants/guide-ids'
import Icon from '@/components/icon'
import styles from './index.module.css'

let dialogPending = false
export function TernaryOptionTradeGuide({ isTernary = false, withAdvanceSteps = false }) {
  const { currentCoinExcludePrice } = useTernaryOptionStore()
  const {
    setTutorialAdvancedVisible,
    setNeedGuide,
    isTutorialMode,
    setIsTutorialMode,
    setTutorialAdvancedChecked,
    setNotNeedOverTableGuide,
    tutorialAdvancedVisible,
    cacheData,
  } = useOptionTradeStore()
  const { guideMap, postGuideMapUpdate } = useBaseGuideMapStore()
  // 新版只看是否手动开启了
  const [stepEnabled, setStepEnabled] = useState(false)
  const [step, setStep] = useState(0)
  const { isLogin } = useUserStore()
  const onExit = async () => {
    setStepEnabled(false)
    setIsTutorialMode(false)
    setNeedGuide(false)
    setTutorialAdvancedChecked(false)
    if (isTernary) {
      setNotNeedOverTableGuide(true)
    }
    setTutorialAdvancedVisible(false)
    document.querySelector('.introjs-helperLayer')?.remove()
  }
  const onRenderIntro = (title: string, hint: string, className?: string, minWidth = 210) => {
    // 关闭按钮事件不起作用，这里只能做一些样式布局，不能做事件绑定，组件是转换成了字符串，所以放在下面的容器里了
    return (
      <div style={{ minWidth }} className={classNames(className, 'relative')}>
        <div
          dangerouslySetInnerHTML={{
            __html: title,
          }}
          className="font-semibold text-xs text-leading-1-5"
        ></div>
        <div
          className="text-xs text-leading-1-5"
          dangerouslySetInnerHTML={{
            __html: hint,
          }}
        ></div>
      </div>
    )
  }
  const priceType =
    currentCoinExcludePrice.priceSource === TernaryOptionPriceSourceEnum.index
      ? t`future.funding-history.index-price.column.index-price`
      : t`future.funding-history.index-price.column.mark-price`
  const steps = getGuideSteps({
    isOverMode: isTernary,
    isTutorialMode,
    styles,
    onRenderIntro,
    withAdvanceSteps: withAdvanceSteps || tutorialAdvancedVisible,
    onlyAdvanceSteps: tutorialAdvancedVisible,
  })
  useUpdateEffect(() => {
    if (stepEnabled) {
      setStep(0)
    }
  }, [stepEnabled])
  const willEnable = isTutorialMode
  const optionGuideLink = useHelpCenterUrl('option_video').replace('/http', 'http')
  const showDialog = async () => {
    const linkText = t`features_ternary_option_trade_guide_ldjpblupib`
    const message = t({
      id: `features_ternary_option_trade_guide_0tr3nzu_kn`,
      values: {
        0: getBusinessName(),
        1: optionGuideLink,
        2: linkText,
      },
    })
    await Dialog.confirm({
      title: t`features_ternary_option_trade_guide_c7fzkvip6p`,
      className: 'dialog-confirm-wrapper cancel-bg-gray confirm-black',
      message: (
        <div
          className="text-left"
          dangerouslySetInnerHTML={{
            __html: message,
          }}
        ></div>
      ),
      cancelButtonText: t`features_trade_common_notification_index_5101066`,
      confirmButtonText: t`helper_future_qzp1h8vhjf`,
    })
    setStepEnabled(willEnable)
  }

  const onModeChange = async () => {
    if (dialogPending) {
      return
    }
    if (willEnable) {
      // 等持渲染完成
      await requestWithLoading(awaitTime(300), 0)
      // 第一次进入页面才需要引导
      if (cacheData.needGuide === false) {
        setStepEnabled(willEnable)
        return
      }
      dialogPending = true
      showDialog().catch(() => {
        onExit()
      })
      dialogPending = false
    }
  }
  useDebounceEffect(
    () => {
      onModeChange()
    },
    [willEnable],
    {
      wait: 500,
    }
  )
  const stepsRef = useRef<Steps>(null)

  const onStepBeforeChange = async (nextStep: number) => {
    if (!steps[nextStep - 1]) {
      return
    }
    if (steps[nextStep]?.element?.toString().includes(OPTION_GUIDE_ELEMENT_IDS_ENUM.advance)) {
      setTutorialAdvancedChecked(true)
      await awaitTime(400)
    }
    stepsRef.current?.updateStepElement(nextStep)
  }
  const onComplete = () => {
    if (!isLogin) {
      link(`/login?redirect=${encodeURIComponent(window.location.pathname.split('?')[0])}`)
    }
  }
  const onStepChange = async (nextStep: number) => {
    setStep(nextStep)
    await awaitTime(400)
    const el: HTMLDivElement = document.querySelector('.introjs-helperLayer')!
    // 这一步给边框加上缩放
    const willTransform = [''].includes(steps[nextStep]?.element as any)
    if (el) {
      const tooltipEl: HTMLDivElement = document.querySelector('.introjs-tooltip')!
      if (willTransform) {
        const scaleX = (window.innerWidth - 18) / window.innerWidth
        const height = document.querySelector(steps[nextStep]?.element as any).clientHeight
        const scaleY = (height - 18) / height
        el.style.transform = `scale(${scaleX}, ${scaleY})`
        tooltipEl.style.transform = `translateY(${tooltipEl.className.includes('top') ? 12 : -12}px)`
      } else {
        el.style.transform = ''
        tooltipEl.style.transform = ''
      }
    }
  }
  if (!stepEnabled || step > steps.length) return null
  return (
    <>
      {step < steps.length - 1 && stepEnabled && (
        <div className={classNames(introStyles['intro-jump-btn-root'], '!top-4')} onClick={onExit}>
          {t`features_assets_futures_futures_details_position_operation_guide_index_5101460`}
        </div>
      )}
      <IntervalPortalWrapper selector=".introjs-tooltip">
        <Icon onClick={onExit} name="close" hasTheme className="text-base absolute right-4 top-5" />
      </IntervalPortalWrapper>
      <IntroSteps
        steps={steps}
        ref={stepsRef}
        stepEnabled={stepEnabled}
        onExit={onExit}
        initialStep={0}
        tooltipClassCustom={introStyles['introjs-tooltip-custom']}
        highlightClassCustom={introStyles['introjs-helperLayer-brand-border']}
        options={{
          showButtons: true,
          showBullets: false,
          showProgress: false,
          scrollElement: false,
          helperElementPadding: 0,
          doneLabel: t`features_trade_future_open_future_guide_modal_xakpkvkhju`,
          exitOnOverlayClick: false,
          nextLabel: t`user.field.reuse_23`,
        }}
        onComplete={onComplete}
        onBeforeChange={onStepBeforeChange}
        onChange={onStepChange as any}
      />
    </>
  )
}
