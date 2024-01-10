import { useMemoizedFn, useCreation } from 'ahooks'
import { ISubscribeParams } from '@/plugins/ws/types'
import { setOptionOrdersPlanCurrent } from '@/apis/ternary-option/order'
import { useEffect, useState } from 'react'
import { WsTypesEnum, WsBizEnum } from '@/constants/ws'
import { useUserStore } from '@/store/user'
import { debounce } from 'lodash'
import optionWs from '@/plugins/ws/option'

export function useTernaryPlanOrder() {
  const { isLogin } = useUserStore()

  const [optionOrdersList, setOptionOrdersList] = useState<any[]>([])

  const setOptionOrdersChange = useMemoizedFn(
    debounce(async () => {
      const { isOk, data } = await setOptionOrdersPlanCurrent({ pageNum: '1', pageSize: '500' })
      if (isOk) {
        const list = data?.list || []
        setOptionOrdersList([...list])
      }
    }, 600)
  )

  useEffect(() => {
    if (isLogin) {
      setOptionOrdersChange()
    }
  }, [isLogin])

  const subscribeParams: ISubscribeParams[] = useCreation(
    () => [
      {
        subs: { biz: WsBizEnum.option, type: WsTypesEnum.optionPlanOrder },
        callback: setOptionOrdersChange,
      },
    ],
    []
  )

  useEffect(() => {
    if (isLogin) {
      subscribeParams.forEach(({ callback, ...params }) => {
        optionWs.subscribe({
          ...params,
          callback,
        })
      })
    }

    return () => {
      subscribeParams.forEach(params => {
        optionWs.unsubscribe(params)
      })
    }
  }, [isLogin])

  return { optionOrdersList }
}
