import produce from 'immer'
import { decimalUtils } from '@nbit/utils'
import { createContext, useContext, useRef, useState } from 'react'
import { useEventEmitter, useMemoizedFn, usePrevious, useUpdateEffect } from 'ahooks'
import { useUserStore } from '@/store/user'
import { link } from '@/helper/link'
import { useFutureCurrencySettings } from '@/hooks/features/trade'
import { usePageContext } from '@/hooks/use-page-context'
import { useTernaryOptionStore } from '@/store/ternary-option'
import { ITernaryOptionTradeProfitRate, ITernaryOptionTradeTime } from '@/typings/api/ternary-option'
import { TernaryOptionTradeDirectionEnum, TernaryOptionTradeTabEnum } from '@/constants/ternary-option'
import { useOptionTradeStore } from '@/store/ternary-option/trade'
import { isUpOptionDirection } from '@/helper/ternary-option'
import { useSpotCoinBalance } from '@/hooks/features/assets/spot'
import { useShowTips } from './use-show-tips'

const SafeCalcUtil = decimalUtils.SafeCalcUtil
/** 用于判断空、小数点作保留原始输入的情况 */
function getValue(originValue: string, numberValue: any) {
  const finalValue = originValue === '' || /\d+\.\d*$/.test(originValue) ? originValue : numberValue
  return finalValue
}

function getMax18Value(value: string) {
  return value.length > 18 ? value.slice(0, 18) : value
}

export type IOptionExchangeBaseContext = {
  amount: string
  direction?: TernaryOptionTradeDirectionEnum
  time?: ITernaryOptionTradeTime
  targetProfitRate?: ITernaryOptionTradeProfitRate
  isSmartDouble: boolean
  maxAmount: string
  maxTriggerTimes: string
  advancedEntrustChecked: boolean
  /** 自身 tab */
  selfTab: TernaryOptionTradeTabEnum
  /** 实际由外层控制 */
  activeTab: TernaryOptionTradeTabEnum
}

export const OptionExchangeContext = createContext<ReturnType<typeof useOptionExchangeInTop>>({} as any)
export function createExchangeContextValue(defaultValue: Partial<IOptionExchangeBaseContext>) {
  const initialData: IOptionExchangeBaseContext = {
    amount: '',
    isSmartDouble: false,
    maxAmount: '',
    maxTriggerTimes: '',
    advancedEntrustChecked: false,
    selfTab: TernaryOptionTradeTabEnum.normal,
    activeTab: TernaryOptionTradeTabEnum.normal,
  }
  Object.assign(initialData, defaultValue)

  return initialData
}
function resetData(tempTradeInfo: IOptionExchangeBaseContext, { keepAmount = true, keepTime = true } = {}) {
  if (!keepAmount) {
    tempTradeInfo.amount = ''
  }
  if (!keepTime) {
    tempTradeInfo.time = undefined
  }
  tempTradeInfo.isSmartDouble = false
  tempTradeInfo.maxAmount = ''
  tempTradeInfo.direction = undefined
  tempTradeInfo.maxTriggerTimes = ''
  tempTradeInfo.advancedEntrustChecked = false
}

export function useOptionExchangeInTop(defaultTradeInfo: Partial<IOptionExchangeBaseContext> = {}, balance: number) {
  const pageContext = usePageContext()
  const { currentCoinExcludePrice: currentCoin } = useTernaryOptionStore()
  const preCoin = usePrevious(currentCoin)
  let [tradeInfo, setTradeInfo] = useState<IOptionExchangeBaseContext>(createExchangeContextValue(defaultTradeInfo))
  const tradeInfoRef = useRef(tradeInfo)
  tradeInfoRef.current = tradeInfo
  /** effect 中使用传入 target */
  const updateTradeInfo = (target: Partial<IOptionExchangeBaseContext>) => {
    setTradeInfo(old => {
      return {
        ...old,
        ...target,
      }
    })
  }
  const { isLogin } = useUserStore()
  // 合约法币精度
  const futureCurrencySettings = useFutureCurrencySettings()
  const futureCurrencyDigit = futureCurrencySettings.offset
  const {
    setTimeId,
    setIsTutorialMode,
    setTutorialAdvancedVisible,
    setNotFirstCheckAdvance,
    cacheData,
    isTutorialMode,
    tutorialAdvancedVisible,
    setSelectedProfitRateCache,
    tutorialAdvancedChecked,
  } = useOptionTradeStore()
  const buyDigit = Number(currentCoin.coinScale || 0)
  function useOnChange<T>(fn: (value: T, info: IOptionExchangeBaseContext) => void) {
    return useMemoizedFn((value: T, latestInfo?: IOptionExchangeBaseContext) => {
      // 函数内再次调用函数，就将传进来的值作为最新值处理一下，不做任何操作
      if (latestInfo) {
        fn(value, latestInfo)
        return
      }
      // 反之，就用最新的 tradeInfo
      setTradeInfo(
        produce(old => {
          fn(value, old)
        })
      )
    })
  }
  const onAmountChange = useOnChange((value: string, tempTradeInfo) => {
    if (value === tempTradeInfo.amount) {
      return
    }
    const newValue = value // Math.min(Number(value), balance).toString()
    tempTradeInfo.amount = getValue(value, newValue)
  })
  // @deprecated 这里只是占位，改动逻辑不生效
  const onTimeChange = useOnChange((value: ITernaryOptionTradeTime | undefined, tempTradeInfo) => {
    tempTradeInfo.time = value
    setTimeId(value?.id)
  })
  const isActive = tradeInfo.selfTab === tradeInfo.activeTab
  const onDirectionChange = useOnChange((value: TernaryOptionTradeDirectionEnum, tempTradeInfo) => {
    tempTradeInfo.direction = value
  })
  const tabIsOver = tradeInfo.selfTab === TernaryOptionTradeTabEnum.over
  const isOver = tabIsOver
  const upDirection = isOver ? TernaryOptionTradeDirectionEnum.overCall : TernaryOptionTradeDirectionEnum.call
  const onTargetProfitRateChange = useOnChange((value: ITernaryOptionTradeProfitRate | null, tempTradeInfo) => {
    tempTradeInfo.targetProfitRate = value || undefined
    if (!value) {
      return
    }
    setSelectedProfitRateCache(value, currentCoin.symbol!, upDirection)
  })
  const onIsSmartDoubleChange = useOnChange((value: boolean, tempTradeInfo) => {
    tempTradeInfo.isSmartDouble = value
  })
  const onMaxAmountChange = useOnChange((value: string, tempTradeInfo) => {
    tempTradeInfo.maxAmount = getMax18Value(value)
  })
  const onMaxTriggerTimesChange = useOnChange((value: string, tempTradeInfo) => {
    tempTradeInfo.maxTriggerTimes = getMax18Value(value)
  })
  const onTabChange = useOnChange((value: TernaryOptionTradeTabEnum, tempTradeInfo) => {
    tempTradeInfo.activeTab = value
  })
  const showTips = useShowTips()
  const onAdvancedEntrustCheckedChange = useOnChange(async (value: boolean, tempTradeInfo) => {
    tempTradeInfo.advancedEntrustChecked = value
    if (!cacheData.notFirstCheckAdvance && value) {
      setNotFirstCheckAdvance()
      setIsTutorialMode(true)
      // 处于教程模式加载，就不设置仅展示高级教程了
      if (tutorialAdvancedChecked) {
        return
      }
      setTutorialAdvancedVisible(true)
    }
  })
  useUpdateEffect(() => {
    // 切换标的币时才重置输入金额
    setTradeInfo(
      produce(tempTradeInfo => {
        resetData(tempTradeInfo, {
          keepAmount: false,
          keepTime: false,
        })
      })
    )
    // 切换币对时清空时间
    if (preCoin?.id && preCoin.id !== currentCoin.id) {
      setTimeId(null)
    }
  }, [currentCoin.id])
  const onOrder$ = useEventEmitter()
  const isUp = isUpOptionDirection(tradeInfo.direction!)
  // 高级教程模式开启置为 true
  useUpdateEffect(() => {
    if (tutorialAdvancedChecked && !isOver) {
      onAdvancedEntrustCheckedChange(true)
    }
  }, [tutorialAdvancedChecked])
  // 教程模式之前置为 false
  useUpdateEffect(() => {
    if (isTutorialMode && !tutorialAdvancedVisible) {
      onAdvancedEntrustCheckedChange(false)
    }
  }, [isTutorialMode])
  // 仅做 ref，这里不需要更新
  const couponsRef = useRef({
    coupons: [] as any[],
    // 体验价金额
    amount: 0,
  })
  const onCouponChange = (coupons: any[], amount = 0) => {
    couponsRef.current = {
      coupons,
      amount,
    }
  }

  return {
    tradeInfo,
    onAmountChange,
    onDirectionChange,
    currentCoin,
    onCouponChange,
    couponsRef,
    /** 实际由外层控制 */
    onTimeChange,
    onTargetProfitRateChange,
    onIsSmartDoubleChange,
    onAdvancedEntrustCheckedChange,
    onMaxAmountChange,
    onMaxTriggerTimesChange,
    onTabChange,
    /** 实际由外层控制 */
    isActive,
    tabIsOver,
    upDirection,
    buyDigit,
    balance,
    isUp,
    isOver,
    /** 实际由外层控制 */
    times: [] as ITernaryOptionTradeTime[],
    resetData: () => {
      setTradeInfo(
        produce(tempTradeInfo => {
          resetData(tempTradeInfo, {
            keepAmount: true,
            keepTime: true,
          })
        })
      )
    },
    onOrder: () => {
      if (!isLogin) {
        link(`/login?redirect=${pageContext.path}`)
        return
      }
      onOrder$.emit()
    },
  }
}
export function useOptionExchangeContext() {
  return useContext(OptionExchangeContext)
}
