import { envUtils } from '@nbit/utils'

const { EnvTypesEnum } = envUtils

/**
 * templateId 目前已被写死，因为控制台没有可配置功能。将来应该从 api 中检索
 * @returns templateId for guide page basic info api
 */
export const getGuidePageTemplateId = () => {
  const mode = import.meta.env.VITE_NEWBIT_ENV
  if (mode === EnvTypesEnum.production) {
    return '30001'
  }
  if (mode === EnvTypesEnum.dev) {
    return '1'
  }
  if (mode === EnvTypesEnum.test) {
    return '30001'
  }
  return '30001'
}

/**
 * showStatusCd enum for display logic
 */
export enum showStatusEnum {
  login = 1,
  notLogin = 2,
  both = 3,
}

export enum enabledStatusEnum {
  isEnabled = 1,
  isDisabled = 2,
}
