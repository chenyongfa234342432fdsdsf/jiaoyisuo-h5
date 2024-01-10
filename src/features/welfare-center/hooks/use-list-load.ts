import { isNull } from 'lodash'
import { useState } from 'react'

const defaultPageSize = 10
export function useListLoad({ paramsData, loadRequest, pageSize = defaultPageSize }) {
  const [isShow, setIsShow] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [finished, setFinished] = useState<boolean>(false)
  const [pageNum, setPageNum] = useState(1)
  const [cardListData, setCardListData] = useState<any[]>([])
  const firstPage = 1

  // 加载请求
  const onLoad = async params => {
    setPageNum(v => v + firstPage)
    if (pageNum === firstPage || params?.pageNum === firstPage) {
      setIsShow(true)
    }
    setIsLoading(true)
    const res = await loadRequest({ pageNum, pageSize, ...paramsData, ...params })
    const responseData = res?.data || []
    setIsLoading(false)
    if (params?.pageNum === firstPage) {
      setCardListData(v => [...responseData])
    } else {
      setCardListData(v => [...v, ...responseData])
    }
    if (res?.data && res?.data?.length < pageSize) {
      setFinished(true)
    }
    setIsShow(false)
    if (isNull(res.data)) {
      setFinished(true)
    }
  }
  /** 刷新请求 */
  const onRefresh = params => {
    setFinished(false)
    setPageNum(1)
    onLoad({
      pageNum: firstPage,
      ...params,
    })
  }
  return { isShow, finished, onLoad, onRefresh, cardListData, isLoading }
}
