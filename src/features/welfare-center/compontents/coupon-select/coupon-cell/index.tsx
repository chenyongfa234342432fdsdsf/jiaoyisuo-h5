/**
 * 我的卡券 - 卡券 cell
 */
import { oss_svg_image_domain_address } from '@/constants/oss'
import LazyImage from '@/components/lazy-image'
import classNames from 'classnames'
import Icon from '@/components/icon'
import {
  ApiWelfareType,
  DictionaryTypeMap,
  TaskTypeCode,
  booleanStatusEnum,
  useDiscountRuleEnum,
} from '@/constants/welfare-center/common'
import { IVipCoupon } from '@/typings/api/welfare-center/all-voucher'
import { getTextFromStoreEnums } from '@/helper/store'
import { useBaseWelfareCenter } from '@/store/welfare-center'
import { formatDate } from '@/helper/date'
import { dateFormatEnum } from '@/constants/dateFomat'
import { decimalUtils } from '@nbit/utils'
import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { YapiGetV1OpenapiComCodeGetCodeDetailListData } from '@/typings/yapi/OpenapiComCodeGetCodeDetailListV1GetApi'
import { getCodeDetailList } from '@/apis/common'
import UseConditions from '../../use-conditions'
import styles from './index.module.css'

interface ICouponCellProps {
  /** 卡券信息 */
  data: IVipCoupon
  /** 是否可用卡券 */
  isAvailable?: boolean
  /** 是否可选择 */
  isSelect?: boolean
  /** 选择卡券 */
  onSelect?: (data: any) => void
}

function CouponCell({ data, isSelect, isAvailable = true, onSelect }: ICouponCellProps) {
  const {
    useDiscountRule,
    coinSymbol,
    couponValue,
    useDiscountRuleRate,
    couponCode,
    useRuleStatus,
    useThreshold,
    invalidByTime,
    activityName,
    couponType,
    businessScene,
    welfareType,
    missionType,
  } = data || {}
  const { welfareCenterDictionaryEnum } = useBaseWelfareCenter() || {}

  const icon = {
    select: 'login_verify_selected',
    unselect: 'login_verify_unselected',
    disable: 'login_verify_unselected_disabied',
  }

  const getCardBgUrl = () => {
    if (!isAvailable) {
      return `${oss_svg_image_domain_address}vip_welfare_card_expired.png`
    }
    return `${oss_svg_image_domain_address}vip_welfare_card.png`
  }

  const getIconName = () => {
    if (isSelect) {
      return icon.select
    } else if (!isAvailable) {
      return icon.disable
    } else {
      return icon.unselect
    }
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
    <div
      className={styles['coupon-cell-root']}
      onClick={e => {
        e.stopPropagation()

        if (!isAvailable) return

        onSelect && onSelect(data)
      }}
    >
      <LazyImage src={getCardBgUrl()} width={12} height={143} />
      <div
        className={classNames('coupon-info-wrap', {
          active: isSelect,
          invalid: !isAvailable,
        })}
      >
        <div className="coupon-info">
          <div
            className={classNames('icon-bg', {
              invalid: !isAvailable,
            })}
          >
            <Icon
              name={`icon_welfare_coupon_${DictionaryTypeMap[couponCode]}${!isAvailable ? '_grey' : '_yellow'}`}
              hasTheme={!isAvailable}
              className="coupon-icon"
            />
          </div>

          <div className="coupon-wrap">
            <div
              className={classNames('coupon-amount', {
                '!text-text_color_04': !isAvailable,
              })}
            >
              {useDiscountRule === useDiscountRuleEnum.direct
                ? `${couponValue} ${coinSymbol}`
                : `${useDiscountRuleRate}% ${t`features_vip_level_fundting_spot_index_nq3da7schz`}`}
            </div>
            {useRuleStatus === booleanStatusEnum.true && (
              <div
                className={classNames('coupon-desc', {
                  '!text-text_color_04': !isAvailable,
                })}
              >
                <UseConditions
                  couponType={couponType}
                  businessScene={businessScene}
                  useThreshold={useThreshold}
                  coinSymbol={coinSymbol}
                />
              </div>
            )}
            <div
              className={classNames('coupon-desc', {
                '!text-text_color_01': isAvailable,
                '!text-text_color_04': !isAvailable,
              })}
            >
              {getTextFromStoreEnums(couponCode, welfareCenterDictionaryEnum?.voucherName?.enums)}
            </div>
          </div>

          <Icon name={getIconName()} hasTheme={!isSelect} className="select-icon" />
        </div>
        <div
          className={classNames('coupon-bottom', {
            '!text-text_color_04': !isAvailable,
          })}
        >
          <div>
            {t`features_welfare_center_compontents_card_item_index_xe_jgaj7ln`}
            {formatDate(invalidByTime, dateFormatEnum.date)}
          </div>
          {activityName && (
            <div
              className={classNames('event-name', {
                '!bg-card_bg_color_02': !isAvailable,
              })}
            >
              {welfareType === ApiWelfareType.activity || welfareType === ApiWelfareType.manual
                ? activityName
                : missionType === TaskTypeCode.challenge
                ? condition?.filter(_item => {
                    return _item.codeVal === activityName
                  })?.[0]?.codeKey
                : missionCondition?.filter(_item => {
                    return _item.codeVal === activityName
                  })?.[0]?.codeKey}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { CouponCell }
