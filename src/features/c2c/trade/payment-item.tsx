import { C2cTradeAdPaymentEnum } from '@/constants/c2c/trade'
import { IC2cPayment } from '@/typings/api/c2c/trade'
import classNames from 'classnames'
import { getTextFromStoreEnums } from '@/helper/store'
import { useBaseC2cOrderStore } from '@/store/c2c/order'
import styles from './common.module.css'

type IPaymentItemProps = {
  payment: IC2cPayment
  className?: string
}
export function PaymentItemColor({ payment }: IPaymentItemProps) {
  const colorMap = {
    [C2cTradeAdPaymentEnum.alipay]: '#6195F6',
    [C2cTradeAdPaymentEnum.wechat]: '#50B16C',
    [C2cTradeAdPaymentEnum.bank]: '#F1AE3D',
  }
  const { orderEnums } = useBaseC2cOrderStore()
  const color =
    getTextFromStoreEnums(payment.type, orderEnums.paymentsColor.enums) ||
    colorMap[payment.type] ||
    colorMap[C2cTradeAdPaymentEnum.alipay]
  return (
    <div
      className={styles['ad-payment-item-line']}
      style={{
        backgroundColor: color,
      }}
    ></div>
  )
}

export function PaymentItem({ payment, className = 'text-xs' }: IPaymentItemProps) {
  return (
    <div className={classNames(styles['ad-payment-item'], className)} key={payment.type}>
      <PaymentItemColor payment={payment} />
      <div className="name">{payment.name}</div>
    </div>
  )
}
