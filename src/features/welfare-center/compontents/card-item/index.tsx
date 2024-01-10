import LazyImage from '@/components/lazy-image'
import classNames from 'classnames'
import Icon from '@/components/icon'
import { formatDate, getDayMs } from '@/helper/date'
import { useCommonStore } from '@/store/common'
import { ReactNode, useEffect, useState } from 'react'
import { useBaseWelfareCenter } from '@/store/welfare-center'
import {
  DictionaryTypeMap,
  useDiscountRuleEnum,
  oss_svg_image_domain_address_welfare_center,
  couponStatusEnum,
  booleanStatusEnum,
  ApiWelfareType,
  TaskTypeCode,
} from '@/constants/welfare-center/common'
import { t } from '@lingui/macro'
import { getTextFromStoreEnums } from '@/helper/store'
import { I18nsEnumAll } from '@/constants/i18n'
import { getCodeDetailList } from '@/apis/common'
import { YapiGetV1OpenapiComCodeGetCodeDetailListData } from '@/typings/yapi/OpenapiComCodeGetCodeDetailListV1GetApi'
import UseConditions from '../use-conditions'
import styles from './index.module.css'
//  过期/新获得的显示最小时间 当前时间一天内
const defaultCardIcon = 'voucher'
const NORMAL = 'normal'
const EXPIRE = 'expire'
type cardItemProps = {
  missionCondition: Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>
  condition: Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>
  cardData: any
  /** 底部插槽 */
  footerSlot?: ReactNode
  /** 右部插槽 */
  btnSlot?: ReactNode
  /** 卡劵类型普通类型 过期类型 */
  type?: 'normal' | 'expire'
  /** 是否显示卡劵过期和 new 标识 */
  showMark?: boolean
}

export default function CardItem({
  missionCondition,
  condition,
  cardData,
  footerSlot,
  btnSlot,
  type = 'normal',
  showMark = true,
}: cardItemProps) {
  const { welfareCenterDictionaryEnum } = useBaseWelfareCenter()
  // 是否过期/已使用卡片
  const getIsExpiredCard = status => {
    // 使用黄色正常卡片显示
    if (type === NORMAL) {
      return false
    }
    // 显示过期/使用灰色卡片显示
    if (type === EXPIRE) {
      return true
    }
  }
  // 获取卡片左边背景图地址
  const getCardBgUrl = () => {
    if (getIsExpiredCard(cardData?.status)) {
      return `${oss_svg_image_domain_address_welfare_center}vip_welfare_card_expired.png`
    }
    return `${oss_svg_image_domain_address_welfare_center}vip_welfare_card.png`
  }
  const { locale } = useCommonStore()
  // 已过期/被使用对应的图片映射
  const TagImgMap = {
    isExpired: `${oss_svg_image_domain_address_welfare_center}vip_welfare_is_expired_${
      locale === I18nsEnumAll['zh-CN']
        ? I18nsEnumAll['zh-CN']
        : locale === I18nsEnumAll['zh-HK']
        ? I18nsEnumAll['zh-HK']
        : 'en-US'
    }.png`,
    isUsed: `${oss_svg_image_domain_address_welfare_center}vip_welfare_used_${
      locale === I18nsEnumAll['zh-CN']
        ? I18nsEnumAll['zh-CN']
        : locale === I18nsEnumAll['zh-HK']
        ? I18nsEnumAll['zh-HK']
        : 'en-US'
    }.png`,
  }
  // 是否在一天时间内
  const isInOneDay = time => {
    return Math.abs(time - new Date().getTime()) <= getDayMs(1)
  }
  // 显示卡劵标识
  const showCardMark = () => {
    /* 是否显示新的标签 领取时间一天内/是否展示过期标签 过期时间一天内 优先显示过期标签 */
    return (
      !getIsExpiredCard(cardData.status) &&
      showMark &&
      (isInOneDay(cardData.invalidByTime) ? (
        <span className="expired">{t`features_welfare_center_compontents_card_item_index_6kzog1tslc`}</span>
      ) : isInOneDay(cardData.assignByTime) ? (
        <span className="new">{t`features_welfare_center_compontents_card_item_index_r5u3nsdmqr`}</span>
      ) : null)
    )
  }

  return (
    <div className={classNames(styles['voucher-card'])}>
      <LazyImage hasTheme={getIsExpiredCard(cardData.status)} className="card-bg" src={getCardBgUrl()} />
      <div className={classNames('card-content')}>
        {/* 卡劵标识渲染 */}
        {showCardMark()}
        {/* 已失效 */}
        {cardData.status === couponStatusEnum.expired && type === EXPIRE && (
          <LazyImage className="tag-box" src={TagImgMap.isExpired} />
        )}
        {/* 已使用 */}
        {cardData.status === couponStatusEnum.hasUsed && type === EXPIRE && (
          <LazyImage className="tag-box" src={TagImgMap.isUsed} />
        )}
        {/* 卡片主体上部分内容显示 */}
        <div className="card-upper-part">
          <div className="left-content">
            <div
              className={classNames('card-icon', {
                invalid: getIsExpiredCard(cardData.status),
              })}
            >
              <Icon
                className="icon"
                hasTheme={getIsExpiredCard(cardData.status)}
                name={`icon_welfare_coupon_${DictionaryTypeMap[cardData.couponCode] || defaultCardIcon}${
                  getIsExpiredCard(cardData.status) ? '_grey' : '_yellow'
                }`}
              />
            </div>
            <div className="rule-content">
              {/*  金额劵/ 比例劵 */}
              {cardData.useDiscountRule === useDiscountRuleEnum.direct ? (
                <div
                  className={classNames('money', 'flex', {
                    invalid: getIsExpiredCard(cardData.status),
                  })}
                >
                  {`${cardData.couponValue}  ${cardData.coinSymbol}`}
                  {cardData?.couponAcquireLimit > 1 ? (
                    <div
                      className="h-[14px] mt-[-4px] bg-sell_down_color text-[10px] leading-[10px] text-button_text_01 font-medium px-1 pt-[2px]"
                      style={{ borderRadius: '4px 4px 4px 0' }}
                    >
                      x{cardData?.couponAcquireLimit}
                      {t`helper_order_future_holding_679`}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div
                  className={classNames('money', 'flex', {
                    invalid: getIsExpiredCard(cardData.status),
                  })}
                >
                  {`${cardData.useDiscountRuleRate}% `}
                  {t`features_vip_level_fundting_spot_index_nq3da7schz`}

                  {cardData?.couponAcquireLimit > 1 ? (
                    <div
                      className="h-[14px] mt-[-4px] bg-sell_down_color text-[10px] leading-[10px] text-button_text_01 font-medium px-1 pt-[2px]"
                      style={{ borderRadius: '4px 4px 4px 0' }}
                    >
                      x{cardData?.couponAcquireLimit}
                      {t`helper_order_future_holding_679`}
                    </div>
                  ) : null}
                </div>
              )}
              {cardData?.useRuleStatus === booleanStatusEnum.true && (
                <div className="use-rule">
                  <UseConditions
                    couponType={cardData.couponType}
                    businessScene={cardData.businessScene}
                    useThreshold={cardData.useThreshold}
                    coinSymbol={cardData.coinSymbol}
                  />
                </div>
              )}
              <p
                className={classNames('use-rule-tip', {
                  // 是否失效
                  invalid: getIsExpiredCard(cardData.status),
                })}
              >
                {/* 卡券名称 */}
                {getTextFromStoreEnums(cardData.couponCode, welfareCenterDictionaryEnum.voucherName.enums)}
              </p>
            </div>
          </div>
          {/* 按钮插槽 */}
          {btnSlot}
        </div>
        <div className="card-lower-part">
          {/*  底部插槽  */}
          {footerSlot || (
            <>
              {cardData.status === couponStatusEnum.hasUsed ? (
                <span className={classNames('expire-time', type)}>
                  {`${t`features_welfare_center_compontents_used_detail_pop_index_t0mlznzath`}：`}
                  {formatDate(cardData.usedByTime, 'YYYY-MM-DD')}
                </span>
              ) : (
                <span className={classNames('expire-time', type)}>
                  {t`features_welfare_center_compontents_card_item_index_xe_jgaj7ln`}
                  {formatDate(cardData.invalidByTime, 'YYYY-MM-DD')}
                </span>
              )}
              <span className={classNames('active-title', type)}>
                {cardData.welfareType === ApiWelfareType.activity || cardData.welfareType === ApiWelfareType.manual
                  ? cardData.activityName
                  : cardData.missionType === TaskTypeCode.challenge
                  ? condition?.filter(_item => {
                      return _item.codeVal === cardData?.activityName
                    })?.[0]?.codeKey
                  : missionCondition?.filter(_item => {
                      return _item.codeVal === cardData?.activityName
                    })?.[0]?.codeKey}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
