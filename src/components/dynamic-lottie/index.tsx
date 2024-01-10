import { oss_domain_address_with_business, getIsNotMonkeyManyMerchantMode } from '@/constants/oss'
import { getThemeSuffix } from '@/helper/common'
import axios from 'axios'
import { useCommonStore } from '@/store/common'
import Lottie, { LottieComponentProps } from 'lottie-react'
import { useEffect, useState } from 'react'

const jsonCache: Record<string, any> = {}

function DynamicLottie({
  animationData,
  onAnimationDataLoaded,
  hasTheme,
  whetherManyBusiness,
  ...rest
}: Exclude<LottieComponentProps, 'animationData'> & {
  animationData:
    | (() => Promise<{
        default: any
      }>)
    | string
  onAnimationDataLoaded?: (data: any) => void
  hasTheme?: boolean
  // 是否是多商户模式图片
  whetherManyBusiness?: boolean
}) {
  const [data, setData] = useState<any>(null)

  const { businessId } = useCommonStore()

  useEffect(() => {
    const getData =
      typeof animationData === 'function'
        ? animationData
        : async () => {
            let url = `${oss_domain_address_with_business}/json/${animationData}${
              hasTheme ? getThemeSuffix() : ''
            }.json`
            if (whetherManyBusiness && getIsNotMonkeyManyMerchantMode()) {
              url = url.replace('/h5/json/', `/h5/business/${businessId}/business-json/`)
            }

            if (jsonCache[url]) {
              return {
                default: jsonCache[url],
              }
            }
            const res = await axios.get(url)
            jsonCache[url] = res.data
            return {
              default: res.data,
            }
          }
    getData().then(res => {
      onAnimationDataLoaded && onAnimationDataLoaded(res.default)
      setData(res.default)
    })
  }, [animationData])

  return <>{data && <Lottie animationData={data} {...rest} />}</>
}

export default DynamicLottie
