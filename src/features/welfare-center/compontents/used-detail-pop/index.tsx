import classNames from 'classnames'
import { Popup, Button, Toast } from '@nbit/vant'
import { formatDate } from '@/helper/date'
import { oss_svg_image_domain_address_welfare_center, useDiscountRuleEnum } from '@/constants/welfare-center/common'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import CommonListEmpty from '@/components/common-list/list-empty'
import { useCopyToClipboard } from 'react-use'
import { useCommonStore } from '@/store/common'
import { I18nsEnumAll } from '@/constants/i18n'
import { useEffect, useState } from 'react'
import { YapiGetV1OpenapiComCodeGetCodeDetailListData } from '@/typings/yapi/OpenapiComCodeGetCodeDetailListV1GetApi'
import { getCodeDetailList } from '@/apis/common'
import styles from './index.module.css'
import CardItem from '../card-item'
/** 标识交易账户 */
const ASSET = 'ASSET'
export function UsedDetailPop({
  welfareCenterDictionaryEnum,
  usedDetailData,
  isShowSeeUsePop,
  cancelClick,
  onClickOverlay,
}) {
  const { voucherSceneEnum, voucherBusinessLine, voucherBusinessType } = welfareCenterDictionaryEnum
  const { cardData, orderData } = usedDetailData
  const { locale } = useCommonStore()

  const tradeInfoList = [
    {
      label: t`features_welfare_center_compontents_used_detail_pop_index_fgavlbyz7h`,
      value: (
        <>
          <span>{voucherSceneEnum?.enums?.find(i => i.value === orderData?.businessScene)?.label || '--'}</span>
          <span className="scenes-mark">
            {/* 交易二级场景 */}
            {voucherBusinessLine?.enums?.find(i => i.value === orderData?.businessLine)?.label || '--'}
          </span>
        </>
      ),
    },
    {
      label: t`features_assets_financial_record_record_detail_record_details_info_index_qlxkmuwdvjiibzzhbgurg`,
      value: orderData.accountName !== ASSET ? orderData.accountName || '--' : t`features_trade_future_c2c_22225101593`,
    },
    {
      label: t`features_welfare_center_compontents_used_detail_pop_index_t0mlznzath`,
      value: formatDate(Number(orderData.usedByTime), 'YYYY-MM-DD HH:mm:ss') || '--',
    },
    {
      label: t`features_trade_future_c2c_22222225101605`,
      value: voucherBusinessType?.enums?.find(i => i.value === orderData?.businessType)?.label || '--',
    },
  ]
  const [copyState, copyToClipboard] = useCopyToClipboard()
  const handleCopy = (uid: any) => {
    copyToClipboard(uid)
    copyState.error
      ? Toast({ message: t`user.secret_key_02`, position: 'top' })
      : Toast({ message: t`user.secret_key_01`, position: 'top' })
  }
  /** 获取卡劵使用名称 */
  const getFeeName = () => {
    const nameMap = {
      insurance: t`features_welfare_center_compontents_used_detail_pop_index_a2gkyzsaoh`,
      voucher: t`features_welfare_center_compontents_used_detail_pop_index_qjlts5v_fh`,
    }
    if (nameMap[orderData.couponType]) {
      return nameMap[orderData.couponType]
    }
    return t({
      id: 'features_welfare_center_compontents_used_detail_pop_index_oonwf0abim',
      values: { 0: voucherSceneEnum?.enums?.find(i => i.value === orderData?.businessScene)?.label },
    })
  }
  /** 根据获取订单 label 对应的名称 */
  const getOrderFirstLabel = type => {
    const firstLabelMap = {
      first: {
        insurance: t`features_welfare_center_compontents_used_detail_pop_index_byviog47pl`,
        fee: t`features_assets_financial_record_financial_record_592`,
        voucher: t`features_welfare_center_compontents_used_detail_pop_index_syavn8b9pe`,
      },
      second: {
        insurance: t`features_welfare_center_compontents_used_detail_pop_index_ejpbdfjfii`,
        fee: t`features_welfare_center_compontents_used_detail_pop_index_ejpbdfjfii`,
        voucher: t`features_welfare_center_compontents_used_detail_pop_index_c04_aeuxka`,
      },
      three: {
        insurance: t`features_welfare_center_compontents_used_detail_pop_index_ayode81tis`,
        fee: t`features_welfare_center_compontents_used_detail_pop_index_gfphqmxdc5`,
        voucher: t`features_welfare_center_compontents_used_detail_pop_index_t70p9nyaih`,
      },
    }

    return firstLabelMap[type][orderData.couponType] || '--'
  }
  /** 订单是否完成 */
  const isShowOrderData = orderData.valueFirst && orderData.valueSecond && orderData.valueThird

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
    <Popup
      round
      position="bottom"
      className={classNames(styles['see-use-pop'])}
      title={t`features_welfare_center_compontents_used_detail_pop_index_pvtze_6nax`}
      closeable
      onClickOverlay={onClickOverlay}
      closeIcon={<Icon name="close" hasTheme onClick={cancelClick} />}
      visible={isShowSeeUsePop}
    >
      <div className="px-4">
        <div className="order-number">
          <span>
            {t`features_welfare_center_compontents_used_detail_pop_index_uiomcqgcod`}
            {cardData.id}
          </span>
          <Icon className="copy w-5 h-5" name="property_icon_copy" onClick={() => handleCopy(cardData.id)} />
        </div>
        <CardItem
          condition={condition}
          missionCondition={missionCondition}
          cardData={cardData}
          type="normal"
          showMark={false}
          btnSlot={
            <div
              className="detail-used-mark"
              style={{
                backgroundImage: `url(${oss_svg_image_domain_address_welfare_center}vip_welfare_detail_use.png)`,
              }}
            >
              {/* <span className="mark-text">{t`features_welfare_center_expire_card_page_index_dg84d_nblz`}</span> */}
              <span className="mark-text">
                {locale === I18nsEnumAll['zh-CN'] ? '已使用' : locale === I18nsEnumAll['zh-HK'] ? '已使用' : 'Used'}
              </span>
            </div>
          }
        />

        {/* 交易信息 */}
        <div className="trade-info">
          {tradeInfoList.map((i, index) => {
            return (
              <div className="cell" key={index}>
                <span className="label">{i.label}</span>
                <span className="value">{i.value}</span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="order-data">
        {isShowOrderData ? (
          /* 订单数据 */
          <div className="order-data-show">
            <div>
              <p className="label">{getOrderFirstLabel('first')}</p>
              <p>{`${orderData.valueFirst} ${orderData.valueSymbol}`}</p>
            </div>
            <div>
              <p className="label">{getOrderFirstLabel('second')}</p>
              {/*  金额劵/ 比例劵 */}
              {orderData.useDiscountRule === useDiscountRuleEnum.direct ? (
                <p className={classNames('money', {})}>{`${orderData.valueSecond}  ${orderData.valueSymbol}`}</p>
              ) : (
                <p className={classNames('money', {})}>
                  {`${orderData.valueSecond}% `}
                  {t`features_vip_level_fundting_spot_index_nq3da7schz`}
                </p>
              )}
            </div>
            <div className="three-col">
              <p className="label">{getOrderFirstLabel('three')}</p>
              <p>{`${orderData.valueThird} ${orderData.valueSymbol}`}</p>
            </div>
          </div>
        ) : (
          /* 订单未完层 */
          <CommonListEmpty
            text={t`features_welfare_center_compontents_used_detail_pop_index_ccfgflykfk`}
            className="no-data"
          />
        )}
      </div>

      <div className="btn-group">
        <Button className="confirm" onClick={cancelClick}>
          {t`common.confirm`}
        </Button>
      </div>
    </Popup>
  )
}
