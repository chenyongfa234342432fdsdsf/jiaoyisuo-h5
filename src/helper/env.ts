import { envUtils } from '@nbit/utils'

const { EnvTypesEnum, getEnvAwsS3Config } = envUtils

/** 获取是否是 NodeJs 服务器环境 */
export const envIsServer = import.meta.env.SSR
/** 获取是否是客户端环境 */
export const envIsClient = !envIsServer
/** 是否是开发环境 */
export const envIsDev = import.meta.env.VITE_NEWBIT_ENV === EnvTypesEnum.development
/** 是否是 sg dev 环境 */
export const envIsSGDev = import.meta.env.VITE_NEWBIT_ENV === EnvTypesEnum.dev
/** 是否是生产环境 */
export const envIsProd = import.meta.env.VITE_NEWBIT_ENV === EnvTypesEnum.production

export const envIsBuild = !envIsDev

export const baseUrl = envIsClient
  ? import.meta.env.VITE_MARKCOIN_BASE_URL
  : import.meta.env.VITE_MARKCOIN_SERVER_BASE_URL

export const wsUrl = import.meta.env.VITE_MARKCOIN_WS

export const port = import.meta.env.VITE_PORT
// 合约 ws
export const wsFuturesUrl = import.meta.env.VITE_MARKCOIN_WS_CONTRACT
// 期权 ws
export const wsOptionUrl = import.meta.env.VITE_MARKCOIN_WS_OPTION || wsFuturesUrl

// 现货 ws
export const wsCoinUrl = import.meta.env.VITE_MARKCOIN_WS
// c2c ws，仅公有模式下启用
export const wsC2cUrl: string | undefined = import.meta.env.VITE_MARKCOIN_C2C_WS

// git  最近的 id
export const gitCommitId = import.meta.env.VITE_GIT_COMMIT_ID

export const businessId = import.meta.env.VITE_MARKCOIN_BUSINESS_ID
// 是否是 chain star 商户，单独配色
export const businessIsChainStar = businessId !== '1'
export const H5Url = import.meta.env.VITE_MARKCOIN_H5_URL
export const WebUrl = import.meta.env.VITE_MARKCOIN_WEB_URL
/** AWS S3 config */
export const awsS3Config = getEnvAwsS3Config(import.meta.env.VITE_NEWBIT_ENV)
export const newbitEnv = import.meta.env.VITE_NEWBIT_ENV
export const modalDynamicRouter = import.meta.env.VITE_MARKCOIN_MODAL_DYNAMIC
export const templateId = import.meta.env.VITE_MARKCOIN_TEMPLATE_ID

export const c2cBusinessId = import.meta.env.VITE_MARKCOIN_C2C_BUSINESS_ID
export const c2cMode = import.meta.env.VITE_MARKCOIN_C2C_MODE
export const c2cBaseUrl = import.meta.env.VITE_MARKCOIN_C2C_BASE_URL
export const saasId = import.meta.env.VITE_MARKCOIN_SAAS
