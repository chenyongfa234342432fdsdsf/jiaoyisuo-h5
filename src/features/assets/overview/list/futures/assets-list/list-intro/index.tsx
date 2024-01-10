/**
 * 资产总览 - 合约资产列表 - 列表引导
 */
import { t } from '@lingui/macro'
import { OSSDOMAIN_IMAGE } from '@/constants/assets'
import { IntroSteps } from '@/components/intro-js/intro-steps'
import { Step } from 'intro.js-react'
import { AssetsGuideIdEnum } from '@/constants/assets/common'
import styles from './index.module.css'

interface IFuturesAssetsListIntroProps {
  visible: boolean
  onExit: () => void
}
function FuturesAssetsListIntro({ visible, onExit }: IFuturesAssetsListIntroProps) {
  const steps: Step[] = [
    {
      element: `#${AssetsGuideIdEnum.assetsFuturesAssetsListCell}`,
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
      stepEnabled={visible}
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

export { FuturesAssetsListIntro }
