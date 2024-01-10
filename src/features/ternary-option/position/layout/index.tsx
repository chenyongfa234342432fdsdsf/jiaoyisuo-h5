/**
 * 三元期权 - 当前持仓
 */
import CommonList from '@/components/common-list/list'
import { useEffect, useState } from 'react'
import { requestWithLoading } from '@/helper/order'
import { getOptionPositionList } from '@/apis/ternary-option/position'
import { useOptionPositionStore } from '@/store/ternary-option/position'
import { IOptionPositionList } from '@/typings/api/ternary-option/position'
import { useMemoizedFn, useMount, useUnmount, useUpdateEffect } from 'ahooks'
import { OptionOrder } from '@/plugins/ws/protobuf/ts/proto/OptionOrder'
import { OptionsOrderProfitTypeEnum } from '@/constants/assets/common'
import { onFilterSymbol, onGetMarkPriceSubs } from '@/helper/ternary-option'
import { OptionsPositionCell } from '../position-cell'
import styles from './index.module.css'

function PositionLayout() {
  const {
    positionList,
    positionSymbolList,
    updateOptionPositionList,
    fetchOptionDictionaryEnums,
    wsOptionOrderSubscribe,
    wsOptionOrderUnSubscribe,
    wsMarkPriceSubscribe,
    updateSettlementList,
    wsMarkPriceUnSubscribe,
  } = useOptionPositionStore()
  const [resultData, setResultData] = useState<any>({})
  useMount(fetchOptionDictionaryEnums)

  const onLoadPositionList = async () => {
    const res = await getOptionPositionList({
      pageNum: 1,
      pageSize: 500,
    })

    const { isOk, data } = res || {}
    if (!isOk || !data) return

    updateOptionPositionList((data?.list as any) || ([] as IOptionPositionList[]))
    if (data?.list && data?.list.length > 0) onFilterSymbol(data?.list)
  }

  const onOrderWsCallBack = useMemoizedFn((data: OptionOrder[]) => {
    if (data.length === 0) return
    const optionOrder = data[0]?.optionOrder

    if (optionOrder.length === 0) return
    const newResultData = optionOrder[0]

    updateSettlementList(optionOrder)
    if (newResultData?.profitable !== OptionsOrderProfitTypeEnum.notProfit) {
      setResultData(newResultData)
      setTimeout(() => {
        onLoadPositionList()
      }, 2000)

      return
    }

    onLoadPositionList()
  })

  useEffect(() => {
    requestWithLoading(onLoadPositionList(), 0)

    wsOptionOrderSubscribe(onOrderWsCallBack)
  }, [])

  useUpdateEffect(() => {
    wsMarkPriceUnSubscribe(onGetMarkPriceSubs())
    wsMarkPriceSubscribe(onGetMarkPriceSubs())
  }, [positionSymbolList])

  useUnmount(() => {
    wsOptionOrderUnSubscribe(onOrderWsCallBack)
    wsMarkPriceUnSubscribe(onGetMarkPriceSubs())
  })

  return (
    <div className={styles['option-position-layout-root']}>
      <CommonList
        finished
        listChildren={positionList.map((positionInfo: IOptionPositionList, i: number) => {
          return (
            <OptionsPositionCell
              key={i}
              className={i + 1 === positionList.length ? '!border-0' : ''}
              data={positionInfo}
              result={resultData}
            />
          )
        })}
        showEmpty={positionList.length === 0}
      />
    </div>
  )
}

export { PositionLayout }
