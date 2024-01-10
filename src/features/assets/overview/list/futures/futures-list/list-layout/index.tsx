/**
 * 资产总览 - 合约列表
 */
import { useAssetsStore } from '@/store/assets/spot'
import { useEffect, useState } from 'react'
import { useDebounce, useUpdateEffect } from 'ahooks'
import CommonList from '@/components/common-list/list'
import { FuturesAssetsSortEnum, FuturesAssetsTypeEnum, FuturesPositionViewTypeEnum } from '@/constants/assets/futures'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { useFutureTradeStore } from '@/store/trade/future'
import { decimalUtils } from '@nbit/utils'
import { FuturesListHeader } from '../list-header'
import styles from './index.module.css'
import { AccountCell } from '../account-cell'

export type IFuturesPositionListForm = {
  sort: string
  type: string
  name?: string
}

interface IFuturesPositionListProps {
  viewVisible?: boolean
  showUnit?: boolean
}

function FuturesPositionList(props: IFuturesPositionListProps) {
  const { SafeCalcUtil } = decimalUtils
  const { viewVisible = false, showUnit = true } = props || {}
  const { isTutorialMode } = useFutureTradeStore()
  const { futuresAssetsList, futuresAssetsAccountForm, updateFuturesAssetsAccountForm } = useAssetsStore().assetsModule
  const { fetchFuturesEnums, updateAssetsFuturesSetting } = useAssetsFuturesStore()
  const [formData, setFormData] = useState<IFuturesPositionListForm>({
    ...futuresAssetsAccountForm,
    name: '',
  })
  const debouncedSearchKey =
    useDebounce(formData.name, {
      wait: 300,
    }) || ''

  /**
   * 排序
   */
  const onSort = () => {
    if (!formData.sort) return [...futuresAssetsList]

    const newList = [...futuresAssetsList].sort((a, b) => {
      const { marginAvailable: aMarginAvailable } = a
      const { marginAvailable: bMarginAvailable } = b
      return formData.sort === FuturesAssetsSortEnum.up
        ? +SafeCalcUtil.sub(aMarginAvailable, bMarginAvailable)
        : +SafeCalcUtil.sub(bMarginAvailable, aMarginAvailable)
    })
    return newList
  }

  const displayList = onSort().filter(item => {
    const ignoreCaseKey = debouncedSearchKey.toUpperCase()
    const { groupName = '', unrealizedProfit = '' } = item || {}
    const isShowName = groupName && (groupName?.toUpperCase().includes(ignoreCaseKey) || ignoreCaseKey === '')
    return (
      (isShowName && !formData.type) ||
      (isShowName && formData.type === FuturesAssetsTypeEnum.just && Number(unrealizedProfit) > 0) ||
      (isShowName && formData.type === FuturesAssetsTypeEnum.negative && Number(unrealizedProfit) < 0)
    )
  })

  useEffect(() => {
    fetchFuturesEnums()
  }, [])

  useUpdateEffect(() => {
    updateFuturesAssetsAccountForm({ ...formData })
  }, [formData.sort, formData.type])

  return (
    <div className={styles['futures-list-root']}>
      <FuturesListHeader
        viewVisible={viewVisible}
        formData={formData}
        onChange={params => setFormData(params)}
        onChangeView={() =>
          updateAssetsFuturesSetting({
            positionViewType: FuturesPositionViewTypeEnum.position,
          })
        }
      />

      <CommonList
        className="p-4"
        showEmpty={displayList.length === 0}
        finished
        onlyRefresh={isTutorialMode}
        listChildren={displayList.map((futuresInfo, index) => {
          return <AccountCell key={index} data={futuresInfo} isFirst={index === 0} showUnit={showUnit} />
        })}
      />
    </div>
  )
}

export { FuturesPositionList }
