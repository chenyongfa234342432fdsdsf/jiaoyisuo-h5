import { useCreation, useEventEmitter } from 'ahooks'
import { useState, useImperativeHandle, forwardRef } from 'react'
// import NavBar from '@/components/navbar'
// import Icon from '@/components/icon'
import { t } from '@lingui/macro'
// import produce from 'immer'
// import { usePageContext } from '@/hooks/use-page-context'
// import { EntrustTypeEnum } from '@/constants/trade'
// import { link } from '@/helper/link'
// import { storeEnumsToOptions } from '@/helper/store'
// import { getFuturePagePath } from '@/helper/route'
// import { useOrderFutureStore } from '@/store/order/future'
import { getOptionOrdersHistory } from '@/apis/ternary-option/order'
import styles from './index.module.css'
import { getSpotFiltersModalDefaultParams, SpotFiltersModal } from './ternary-filters-modal'
import { BaseOrders } from './ternary-page-base-orders'
import { CapitalSelectParams } from '../ternaryorder'

function OrdersSpotPage(_, ref) {
  // const pageContext = usePageContext()

  // 当前订单通用部分
  const [currentSelectParams, setCurrentSelectParams] = useState<Record<'period' | 'sideInd' | 'optionId', string>>({
    period: '',
    sideInd: '',
    optionId: '',
  })

  const [filtersVisible, setFiltersVisible] = useState<boolean>(false)

  const [capitalSelectParams, setCapitalSelectParams] = useState<CapitalSelectParams>({
    ...getSpotFiltersModalDefaultParams(),
  })

  const $cancelAll = useEventEmitter()

  useImperativeHandle(ref, () => ({
    openFiltersVisibleModal() {
      setFiltersVisible(true)
    },
  }))

  const onModalParamsChange = (part: CapitalSelectParams) => {
    setCapitalSelectParams({ ...part })
    setFiltersVisible(false)
  }

  const currentPlanAllParams = useCreation(() => {
    return {
      ...currentSelectParams,
      ...capitalSelectParams,
    }
  }, [currentSelectParams, capitalSelectParams])

  const setContractLayoutList = () => {
    return (
      <BaseOrders
        $cancelAll={$cancelAll}
        listType="history"
        params={currentPlanAllParams}
        search={getOptionOrdersHistory}
        setParams={setCurrentSelectParams}
      />
    )
  }

  return (
    <div className={styles['spot-page-wrapper']}>
      {/* <NavBar
        title={t`features_ternary_option_option_order_ternary_history_ternary_history_page_iakwbo_gwv`}
        right={<Icon className="record-filter-icon" name="asset_record_filter" hasTheme />}
        onClickRight={() => setFiltersVisible(true)}
      /> */}
      {setContractLayoutList()}
      <SpotFiltersModal
        visible={filtersVisible}
        onClose={() => {
          setFiltersVisible(false)
        }}
        params={capitalSelectParams}
        onConfirm={onModalParamsChange}
      />
    </div>
  )
}

export default forwardRef(OrdersSpotPage)
