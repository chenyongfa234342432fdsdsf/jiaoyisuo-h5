/**
 * 合约组详情 - 保证金列表操作指引
 */
import { t } from '@lingui/macro'
import { OSSDOMAIN_IMAGE } from '@/constants/assets'
import { IntroSteps } from '@/components/intro-js/intro-steps'
import { useEffect, useState } from 'react'
import { Step } from 'intro.js-react'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { useBaseGuideMapStore } from '@/store/server'
import { GuideMapEnum, GuideMapShowEnum } from '@/constants/common'
import { AssetsGuideIdEnum } from '@/constants/assets/common'
import styles from './index.module.css'

function MarginOperateGuide() {
  const [stepEnabled, setStepEnabled] = useState(false)
  const {
    futuresDetails: { margin },
  } = useAssetsFuturesStore()
  const { guideMap, postGuideMapUpdate } = useBaseGuideMapStore()

  useEffect(() => {
    guideMap?.additional_margin === GuideMapShowEnum.yes && margin?.list.length > 0 && setStepEnabled(true)
  }, [guideMap, margin.list])

  const onExit = () => {
    postGuideMapUpdate(GuideMapEnum.additionalMargin)
    setStepEnabled(false)
  }

  const steps: Step[] = [
    {
      element: `#${AssetsGuideIdEnum.futuresDetailAssetsListCell}`,
      intro: (
        <div className={styles['margin-operate-guide-root']}>
          <div className="content-img">
            <img alt="" src={`${OSSDOMAIN_IMAGE}withdrawal_address_list_arrow.svg`} width={94} height={23} />
            <img
              alt=""
              src={`${OSSDOMAIN_IMAGE}withdrawal_address_list_guide.svg`}
              width={26}
              height={34}
              style={{ marginRight: '30px', marginTop: '4px' }}
            />
          </div>

          <div className="hint-text">{t`features_assets_futures_futures_details_margin_operate_guide_index__htqrmjfjoydymkdggwhg`}</div>
        </div>
      ),
      position: 'bottom',
    },
  ]

  return (
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
      }}
    />
  )
}

export { MarginOperateGuide }
