import { t } from '@lingui/macro'
import { useEffect, useRef, useState } from 'react'
import { useCommonStore } from '@/store/common'
import { ThemeEnum } from '@nbit/chart-utils'
import { IntroSteps } from '@/components/intro-js/intro-steps'
import introStyles from '@/components/intro-js/intro-steps/index.module.css'
import { Step, Steps } from 'intro.js-react'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { GUIDE_ELEMENT_IDS_ENUM } from '@/constants/guide-ids'
import classNames from 'classnames'
import { useBaseGuideMapStore } from '@/store/server'
import { GuideMapEnum } from '@/constants/common'
import { useFutureTradeStore } from '@/store/trade/future'
import { useInterval, useUpdateEffect } from 'ahooks'
import { awaitTime, getBusinessName } from '@/helper/common'
import { FuturesPositionViewTypeEnum } from '@/constants/assets/futures'
import { baseAssetsFuturesStore } from '@/store/assets/futures'
import { requestWithLoading } from '@/helper/order'
import { useFutureExtraVisible } from '../exchange-extra'
import styles from './index.module.css'

export type IFutureTradeGuideProps = {
  setFutureDetailVisible: (visible: boolean) => void
}

export function FutureTradeGuide() {
  const { theme } = useCommonStore()
  const { settings, setTutorialFutureDetailVisible, isTutorialMode, setIsTutorialMode } = useFutureTradeStore()
  const { guideMap, postGuideMapUpdate } = useBaseGuideMapStore()
  // 新版只看是否手动开启了
  const [stepEnabled, setStepEnabled] = useState(false)
  const [step, setStep] = useState(0)

  const onRenderIntro = (src: string, title: string, hint: string) => {
    const imgSrc = `${oss_svg_image_domain_address}guide/${src}${theme === ThemeEnum.light ? '_white' : '_black'}.svg`
    return (
      <div style={{ minWidth: 210 }}>
        {src && <img alt="" src={imgSrc} height={40} />}
        <div className="font-bold text-xs text-leading-1-5">{title}</div>
        <div
          className="text-xs text-leading-1-5"
          dangerouslySetInnerHTML={{
            __html: hint,
          }}
        ></div>
      </div>
    )
  }
  const steps: Step[] = [
    {
      element: `#${GUIDE_ELEMENT_IDS_ENUM.futureBalance}`,
      intro: onRenderIntro(
        '',
        t`features_trade_future_future_trade_guide_j2fyqnvgwl`,
        t`features_trade_future_future_trade_guide_ajri3yxysh`
      ),
      position: 'bottom',
      tooltipClass: classNames(introStyles['intro-tooltip'], '!top-9'),
    },
    {
      element: `#${GUIDE_ELEMENT_IDS_ENUM.futureTradeGroup}`,
      intro: onRenderIntro(
        '',
        t`features_trade_future_header_n7dfzateyj`,
        t`features_trade_future_future_trade_guide_xz0pfikcxr`
      ),
      position: 'bottom',
      tooltipClass: introStyles['intro-tooltip'],
    },
    {
      element: `#${GUIDE_ELEMENT_IDS_ENUM.futureCoinMenu}`,
      intro: onRenderIntro(
        '',
        t`features_trade_future_future_trade_guide_fanhc1w7g7`,
        t({
          id: 'features_trade_future_future_trade_guide_iw0_3uqanm',
          values: {
            0: getBusinessName(),
          },
        })
      ),
      position: 'bottom',
      tooltipClass: introStyles['intro-tooltip'],
    },
    {
      element: `#${GUIDE_ELEMENT_IDS_ENUM.futureLever}`,
      intro: onRenderIntro(
        '',
        t`features_trade_future_future_trade_guide_sa7fth36oc`,
        t`features_trade_future_future_trade_guide_5d6tsjwx1o`
      ),
      position: 'bottom-left-aligned',
      tooltipClass: introStyles['intro-tooltip'],
    },
    {
      element: `#${GUIDE_ELEMENT_IDS_ENUM.futureCount}`,
      intro: onRenderIntro(
        '',
        t`features_trade_future_future_trade_guide_0fvnexnw_y`,
        t`features_trade_future_future_trade_guide_qmvznwd7t5`
      ),
      position: 'bottom',
      tooltipClass: introStyles['intro-tooltip'],
    },
    {
      element: `#${GUIDE_ELEMENT_IDS_ENUM.futureOrderButton}`,
      intro: onRenderIntro(
        '',
        t`features_trade_future_future_trade_guide_esfmwvoq98`,
        t`features_trade_future_future_trade_guide_hswgm6nmxq`
      ),
      position: 'bottom',
      tooltipClass: introStyles['intro-tooltip'],
    },
    {
      element: `.${GUIDE_ELEMENT_IDS_ENUM.futureTradePosition}`,
      intro: onRenderIntro('', t`constants_order_729`, t`features_trade_future_future_trade_guide_jt74sjo6qr`),
      position: 'bottom',
      tooltipClass: introStyles['intro-tooltip'],
    },
    {
      element: `.${GUIDE_ELEMENT_IDS_ENUM.futureTradePositionSwitchView}`,
      intro: onRenderIntro(
        '',
        t`features_trade_future_future_trade_guide_zqrvw9kkle`,
        t`features_trade_future_future_trade_guide_ym4xr05azi`
      ),
      position: 'bottom-right-aligned',
      tooltipClass: introStyles['intro-tooltip'],
    },
    {
      element: `#${GUIDE_ELEMENT_IDS_ENUM.futureTradePositionAccountCell}`,
      intro: onRenderIntro(
        '',
        t`features_trade_future_future_trade_guide_hve29tdtjx`,
        t`features_trade_future_future_trade_guide_0zha7ak61_`
      ),
      position: 'top',
      tooltipClass: introStyles['intro-tooltip'],
    },
    {
      element: `#${GUIDE_ELEMENT_IDS_ENUM.futureAccountDetailSwitchAccountType}`,
      intro: onRenderIntro(
        '',
        t`features_trade_future_future_trade_guide_k9ip3seeuz`,
        t`features_trade_future_future_trade_guide_tyhxa0vnqy`
      ),
      position: 'bottom-right-aligned',
      tooltipClass: classNames(introStyles['intro-tooltip'], styles['intro-tooltip-account']),
    },
    {
      element: `.${GUIDE_ELEMENT_IDS_ENUM.futurePositionListClose}`,
      intro: onRenderIntro('', t`constants/assets/common-1`, t`features_trade_future_future_trade_guide_t12pntdaow`),
      position: 'bottom',
      tooltipClass: introStyles['intro-tooltip'],
    },
    {
      element: `#${GUIDE_ELEMENT_IDS_ENUM.futureAccountDetailAccountOverview}`,
      intro: onRenderIntro(
        '',
        t`features_trade_future_future_trade_guide_rhskdsnxe_`,
        t`features_trade_future_future_trade_guide_dd2o7yz1k6`
      ),
      position: 'bottom-middle-aligned',
      tooltipClass: classNames(introStyles['intro-tooltip'], '!left-4'),
    },
    false
      ? {
          element: `#${GUIDE_ELEMENT_IDS_ENUM.futureTradeExtraMargin}`,
          intro: onRenderIntro(
            'guide_future_trade_extra_margin',
            '',
            t`features_trade_future_future_trade_guide_5pwcc3vqmmwvur1kagtvx`
          ),
          position: 'top',
          tooltipClass: classNames(introStyles['intro-tooltip'], 'in-top'),
        }
      : (undefined as any),
    false
      ? {
          element: `#${GUIDE_ELEMENT_IDS_ENUM.futureTradeAutoAddMargin}`,
          intro: onRenderIntro(
            'guide_future_trade_autoadd_margin',
            '',
            t`features_trade_future_future_trade_guide_uo-9lyhsynbh_rsnrdiui`
          ),
          position: 'top',
          tooltipClass: classNames(introStyles['intro-tooltip'], 'in-top'),
        }
      : (undefined as any),
  ].filter(a => a)
  // 页面需要一些时间加载，所以延迟显示，如果不可见那么马上展示
  // 现在组件不支持实时自动调整引导弹窗的位置（即使支持，出现晃动也不好）
  const [loaded, setLoaded] = useState(!settings.noticeBarVisible)
  useEffect(() => {
    if (!settings.notificationLoaded) {
      return
    }
    const timer = setTimeout(() => {
      setLoaded(true)
    }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [settings.notificationLoaded])
  useUpdateEffect(() => {
    if (stepEnabled) {
      setStep(0)
    }
  }, [stepEnabled])
  const onModeChange = async () => {
    if (isTutorialMode) {
      baseAssetsFuturesStore.getState().updateAssetsFuturesSetting({
        positionViewType: FuturesPositionViewTypeEnum.position,
      })
      // 等持仓列表切换完成
      await requestWithLoading(awaitTime(600))
    }
    setStepEnabled(isTutorialMode)
  }
  useEffect(() => {
    onModeChange()
  }, [isTutorialMode])
  const stepsRef = useRef<Steps>(null)

  const onStepBeforeChange = async (nextStep: number) => {
    if (!steps[nextStep - 1]) {
      return
    }
    // 切换视图
    if (steps[nextStep - 1]?.element === `.${GUIDE_ELEMENT_IDS_ENUM.futureTradePositionSwitchView}`) {
      baseAssetsFuturesStore.getState().updateAssetsFuturesSetting({
        positionViewType: FuturesPositionViewTypeEnum.account,
      })
      await requestWithLoading(awaitTime(600))

      // 跳转到持仓详情
    } else if (steps[nextStep - 1]?.element === `#${GUIDE_ELEMENT_IDS_ENUM.futureTradePositionAccountCell}`) {
      setTutorialFutureDetailVisible(true)
      await requestWithLoading(awaitTime(600))
    }

    stepsRef.current?.updateStepElement(nextStep)
  }
  const onStepChange = async (nextStep: number) => {
    setStep(nextStep)
    await awaitTime(400)
    const el: HTMLDivElement = document.querySelector('.introjs-helperLayer')!
    // 这一步给边框加上缩放
    const willTransform = [
      `#${GUIDE_ELEMENT_IDS_ENUM.futureAccountDetailAccountOverview}`,
      `.${GUIDE_ELEMENT_IDS_ENUM.futureTradePosition}`,
    ].includes(steps[nextStep]?.element as any)
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
  const onExit = async () => {
    setStepEnabled(false)
    setIsTutorialMode(false)
    setTutorialFutureDetailVisible(false)
    postGuideMapUpdate(GuideMapEnum.contractTransactions)
    document.querySelector('.introjs-helperLayer')?.remove()
  }

  if (!stepEnabled || !loaded || step > steps.length) return null
  return (
    <>
      {step < steps.length - 1 && stepEnabled && (
        <div className={introStyles['intro-jump-btn-root']} onClick={onExit}>
          {t`features_assets_futures_futures_details_position_operation_guide_index_5101460`}
        </div>
      )}
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
        onBeforeChange={onStepBeforeChange}
        onChange={onStepChange as any}
      />
    </>
  )
}
