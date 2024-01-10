import NavBar from '@/components/navbar'
import Questionnaire from '@/components/questionnaire'
import { t } from '@lingui/macro'
import { useState, useEffect } from 'react'
import { getFutureQuestions } from '@/helper/trade'
import { useFutureTradeStore } from '@/store/trade/future'
import { SettlementCurrency } from '@/features/trade/future/settings/settlement-currency'
import { getFutureTradePagePath } from '@/helper/route'
import { useContractMarketStore } from '@/store/market/contract'
import { link } from '@/helper/link'
import { MarginCoinTabs } from '../settings/margin-coin'

enum OpenFutureEnum {
  zero, // 第零页
  one = 1, // 第一页
  four = 4, // 第四页
}

function OpenFuture() {
  const [step, setStep] = useState(OpenFutureEnum.zero)
  const { clearOpenContractTransitionDatas } = useFutureTradeStore()
  const nextStep = () => {
    setStep(old => {
      if (old >= OpenFutureEnum.four) {
        return old
      }
      return old + OpenFutureEnum.one
    })
  }
  const onPreStep = () => {
    setStep(old => {
      if (old === OpenFutureEnum.zero) {
        history.back()
        return OpenFutureEnum.zero
      }
      return old - OpenFutureEnum.one
    })
  }
  const [showNavBar, setShowNavBar] = useState(true)
  const onVersionOk = () => {
    setShowNavBar(false)
  }
  const { defaultCoin: futureDefaultCoin } = useContractMarketStore()
  const onFinish = () => {
    link(`${getFutureTradePagePath({ symbolName: futureDefaultCoin.symbolName })}?userGuide`, {
      overwriteLastHistoryEntry: true,
    })
  }
  const steps = [
    {
      title: t`modules/future/questionnaire/index-0`,
      content: (
        <Questionnaire
          questions={getFutureQuestions()}
          onOk={nextStep}
          desc={t`modules/future/questionnaire/index-1`}
        />
      ),
    },
    {
      title: t`features/trade/future/settings/margin-coin-2`,
      content: <MarginCoinTabs isOpenContract onOk={nextStep} />,
    },
    {
      title: t`features/trade/future/settings/close-coin-5`,
      content: <SettlementCurrency isOpenContract onOk={onFinish} />,
    },
  ]

  useEffect(() => {
    clearOpenContractTransitionDatas()
  }, [])
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {showNavBar && <NavBar onClickLeft={onPreStep} title={steps[step].title} />}
      {steps[step].content}
    </div>
  )
}

export default OpenFuture
