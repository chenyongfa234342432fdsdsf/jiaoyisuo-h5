import { c2cMode } from '@/helper/env'
import { BusinessC2cModeEnum } from '@/constants/c2c/common'
import ws from './index'
import NbitWebSocket from './core'

const c2cIsPublic = c2cMode === BusinessC2cModeEnum.public

export const c2cWs = c2cIsPublic ? new NbitWebSocket() : ws
