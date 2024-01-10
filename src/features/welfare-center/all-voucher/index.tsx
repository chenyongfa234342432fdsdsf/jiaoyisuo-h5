import classNames from 'classnames'
import { getCouponList } from '@/apis/welfare-center/all-voucher'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@nbit/vant'
import { link } from '@/helper/link'
import { getExpirePage, getTradePage, getFuturesPage, getTernaryOption } from '@/helper/route/welfare-center'
import { ScenesBeUsedEnum, couponStatusEnum } from '@/constants/welfare-center/common'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { YapiGetV1OpenapiComCodeGetCodeDetailListData } from '@/typings/yapi/OpenapiComCodeGetCodeDetailListV1GetApi'
import { getCodeDetailList } from '@/apis/common'
import BtnSwitchTab from '../compontents/btn-switch-tab'
import styles from './index.module.css'
import CardItem from '../compontents/card-item'
import RefreshList from '../compontents/refresh-list'
import { useListLoad } from '../hooks/use-list-load'

export default function AllVoucher() {
  const couponType = useRef('')
  const { isShow, finished, isLoading, onLoad, onRefresh, cardListData } = useListLoad({
    paramsData: {
      couponStatus: couponStatusEnum.canUsed,
      couponType: couponType.current,
    },
    loadRequest: getCouponList,
  })
  // tab 切换
  const onSwitchChange = val => {
    onRefresh({
      couponType: val,
    })
    couponType.current = val
  }

  const toUse = cardData => {
    // 合约
    if (cardData.businessScene === ScenesBeUsedEnum.perpetual) {
      link(getFuturesPage())
    }
    // 现货
    if (cardData.businessScene === ScenesBeUsedEnum.spot) {
      link(getTradePage())
    }
    // 三元期权
    if (cardData.businessScene === ScenesBeUsedEnum.option) {
      link(getTernaryOption())
    }
  }
  /** 刷新 */
  const onRefreshPage = () => {
    onSwitchChange(couponType.current)
  }

  const [condition, setCondition] = useState<Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>>([])
  const [missionCondition, setMissionCondition] = useState<Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>>([])

  useEffect(() => {
    Promise.all([
      /** 条件 */
      getCodeDetailList({ codeVal: 'welfare_common_condition_scene_options' }),
      getCodeDetailList({ codeVal: 'welfare_achievments_mission_condition_options' }),
    ]).then(([conditionRes, missionConditionRes]) => {
      if (conditionRes.isOk) {
        setCondition(conditionRes.data || [])
      }

      if (missionConditionRes.isOk) {
        setMissionCondition(missionConditionRes.data || [])
      }
    })
  }, [])

  return (
    <div className={classNames(styles['voucher-content'])}>
      <BtnSwitchTab onSwitchChange={onSwitchChange} isLoading={isLoading} />
      <RefreshList
        listItem={item => {
          return (
            <CardItem
              key={item?.id}
              cardData={item}
              condition={condition}
              missionCondition={missionCondition}
              btnSlot={
                <Button onClick={() => toUse(item)} className={classNames('btn')} type="primary">
                  {t`features_welfare_center_all_voucher_index_ncf_datmag`}
                </Button>
              }
            />
          )
        }}
        cardListData={cardListData}
        onRefresh={onRefreshPage}
        onLoad={onLoad}
        finished={finished}
        isShow={isShow}
      />
      <div className="expired-jump" onClick={() => link(getExpirePage(couponType.current))}>
        <div className="flex items-center">
          {t`features_welfare_center_all_voucher_index_e5ijjsiemo`}
          <Icon className="text-[9px] ml-1" name="property_icon_next" />
        </div>
      </div>
    </div>
  )
}
