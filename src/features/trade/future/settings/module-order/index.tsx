import { t } from '@lingui/macro'
import { useReactive } from 'ahooks'
import Icon from '@/components/icon'
import NavBar from '@/components/navbar'
import FullTip from '@/features/trade/common/full-tip'
import { useFutureTradeStore } from '@/store/trade/future'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import OrderDrag from '@/features/trade/future/settings/component/order-drag'

export function ModuleOrderContent() {
  const { moduleOrderData, setModuleOrderData } = useFutureTradeStore()
  const state = useReactive({
    loading: false,
  })

  const onOrderDragChange = v => {
    const newOrderData = v || []
    const sortData = newOrderData.map((item, index) => {
      return {
        ...item,
        sort: index + 1,
      }
    })
    setModuleOrderData(sortData)
  }

  return (
    <div>
      <FullTip message={t`features_trade_future_settings_module_order_index_fkvtnwsgmvxfczra5czy7`} />
      <OrderDrag data={moduleOrderData} onChange={onOrderDragChange} />
      <FullScreenLoading mask isShow={state.loading} />
    </div>
  )
}
export function ModuleOrder() {
  return (
    <section>
      <NavBar
        title={t`features_trade_future_settings_module_order_index_vhwl5qdm10cjk-o7pqrmk`}
        left={<Icon name="back" hasTheme />}
      />
      <ModuleOrderContent />
    </section>
  )
}
