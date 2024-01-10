import type { MarkcoinRequestConfig } from '@/plugins/request'

type IHeaders = {
  // 目前是永久 token，无需刷新
  refreshToken?: string
  accessToken: string
  businessId: string
  accessKey: string
}
export type ICreateRequestTargetInterceptorParams = {
  baseURL: string
  /** 合适启用此中间件 */
  getEnabled: (config: MarkcoinRequestConfig) => boolean | Promise<boolean>
  /** 获取请求头，特定于改变请求地址，所以限定了返回请求头的内容 */
  getHeaders: (config: MarkcoinRequestConfig) => IHeaders | Promise<IHeaders>
  whenAuthError?: () => void
}

/**
 * 创建一个新的请求目标过滤器，采用新的接口地址、部分请求头、和新的 token 刷新机制
 * 应当放在最后启用
 */
export function createRequestTargetInterceptor({
  baseURL,
  getEnabled,
  getHeaders,
  whenAuthError,
}: ICreateRequestTargetInterceptorParams) {
  return async (config: MarkcoinRequestConfig) => {
    if (!(await getEnabled(config))) {
      return config
    }
    const { accessToken, businessId, accessKey } = await getHeaders(config)
    config.headers = {
      ...config.headers,
      'nb-business-id': businessId,
      'nb-access-key': accessKey,
      'Authorization': accessToken,
    }
    config.baseURL = baseURL
    if (whenAuthError) {
      config.whenAuthError = whenAuthError
    }

    return config
  }
}
