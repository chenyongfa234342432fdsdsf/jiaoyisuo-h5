/**
 * 资产 - 合约组详情 - 持仓操作指引
 */
import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { useCommonStore } from '@/store/common'
import { ThemeEnum } from '@nbit/chart-utils'
import { IntroSteps } from '@/components/intro-js/intro-steps'
import { Step } from 'intro.js-react'
import { isEmpty } from 'lodash'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { FuturesPositionStatusTypeEnum } from '@/constants/assets/futures'
import { useBaseGuideMapStore } from '@/store/server'
import { GuideMapEnum, GuideMapShowEnum } from '@/constants/common'
import { AssetsGuideIdEnum } from '@/constants/assets/common'
import styles from './index.module.css'

function PositionOperationGuide() {
  const { positionListFutures } = useAssetsFuturesStore()
  const { theme } = useCommonStore()
  const [stepEnabled, setStepEnabled] = useState(false)
  const [step, setStep] = useState(0)
  /** 是否是锁定状态 */
  const [isLock, setIsLock] = useState(false)
  const { guideMap, postGuideMapUpdate } = useBaseGuideMapStore()

  useEffect(() => {
    if (positionListFutures && positionListFutures.length > 0) {
      setIsLock(positionListFutures[0].statusCd === FuturesPositionStatusTypeEnum.locked)
      guideMap?.contract_group_details === GuideMapShowEnum.yes && setStepEnabled(true)
    }
  }, [guideMap, positionListFutures])

  const onExit = () => {
    postGuideMapUpdate(GuideMapEnum.contractGroupDetails)
    setStepEnabled(false)
  }

  const onRenderIntro = (src: string, hint: string) => {
    const imgSrc = `${oss_svg_image_domain_address}assets/${src}${theme === ThemeEnum.light ? '_white' : '_black'}.svg`
    return (
      <div className={styles['position-operation-guide-root']}>
        <img alt="" src={imgSrc} width={198} height={40} />
        <div className="content-text">{hint}</div>
      </div>
    )
  }

  const steps: Step[] = [
    {
      element: `#${AssetsGuideIdEnum.futuresDetailPositionListLock}`,
      intro: onRenderIntro(
        'bg_assets_futures_lock',
        isLock
          ? t`features_assets_futures_futures_details_position_operation_guide_index_fo2a9kuczopos_yn71zfn`
          : t`features_assets_futures_futures_details_position_operation_guide_index_5101530`
      ),
      position: 'right',
      tooltipClass: styles['intro-tooltip-lock'],
    },
    {
      element: `.${AssetsGuideIdEnum.futuresDetailPositionListMerge}`,
      intro: onRenderIntro(
        'bg_assets_futures_migrate',
        t`features_assets_futures_futures_details_position_operation_guide_index_203oo9oij9tl_9twpgeho`
      ),
      position: 'top',
      tooltipClass: styles['intro-tooltip-migrate'],
    },
    {
      element: `.${AssetsGuideIdEnum.futuresDetailPositionListReverse}`,
      intro: onRenderIntro(
        'bg_assets_futures_reverse',
        t`features_assets_futures_futures_details_position_operation_guide_index_5101463`
      ),
      position: 'top',
      tooltipClass: styles['intro-tooltip-reverse'],
    },
  ]

  if (isEmpty(positionListFutures)) return null

  return (
    <>
      {step <= 1 && stepEnabled && (
        <div className={styles['intro-jump-btn-root']} onClick={onExit}>
          {t`features_assets_futures_futures_details_position_operation_guide_index_5101460`}
        </div>
      )}
      <IntroSteps
        steps={steps}
        stepEnabled={stepEnabled}
        onExit={onExit}
        tooltipClassCustom={styles['introjs-tooltip-custom']}
        highlightClassCustom={styles['introjs-highlight-custom']}
        options={{
          showButtons: true,
          showBullets: false,
          showProgress: false,
          helperElementPadding: 0,
          doneLabel: t`features_trade_common_notification_index_5101066`,
          exitOnOverlayClick: false,
          nextLabel: t({
            id: 'features_assets_futures_futures_details_position_operation_guide_index_e583cqgzyhx9rivrdyp4c',
            values: { 0: step + 1 },
          }),
        }}
        onChange={nextStepIndex => setStep(nextStepIndex)}
      />
    </>
  )
}

export { PositionOperationGuide }
