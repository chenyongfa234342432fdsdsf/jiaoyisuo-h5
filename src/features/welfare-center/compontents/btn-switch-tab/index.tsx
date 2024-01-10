import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useBaseWelfareCenter } from '@/store/welfare-center'
import { couponType } from '@/typings/api/welfare-center/all-voucher'
import { t } from '@lingui/macro'
import styles from './index.module.css'

const AllVoucher = '1'
// 可用的优惠劵数量
const CanUsedVoucherNum = 'validNum'
// 不可用的优惠劵数量
const noUsedVoucherNum = 'invalidNum'
export default function BtnSwitchTab({ onSwitchChange, isLoading, isExpiredPage = false }) {
  const [tabList, setTabList] = useState<Partial<couponType>[]>([])
  const {
    voucherCenterData: { voucherCountInfo },
    welfareCenterDictionaryEnum,
  } = useBaseWelfareCenter()
  const [active, setActive] = useState<string>(AllVoucher)
  useEffect(() => {
    const list: Partial<couponType>[] = []
    const allSum =
      voucherCountInfo?.couponTypes?.reduce((prev, cur) => {
        list.push({
          ...cur,
        })
        return prev + cur[isExpiredPage ? noUsedVoucherNum : CanUsedVoucherNum]
      }, 0) || 0
    list.unshift({
      validNum: allSum || 0,
      couponType: AllVoucher,
      invalidNum: allSum,
    })
    setTabList(list)
  }, [voucherCountInfo])

  return (
    <div className={classNames(styles['tab-switch'])}>
      {tabList?.map((item, index) => {
        return (
          <span
            key={index}
            className={classNames('tab-item', {
              active: active === item.couponType,
            })}
            onClick={() => {
              if (isLoading) {
                return
              }
              setActive(item.couponType || AllVoucher)
              // 选中全部时传参为空
              onSwitchChange(item.couponType === AllVoucher ? '' : item.couponType)
            }}
          >
            {item.couponType === AllVoucher
              ? t`constants_market_market_list_market_module_index_5101071`
              : welfareCenterDictionaryEnum.voucherTypeClassification.enums.find(i => i.value === item.couponType)
                  ?.label}
            {`(${isExpiredPage ? item.invalidNum : item.validNum})`}
          </span>
        )
      })}
    </div>
  )
}
