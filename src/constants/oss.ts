import { businessIsChainStar } from '@/helper/env'
import { baseCommonStore } from '@/store/common'
import { envUtils, fastUrlUtils } from '@nbit/utils'

const { getFastUrl } = fastUrlUtils
const domain = getFastUrl('https://markcoin.oss-ap-southeast-1.aliyuncs.com')

export const monkeyOssConfig = {
  folder: 'h5',
  iconfontJs: 'iconfont_2023_1119.js',
}

export const chainStarOssConfig = {
  folder: 'newbit-chainstar/h5',
  iconfontJs: 'iconfont_h5_chainstar_1219_604.js',
}

export const fusionOssConfig = {
  folder: 'newbit-fusion/h5',
  iconfontJs: 'iconfont_2023_09_20_16_15.js',
  absoluteIconfontJs: '',
}

fusionOssConfig.absoluteIconfontJs = `${domain}/${fusionOssConfig.folder}/icon/${fusionOssConfig.iconfontJs}`

export function getOssConfig() {
  // 图片方面暂不开启融合模式
  const enableFusionMode = false
  const { isFusionMode } = baseCommonStore.getState()

  if (isFusionMode && enableFusionMode) {
    return fusionOssConfig
  } else if (businessIsChainStar) {
    return chainStarOssConfig
  } else {
    return monkeyOssConfig
  }

  // return isFusionMode && enableFusionMode ? fusionOssConfig : businessIsChainStar ? chainStarOssConfig : monkeyOssConfig
}

const { folder, iconfontJs } = getOssConfig()

// 判断是否是 monkey 多商户模式
export const getIsNotMonkeyManyMerchantMode = () => {
  const { isFusionMode } = baseCommonStore.getState()
  // 非融合模式、采用 chainstar 的 oss 配置
  return !isFusionMode && businessIsChainStar
}

export const oss_domain = domain

/** h5 OSS 地址 */
export const oss_domain_address = `${domain}/h5`
/** h5 带商户的 OSS 地址 */
export const oss_domain_address_with_business = `${domain}/${folder}`

/** h5 OSS 渐变色 svg 地址 */
export const oss_svg_image_domain_address = `${oss_domain_address_with_business}/image/`

/** h5 OSS 非渐变色 svg 地址 */
export const oss_svg_domain_address = `${oss_domain_address_with_business}/icon/${iconfontJs}`

/** 国家国旗图片 png 地址 */
export const oss_area_code_image_domain_address = `${domain}/area_code_img/`

/** OSS H5 图片下的模块名称 */
export enum OssImgFolderNameEnums {
  'agent' = 'agent',
}
