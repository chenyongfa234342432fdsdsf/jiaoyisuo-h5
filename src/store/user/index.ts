import { Toast } from '@nbit/vant'
import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { createTrackedSelector } from 'react-tracked'
import cacheUtils from 'store'
import { removeToken, setToken } from '@/helper/auth'
import { setLineCssColor, getTokenCache, setTokenCache } from '@/helper/cache'
import { UserUpsAndDownsColorEnum, UserCurrencySymbolEnum } from '@/constants/user'
import { I18nsEnum } from '@/constants/i18n'
import { UserInfoType } from '@/typings/api/user'
import produce from 'immer'
import { basePersonalCenterStore } from '@/store/user/personal-center'
import { YapiPostAuthRefreshTokenData } from '@/typings/yapi/AuthRefreshTokenPostApi'
import { useSetting } from '@/features/user/personal-center/settings/setting'
import { setMemberSellProperty, setMemberBuyProperty } from '@/helper/handlecolor'
import { getMemberUserInfo, getMemberBaseSettingsInfo, getMemberDemoIsOpen, getMemberRegisterDemo } from '@/apis/user'
import { MemberUserInfoResp, MemberBaseSettingsInfoResp } from '@/typings/user'
import { toKenTtlDefaultValue } from '@/constants/auth'
import { UserContractVersionEnum } from '@/constants/trade'
import { link } from '@/helper/link'
import { t } from '@lingui/macro'
import { baseVipCenterStore } from '../vip'

const userInfo = 'USER_INFO'

type IStore = ReturnType<typeof getStore>

const cacheToken = getTokenCache() as YapiPostAuthRefreshTokenData | null

const userTransitionData = 'USER_TRANSITION_DATA'
const personalCenterSettings = 'PERSONAL_CENTER_SETTINGS'
const deviceId = 'DEVICE_ID'
const multipleLoginTime = 'MULTIPLE_LOGIN_TIME'
const thirdPartyToken = 'THIRD_PARTY_TOKEN'

type RestItemType = {
  /** 邮箱 */
  isEmail: boolean
  /** 手机 */
  isMobile: boolean
  /** 谷歌 */
  isGoogle: boolean
}

type UserTransitionDataType = {
  /** 账号 */
  account?: string
  /** 账号类型 手机或邮箱 */
  accountType?: string | number
  /** 第三方账号 */
  thirdPartyAccount?: string
  /** 第三方账号类型 */
  thirdPartyAccountType?: string | number
  /** 注册类型 */
  registerType?: string
  /** 极验码 */
  imageCode?: string
  /** 安全项 */
  item?: number
  /** 邮箱 */
  email?: string
  /** 密码 */
  loginPassword?: string
  /** 国家缩写字母 */
  regCountry?: string
  /** 手机区号 */
  mobileCountryCode?: string
  /** 手机号 */
  mobileNumber?: string
  /** uid */
  uid?: string
  /** 重置安全项选项 */
  resetItem?: RestItemType
  /** 地区值 */
  codeVal?: string
  /** 国家名称 */
  codeKey?: string
  /** 是否可用  */
  enableInd?: number
  /** 国家缩写 */
  remark?: string | null
  /** 目录名 */
  homeColumnName?: string
}

type PersonalCenterSettingsType = {
  /** 涨跌色 */
  colors?: number
  /** 货币符号 */
  currencySymbol?: string
  /** 推送语言 */
  pushLanguage?: string
  /** 保持登录时长 */
  tokenTtl?: number
  /** 合约版本 */
  contractVersion?: number
} & Partial<MemberBaseSettingsInfoResp>

const personalCenterSettingsDefaultValue = {
  colors: UserUpsAndDownsColorEnum.greenUpRedDown,
  /** 过渡变量 更新后删除 */
  currencySymbol: UserCurrencySymbolEnum.usd,
  pushLanguage: I18nsEnum['en-US'],
  tokenTtl: toKenTtlDefaultValue,
  perpetualVersion: UserContractVersionEnum.professional,
}

type IC2cUserInfo = {
  uid?: string
  token?: string
}
// 判断 refreshToken 过期时间 重置 isLogin 状态
function getIsLoginStatus() {
  if (cacheToken) {
    const isTrue = Date.now() <= cacheToken.refreshTokenExpireTime && !!cacheToken.accessToken
    return isTrue
  }

  return !!cacheToken
}

function getStore(set, get) {
  return {
    isLogin: getIsLoginStatus(),
    setLogin: (values: boolean) => {
      set((store: IStore) => {
        return produce(store, _store => {
          _store.isLogin = values
        })
      })
    },
    token: cacheToken,
    setToken: (tokenObj: YapiPostAuthRefreshTokenData | null) =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.token = tokenObj
          setTokenCache(tokenObj)
        })
      }),
    userInfo: cacheUtils.get(userInfo) || <UserInfoType>{},
    setUserInfo: (values: UserInfoType) =>
      set((store: IStore) => {
        return produce(store, _store => {
          const userInfoFormations = { ..._store.userInfo, ...values }
          _store.userInfo = userInfoFormations
          cacheUtils.set(userInfo, userInfoFormations)
        })
      }),
    removeUserInfo: () =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.userInfo = <UserInfoType>{}
          cacheUtils.set(userInfo, '')
        })
      }),
    deviceId: cacheUtils.get(deviceId) || '',
    setDeviceId: (values: string) =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.deviceId = values
          cacheUtils.set(deviceId, values)
        })
      }),
    /** 用户登录、注册过渡数据 */
    userTransitionDatas: cacheUtils.get(userTransitionData) || <UserTransitionDataType>{},
    setUserTransitionDatas: (values: UserTransitionDataType) =>
      set((store: IStore) => {
        return produce(store, _store => {
          const userTranstionData = { ..._store.userTransitionDatas, ...values }
          _store.userTransitionDatas = userTranstionData
          cacheUtils.set(userTransitionData, userTranstionData)
        })
      }),
    removeUserTransitionDatas: () =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.userTransitionDatas = <UserTransitionDataType>{}
          cacheUtils.set(userTransitionData, '')
        })
      }),
    /** 个人中心个人偏好设置 */
    personalCenterSettings: <PersonalCenterSettingsType>{
      ...personalCenterSettingsDefaultValue,
      ...cacheUtils.get(personalCenterSettings),
    },
    setPersonalCenterSettings: (values: PersonalCenterSettingsType) =>
      set((store: IStore) => {
        return produce(store, _store => {
          const personalCanterSettingsData = { ..._store.personalCenterSettings, ...values }
          if (values.colors === undefined) {
            personalCanterSettingsData.colors = personalCanterSettingsData.marketSetting
          }
          _store.personalCenterSettings = personalCanterSettingsData
          cacheUtils.set(personalCenterSettings, personalCanterSettingsData)
        })
      }),
    /** 全局设置涨跌色 */
    setMemberBaseColor: (key: number) =>
      set((store: IStore) => {
        return produce(store, _store => {
          const { cssColorObj } = useSetting()
          const showHandleColor = key === UserUpsAndDownsColorEnum.greenUpRedDown
          const sellHandle = cssColorObj({ valueTittle: showHandleColor ? 'rd' : 'gr' })
          const buyHandle = cssColorObj({ valueTittle: showHandleColor ? 'gr' : 'rd' })
          const info = cacheUtils.get(personalCenterSettings) || _store.personalCenterSettings
          setLineCssColor({ buyHandle, sellHandle, trend: key })
          setMemberSellProperty(sellHandle)
          setMemberBuyProperty(buyHandle)
          _store.personalCenterSettings.colors = key
          cacheUtils.set(personalCenterSettings, { ...info, colors: key })
        })
      }),
    /** 清除用户登录状态缓存的数据 */
    clearUserCacheData: async () => {
      const state: IStore = get()
      await removeToken()
      await state.removeUserInfo()
      await state.removeUserTransitionDatas()
      state.setLogin(false)
      const { clearVipBaseInfo } = baseVipCenterStore.getState()
      clearVipBaseInfo()
      const { clearVipLimitInfo } = basePersonalCenterStore.getState()
      clearVipLimitInfo()
    },
    /** 更新偏好设置和用户信息的聚合方法 */
    async updatePreferenceAndUserInfoData() {
      const { updateFiatCurrencyData } = basePersonalCenterStore.getState()
      const [userInfoRes, userSettingInfoRes] = await Promise.all([
        getMemberUserInfo({}),
        getMemberBaseSettingsInfo({}),
      ])
      if (userInfoRes.isOk && userSettingInfoRes.isOk) {
        set((store: IStore) => {
          return produce(store, _store => {
            const userInfoFormations = {
              ..._store.userInfo,
              ...(userInfoRes?.data as MemberUserInfoResp),
              ...(userSettingInfoRes?.data as MemberBaseSettingsInfoResp),
            }
            _store.userInfo = userInfoFormations
            cacheUtils.set(userInfo, userInfoFormations)
            _store.setPersonalCenterSettings({ colors: userSettingInfoRes.data?.marketSetting })
            updateFiatCurrencyData('currencyTypeCd', userSettingInfoRes.data?.currencyTypeCd as string)
          })
        })
      }
    },
    /** 获取商户是否有试玩资格 */
    hasMerchantTrialQualification: false,
    async getMerchantTrialQualification() {
      const res = await getMemberDemoIsOpen({})
      if (res.isOk && res.data) {
        set((store: IStore) => {
          return produce(store, _store => {
            _store.hasMerchantTrialQualification = res.data?.isOpen || false
          })
        })
      }
    },
    /** 设置试玩账户身份信息 */
    async setTrialAccountInfo() {
      const state: IStore = get()
      const res = await getMemberRegisterDemo({})
      if (res.isOk && res.data) {
        setToken({
          accessToken: res.data.token,
          refreshToken: res.data.refreshToken,
          accessTokenExpireTime: res.data.tokenExpireTime,
          refreshTokenExpireTime: res.data.refreshTokenExpireTime,
        })

        await state.setUserInfo({ ...res.data?.userInfo })
        await state.setMemberBaseColor(
          res.data?.usrMemberSettingsVO?.marketSetting || UserUpsAndDownsColorEnum.greenUpRedDown
        )

        Toast.success(t`store_user_index_suoaao9ftj`)

        link('/home-page')
      }
    },
    /** 多点登录时间 */
    multipleLoginTime: cacheUtils.get(multipleLoginTime) || 0,
    setMultipleLoginTime(value) {
      set((store: IStore) => {
        return produce(store, _store => {
          _store.multipleLoginTime = value
          cacheUtils.set(multipleLoginTime, value)
        })
      })
    },
    clearMultipleLoginTime() {
      set((store: IStore) => {
        return produce(store, _store => {
          _store.multipleLoginTime = 0
          cacheUtils.set(multipleLoginTime, 0)
        })
      })
    },
    /** 注意，仅公有 c2c 模式下启用 */
    c2cUserInfo: {
      uid: '',
      token: '',
    },
    setC2cUserInfo: (values: Partial<IC2cUserInfo>) => {
      set(
        produce((store: IStore) => {
          Object.assign(store.c2cUserInfo, values)
        })
      )
    },
    /** 第三方登录 token */
    thirdPartyToken: cacheUtils.get(thirdPartyToken) || '',
    setThirdPartyToken(token: string) {
      set((store: IStore) => {
        return produce(store, _store => {
          _store.thirdPartyToken = token
          cacheUtils.set(thirdPartyToken, token)
        })
      })
    },
    clearThirdPartyToken() {
      set((store: IStore) => {
        return produce(store, _store => {
          _store.thirdPartyToken = ''
          cacheUtils.set(thirdPartyToken, '')
        })
      })
    },
  }
}

const baseUserStore = create(subscribeWithSelector(devtools(getStore, { name: 'user-store' })))

const useUserStore = createTrackedSelector(baseUserStore)

// 添加监听，A 模块变动去修改 B 模块状态
const unUserSub = baseUserStore.subscribe(
  state => !!state.token,
  val => {
    baseUserStore.getState().setLogin(val)
  }
)

export { useUserStore, baseUserStore, unUserSub }
