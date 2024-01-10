import NavBar from '@/components/navbar'
import { Sticky, Button } from '@nbit/vant'
import classNames from 'classnames'
import { useState, useRef, useEffect } from 'react'
import Icon from '@/components/icon'
import { requestWithLoading } from '@/helper/order'
import { useMount, useUpdateEffect } from 'ahooks'
import { useBaseWelfareCenter } from '@/store/welfare-center'
import { getCouponList } from '@/apis/welfare-center/all-voucher'
import { GetCouponListResponse } from '@/typings/api/welfare-center/all-voucher'
import { getTypeSceneList, getUsedInfo } from '@/apis/welfare-center/expired'
import { getPeriodDayTime } from '@/helper/date'
import { GetTypeSceneListResponse } from '@/typings/api/welfare-center/expired'
import { ScenesBeUsedEnum, couponStatusEnum } from '@/constants/welfare-center/common'
import { getTradeDetailPage, getFuturesDetailPage } from '@/helper/route/welfare-center'
import { link } from '@/helper/link'
import { t } from '@lingui/macro'
import { YapiGetV1OpenapiComCodeGetCodeDetailListData } from '@/typings/yapi/OpenapiComCodeGetCodeDetailListV1GetApi'
import { getCodeDetailList } from '@/apis/common'
import styles from './index.module.css'
import BtnSwitchTab from '../compontents/btn-switch-tab'
import BottomSelectPop from '../compontents/bottom-select-pop'
import FilterPop from '../compontents/filter-pop'
import CardItem from '../compontents/card-item'
import { UsedDetailPop } from '../compontents/used-detail-pop'
import RefreshList from '../compontents/refresh-list'
import { useListLoad } from '../hooks/use-list-load'

type filterOptionsItemType = {
  // 名称
  name: string
  // 值
  value: string
}
type filterOptionsType = {
  // 类型
  type: filterOptionsItemType[]
  // 状态
  state: filterOptionsItemType[]
}
/** 选择全部 */
const All = 'all'
export default function ExpiredCard() {
  const defaultFilterData = {
    type: All,
    state: All,
    startDatetime: '',
    endDatetime: '',
  }
  const [filterData, setFilterData] = useState(defaultFilterData)
  const { fetchWelfareCenterDictionaryEnums, fetchCouponCount, welfareCenterDictionaryEnum } = useBaseWelfareCenter()
  const typeListData = useRef<GetTypeSceneListResponse[]>([])
  const allTypeItem = { name: t`constants_market_market_list_market_module_index_5101071`, value: All }
  const [filterOptions, setFilterOptions] = useState<filterOptionsType>({
    type: [],
    state: [
      { name: t`constants_market_market_list_market_module_index_5101071`, value: All },
      { name: t`features_welfare_center_expire_card_page_index_dg84d_nblz`, value: String(couponStatusEnum.hasUsed) },
      { name: t`modules_future_stop_profitloss_index_page_5101510`, value: String(couponStatusEnum.expired) },
    ],
  })
  const [selectType, setSelectType] = useState<string>('')
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [isShowSeeUsePop, setIsShowSeeUsePop] = useState(false)
  const [usedDetailData, setUsedDetailData] = useState({
    cardData: {},
    orderData: {},
  } as any)
  const { isShow, finished, isLoading, onLoad, onRefresh, cardListData } = useListLoad({
    paramsData: {
      couponCode: filterData.type === All ? '' : filterData.type,
      couponStatus: filterData.state === All ? 0 : filterData.state,
      startDatetime: filterData.startDatetime,
      endDatetime: filterData.endDatetime,
    },
    loadRequest: getCouponList,
  })
  const getPageData = async () => {
    await fetchWelfareCenterDictionaryEnums()
    await fetchCouponCount()
    const typeData = await getTypeSceneList({})
    typeListData.current = typeData.data || []
    // 设置全部的类型
    const allTypeList = typeListData.current.reduce<GetTypeSceneListResponse[]>((prev, cur) => {
      return [...prev, ...(cur.list || [])]
    }, [] as GetTypeSceneListResponse[])
    setFilterOptions(pre => {
      return {
        ...pre,
        type: [allTypeItem, ...allTypeList],
      } as filterOptionsType
    })
  }
  const typeSelectedClick = val => {
    setFilterData(pre => {
      return {
        ...pre,
        [selectType]: val.value,
      }
    })
    setSelectType('')
  }
  const getOptionData = () => {
    const options = filterOptions[selectType]?.map(i => {
      return {
        ...i,
        name: welfareCenterDictionaryEnum.voucherName.enums.find(item => item.value === i.subCodeVal)?.label || i.name,
        value: i.subCodeVal || i.value,
      }
    })
    return options
  }
  useMount(() => {
    requestWithLoading(getPageData(), 0)
  })
  const couponType = useRef('')
  const onSwitchChange = val => {
    couponType.current = val

    // 属于全部
    if (!val) {
      const allTypeList = typeListData.current?.reduce<GetTypeSceneListResponse[]>((prev, cur) => {
        return [...prev, ...(cur.list || [])]
      }, [])
      setFilterOptions(pre => {
        return {
          ...pre,
          type: [allTypeItem, ...allTypeList],
        } as filterOptionsType
      })
    } else {
      // 设置对应的类型
      setFilterOptions(pre => {
        return {
          ...pre,
          type: [allTypeItem, ...(typeListData.current?.find(i => i?.codeVal === val)?.list || [])],
        } as filterOptionsType
      })
    }
    // 进行类型和状态的重置
    setFilterData(defaultFilterData)
  }
  /** 刷新 */
  const onRefreshPage = () => {
    onRefresh({
      couponType: couponType.current,
      couponCode: filterData.type === All ? '' : filterData.type,
      couponStatus: filterData.state === All ? 0 : filterData.state,
    })
  }
  /** 筛选数据修改重新请求 */
  useUpdateEffect(() => {
    onRefreshPage()
  }, [filterData])

  const filterConfirm = dateVal => {
    setFilterData(prev => {
      return {
        ...prev,
        startDatetime: dateVal.start,
        endDatetime: dateVal.end,
      }
    })
    setIsShowFilter(false)
  }
  // 查看使用情况数据
  const seeUseData = async cardData => {
    getUsedInfo({
      id: cardData.id,
    }).then(res => {
      if (res.isOk && res.data) {
        setIsShowSeeUsePop(true)
        setUsedDetailData({
          cardData,
          orderData: res.data,
        })
      }
    })
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
    <div className={classNames(styles['expired-page'])}>
      <Sticky>
        <div className="top-content">
          <NavBar title={t`features_welfare_center_all_voucher_index_e5ijjsiemo`} />
          <div className="tab-box">
            <BtnSwitchTab isLoading={isLoading} onSwitchChange={onSwitchChange} isExpiredPage />
          </div>
          <div className="filter">
            <div className="select-group">
              <span className="select" onClick={() => setSelectType('type')}>
                {t`features_assets_futures_futures_history_futures_history_content_5101420`}
                {welfareCenterDictionaryEnum?.voucherName?.enums.find(i => i.value === filterData.type)?.label ||
                  t`constants_market_market_list_market_module_index_5101071`}
                <Icon className="select-icon" name="property_icon_drop_down1" />
              </span>
              <span className="select" onClick={() => setSelectType('state')}>
                {t`features_welfare_center_expire_card_page_index_jt666cv5iy`}
                {filterOptions?.state?.find(i => i.value === filterData.state)?.name}
                <Icon className="select-icon" name="property_icon_drop_down1" />
              </span>
            </div>
            <Icon className="filter-icon" hasTheme name="asset_record_filter" onClick={() => setIsShowFilter(true)} />
          </div>
        </div>
      </Sticky>
      <div className="list">
        <RefreshList
          listItem={item => {
            return (
              <CardItem
                condition={condition}
                missionCondition={missionCondition}
                key={item?.id}
                cardData={item}
                type="expire"
                btnSlot={
                  // 当已经使用后查看使用情况
                  Number(item.status) === couponStatusEnum.hasUsed ? (
                    <Button onClick={() => seeUseData(item)} className={classNames('btn')} type="primary">
                      {t`features_welfare_center_expire_card_page_index_0zosj0umid`}
                    </Button>
                  ) : null
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
        <div className="bottom-tip">
          {t`features_welfare_center_expire_card_page_index_3ya_2gkx3m`} 90{' '}
          {t`features_welfare_center_expire_card_page_index_cxjvv3rn2d`}
        </div>
      </div>
      {isShowFilter && (
        <FilterPop
          filterConfirm={filterConfirm}
          dateData={{
            start: filterData.startDatetime || getPeriodDayTime(7).start,
            end: filterData.endDatetime || getPeriodDayTime(7).end,
          }}
          cancelClick={() => setIsShowFilter(false)}
          visable={isShowFilter}
        />
      )}
      {/* 查看使用情况弹窗 */}
      <UsedDetailPop
        onClickOverlay={() => setIsShowSeeUsePop(false)}
        welfareCenterDictionaryEnum={welfareCenterDictionaryEnum}
        usedDetailData={usedDetailData}
        isShowSeeUsePop={isShowSeeUsePop}
        cancelClick={() => setIsShowSeeUsePop(false)}
      />
      <BottomSelectPop
        selectValue={filterData[selectType]}
        selectClick={val => typeSelectedClick(val)}
        close={() => setSelectType('')}
        isShow={!!selectType}
        optionsData={getOptionData()}
      />
    </div>
  )
}
