import { useEffect, useRef, useState } from 'react'
import { t } from '@lingui/macro'

import { Search, Swiper, Tabs, Toast } from '@nbit/vant'
import classNames from 'classnames'
import { YapiGetV1MemberVipBaseConfigListVipBenefitsListData } from '@/typings/yapi/MemberVipBaseConfigListV1GetApi'
import { getCodeDetailList } from '@/apis/common'
import { YapiGetV1OpenapiComCodeGetCodeDetailListData } from '@/typings/yapi/OpenapiComCodeGetCodeDetailListV1GetApi'
import { link } from '@/helper/link'
import { ThemeEnum } from '@/constants/base'
import { useCommonStore } from '@/store/common'
import styles from './index.module.css'
import { LEVEL_RATE_CODE, SPECIAL_AVATAR_CODE } from '../../common'

export enum vipLevelFundingType {
  spot = 'spot',
  contract = 'contract',
}

interface PropsType {
  list: YapiGetV1MemberVipBaseConfigListVipBenefitsListData[]
}

function FuncSwiper(props: PropsType) {
  const { list } = props

  const [benefitList, setBenefitList] = useState<YapiGetV1OpenapiComCodeGetCodeDetailListData[]>([])

  useEffect(() => {
    getCodeDetailList({ codeVal: 'benefit_code' }).then(res => {
      if (res.isOk) {
        setBenefitList(res.data as YapiGetV1OpenapiComCodeGetCodeDetailListData[])
      }
    })
  }, [])

  // const _list = list?.length > 4 && list?.length % 2 === 0 ? list.concat([{}] as any) : list

  // useEffect(() => {
  //   if (!list?.length) {
  //     return
  //   }
  //   const listLength = list.length
  //   if (listLength > 4 && listLength % 2 === 0) {
  //     console.log('aaaaaa', document.getElementsByClassName(`swiper-${listLength / 2}`))
  //   }
  // }, [list])

  const commonStore = useCommonStore()

  return (
    <div className={styles.scoped}>
      <div className="demo-swiper">
        <Swiper
          slideSize={(list?.length > 4 && list?.length % 2 === 0) || list?.length === 3 ? 33.33 : 24.99}
          indicator={(total, current) => {
            const arr: Array<number> = []
            for (let i = 0; i < total; i += 1) {
              arr.push(i)
            }

            return (
              <div className="flex justify-center mt-2">
                {arr.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={classNames('h-[2px] ', {
                        'ml-1': index,
                        'w-[10px]': current + 1 === index,
                        'rounded-[3px]': current + 1 === index,
                        'rounded-[2px]': current + 1 !== index,
                        'w-1': current + 1 !== index,
                        'bg-brand_color': current + 1 === index,
                        'bg-bg_button_disabled': current + 1 !== index,
                      })}
                    ></div>
                  )
                })}
              </div>
            )
          }}
        >
          {list.map((item, index) => (
            <Swiper.Item key={item.benefitCode} className={`swiper-${index}`}>
              <div
                className="flex items-center flex-col"
                onClick={() => {
                  if (item.benefitCode === LEVEL_RATE_CODE) {
                    link('/vip/vip-funding')
                  } else if (item.benefitCode === SPECIAL_AVATAR_CODE) {
                    link('/vip/special-avatar')
                  } else {
                    link(`/vip/rights-introduction?benefitCode=${item.benefitCode}`)
                  }
                }}
              >
                <div className="w-[44px] h-[44px] rounded-[44px] bg-card_bg_color_02 flex items-center justify-center">
                  <img
                    className="w-[22px] h-[22px]"
                    src={commonStore.theme === ThemeEnum.light ? item.benefitIcon : (item as any).darkIcon}
                    alt=""
                  ></img>
                </div>

                <div
                  className="mt-2 break-words text-xs leading-[18px] font-normal text-text_color_01 text-center"
                  style={{
                    maxWidth: '100%',
                  }}
                >
                  {benefitList?.filter(_item => {
                    return _item.codeVal === item.benefitCode
                  })?.[0]?.codeKey || ''}
                </div>
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default FuncSwiper
