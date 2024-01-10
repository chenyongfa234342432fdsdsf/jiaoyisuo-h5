import axios from 'axios'
import { envUtils } from '@nbit/utils'

enum BusinessC2cModeEnum {
  private = 'private',
  public = 'public',
}

const { EnvTypesEnum, S3UrlNameEnum, getEnvS3Url } = envUtils
/**
 * 动态获取不同商户、环境下的 s3 相关地址
 */
export async function getEnvUrlConfig(businessId, mode) {
  const url = getEnvS3Url(mode, businessId, S3UrlNameEnum.dnsConfig)
  return axios
    .get(url)
    .then(res => res.data)
    .catch(e => {
      console.error(e)
      console.error('动态获取不同商户、环境下的 s3 相关地址错误，请检查 businessId 是否正确')
      console.error(`businessId: ${businessId}`)
      console.error(url)
      process.exit(1)
    })
}

export async function getModalDynamic(businessId, mode) {
  const url = getEnvS3Url(mode, businessId, S3UrlNameEnum.moduleAuthConfig)
  return axios
    .get(url)
    .then(res => res.data)
    .catch(e => {
      console.error(e)
      console.error('动态获取不同商户、环境下的 s3 相关地址错误，请检查 businessId 是否正确')
      console.error(`businessId: ${businessId}`)
      console.error(url)
      process.exit(1)
    })
}

/**
 * 更具环境、businessId、接口动态注入环境变量
 */
export async function injectEnvConfig(preConfig, mode, businessId = '1') {
  if (mode === 'multibuild') {
    return
  }
  const envUrlConfig = await getEnvUrlConfig(businessId, mode)
  /** 动态化模块配置* */
  const modalDynamicData = await getModalDynamic(businessId, mode)
  let resConfig: Record<string, string> = {}
  const baseUrl = `${envUrlConfig.API.bff}api/forward/`
  resConfig.VITE_MARKCOIN_BASE_URL = baseUrl
  resConfig.VITE_MARKCOIN_SERVER_BASE_URL =
    mode === EnvTypesEnum.development ? baseUrl : 'http://newbit-bff.core.svc:4100/api/forward/'
  resConfig.VITE_MARKCOIN_WS = envUrlConfig.WS_SPOT.web
  resConfig.VITE_MARKCOIN_WS_CONTRACT = envUrlConfig.WS_CONTRACT.web
  resConfig.VITE_MARKCOIN_WS_OPTION = envUrlConfig.WS_OPTION?.web || envUrlConfig.WS_CONTRACT.web
  resConfig.VITE_MARKCOIN_H5_URL = envUrlConfig.H5.h5
  resConfig.VITE_MARKCOIN_WEB_URL = envUrlConfig.H5.web
  resConfig.VITE_MARKCOIN_SAAS = envUrlConfig?.saas_cd?.web
  resConfig.VITE_MARKCOIN_BUSINESS_ID = `${businessId}`
  resConfig.VITE_MARKCOIN_MODAL_DYNAMIC = JSON.stringify(modalDynamicData)
  resConfig.VITE_MARKCOIN_TEMPLATE_ID = envUrlConfig?.MAINPAGE_TEMPLATE?.h5
  resConfig.VITE_MARKCOIN_C2C_BUSINESS_ID = envUrlConfig?.C2C_BUSINESS_ID?.h5
  resConfig.VITE_MARKCOIN_C2C_MODE = envUrlConfig?.C2C_MODE?.h5
  // 公有 c2c 用不同的 base url 和 ws 地址
  if (resConfig.VITE_MARKCOIN_C2C_MODE === BusinessC2cModeEnum.public) {
    const c2cBusinessUrlConfig = await getEnvUrlConfig(resConfig.VITE_MARKCOIN_C2C_BUSINESS_ID, mode)
    resConfig.VITE_MARKCOIN_C2C_BASE_URL = `${c2cBusinessUrlConfig.API.bff}api/forward/`
    resConfig.VITE_MARKCOIN_C2C_WS = c2cBusinessUrlConfig.WS_SPOT.web
  }
  resConfig = { ...resConfig, ...preConfig }
  Object.keys(resConfig).forEach(k => {
    process.env[k] = resConfig[k]
  })
}
