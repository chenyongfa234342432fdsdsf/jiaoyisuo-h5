/** 卡劵中心 */
import NavBar from '@/components/navbar'
import classNames from 'classnames'
import { Tabs } from '@nbit/vant'
import React, { useState } from 'react'
import Icon from '@/components/icon'
import LazyImage from '@/components/lazy-image'
import { useBaseWelfareCenter } from '@/store/welfare-center'
import { useMount } from 'ahooks'
import { requestWithLoading } from '@/helper/order'
import {
  CardActiveEnum,
  WelfareType,
  oss_svg_image_domain_address_welfare_center,
  ruleHomeColumnCd,
} from '@/constants/welfare-center/common'
import { t } from '@lingui/macro'

import { link } from '@/helper/link'
import { useLayoutStore } from '@/store/layout'
import styles from './index.module.css'
import VoucherTipPop from './compontents/voucher-tip-pop'
import AllVoucher from './all-voucher'
import ExchangeCenter from './exchange-center'
import MyTask from './my-task'
import MyActivity from './my-activity'

export default function WelfareCenter() {
  const [cardActive, setCardActive] = useState(CardActiveEnum.allVoucher)
  const [tipVisible, setTipVisible] = useState(false)
  const { fetchWelfareCenterDictionaryEnums, fetchCouponCount, voucherCenterData, setHasNew } = useBaseWelfareCenter()
  const getPageData = async () => {
    await fetchWelfareCenterDictionaryEnums()
    await fetchCouponCount()
  }
  useMount(() => {
    requestWithLoading(getPageData(), 0)
  })

  const [currentTab, setCurrentTab] = useState<string>(WelfareType.award)

  const tabList = [
    {
      title: t`features_welfare_center_index_4pd4ciertl`,
      content: (
        <>
          <div className="line"></div>
          <div className="card-switch">
            <span
              className={classNames('btn', {
                'active': cardActive === CardActiveEnum.allVoucher,
                'has-new': voucherCenterData.hasNew,
              })}
              onClick={() => {
                setHasNew(false)
                setCardActive(1)
              }}
            >
              {t`features_welfare_center_index_pe9tmgi1oe`}({voucherCenterData.voucherCountInfo?.validNum || 0})
            </span>
            <span
              className={classNames('btn', {
                'active': cardActive === CardActiveEnum.exchange,
                'has-new': voucherCenterData.voucherCountInfo?.activityCouponNum,
              })}
              onClick={() => setCardActive(2)}
            >
              {t`features_welfare_center_index_zt3vddlm55`}({voucherCenterData.voucherCountInfo?.activityCouponNum || 0}
              )
            </span>
            {/* <span className="voucher-direction">
            {t`features_welfare_center_compontents_voucher_tip_pop_index_o5v8debqst`}
            <Icon className="tip-icon" name="property_icon_tips" onClick={() => setTipVisible(true)} />
          </span> */}
          </div>
          <div className="content">
            {cardActive === CardActiveEnum.allVoucher ? <AllVoucher /> : <ExchangeCenter />}
          </div>

          {/* 卡劵使用说明 */}
          <VoucherTipPop tipVisible={tipVisible} closeClick={() => setTipVisible(false)} />
        </>
      ),
      id: WelfareType.award,
    },
    {
      title: t`features_welfare_center_index_f45dt7xyt8`,
      content: <MyTask />,
      id: WelfareType.task,
    },

    {
      title: t`features_welfare_center_index_9bb4p233sm`,
      content: <MyActivity />,
      id: WelfareType.activity,
    },
  ]

  /** tab 切换 */
  const onTabChange = name => {
    setCurrentTab(name)
  }
  const layoutProps = useLayoutStore()
  const columnsDataByCd = layoutProps?.columnsDataByCd

  let cardUrl = ''

  if (columnsDataByCd) {
    cardUrl = columnsDataByCd[ruleHomeColumnCd.mission_center]?.h5Url || ''
  }

  return (
    <div className={classNames(styles['welfare-center'])}>
      <NavBar title={t`features_welfare_center_index_bi_wfzlnl6`} />
      <div className="banner">
        <h3 className="banner-title">
          {t`features_welfare_center_index_kgz871cedd`}
          {t`features_welfare_center_index_xg3uzmwxz0`}
          {t`features_welfare_center_index_zlx5xryd_s`}
        </h3>
        <div
          onClick={() => {
            link(cardUrl)
          }}
          className={classNames(
            'absolute top-[50px] left-[16px] h-[26px] px-2 py-1 flex items-center common-12-content text-text_color_02 bg-card_bg_color_02 rounded-[14px] z-[1]'
          )}
        >
          {/* 福利中心规则说明 */}
          {t`features_welfare_center_compontents_voucher_tip_pop_index_o5v8debqst`}
          <Icon name="property_icon_next" className="text-xs text-text_color_03 !mt-0 ml-1" />
        </div>

        <LazyImage
          hasTheme
          className="banner-bg"
          src={`${oss_svg_image_domain_address_welfare_center}vip_welfare_top_banner_bg.png
`}
        />
      </div>
      <div className="tab-switch">
        <Tabs align="start" className="tab" active={currentTab} onChange={onTabChange}>
          {tabList?.map(item => {
            return (
              <Tabs.TabPane key={item.id} title={item.title} name={item.id}>
                <div>{item.content}</div>
              </Tabs.TabPane>
            )
          })}
        </Tabs>
      </div>
    </div>
  )
}
