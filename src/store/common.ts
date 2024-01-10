import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { createTrackedSelector } from 'react-tracked'
import { ThemeEnum, ThemeColorEnum } from '@/constants/base'
import { setCookieLocale, setCookieThemeColor, setCookieTheme } from '@/helper/cookie'
import {
  getLangCache,
  getThemeCache,
  setThemeColorCache,
  getThemeColorCache,
  setLangCache,
  setThemeCache,
  getAccessKeyCache,
  setAccessKeyCache,
  setBusinessIdCache,
  getRestockTokenCache,
  setRestockTokenCache,
  setIsFusionModeCache,
  getIsWebClipCache,
  setIsWebClipCache,
  getIsVestBagCache,
} from '@/helper/cache'
import { getAggregationFusion, getAggregationBusinessId } from '@/helper/fusion-api'
import { setToken } from '@/helper/auth'
import { baseUserStore } from '@/store/user'
import { postMemberAuthRefreshToken } from '@/apis/user'
import { I18nsEnum } from '@/constants/i18n'
import { navigate } from 'vite-plugin-ssr/client/router'
import { getMaintenanceConfigFromS3 } from '@/apis/maintenance'
import produce from 'immer'
import { FusionModeLoginInvalidPopUp } from '@/features/user/utils/common'
import { BusinessC2cModeEnum } from '@/constants/c2c/common'
import { c2cBusinessId, c2cMode } from '@/helper/env'

const defaultLocale = I18nsEnum['en-US']

type IStore = ReturnType<typeof getStore>

type IC2cMode = {
  loaded: boolean
  isPublic: boolean
  c2cBusinessId: string
  refreshToken: string
  accessKey: string
}

const themeCache = getThemeCache()
const themeColorCache = getThemeColorCache()
const langCache = getLangCache()
const isWebClipCache = getIsWebClipCache()
const isVestBagCache = getIsVestBagCache()

function getStore(set, get) {
  return {
    layout: {
      footerShow: false,
      headerShow: false,
    },
    setLayout: (layout: { footerShow?: boolean; headerShow?: boolean }) =>
      set(
        produce((draft: IStore) => {
          if (layout.footerShow !== undefined) draft.layout.footerShow = layout.footerShow
          if (layout.headerShow !== undefined) draft.layout.headerShow = layout.headerShow
        })
      ),
    maintenanceMode: {
      triggerCheck: false,
      isMaintenance: false,
    },
    setMaintenanceMode: ({ triggerCheck, isMaintenance }: { triggerCheck?: boolean; isMaintenance?: boolean }) =>
      set(
        produce((draft: IStore) => {
          if (triggerCheck) draft.maintenanceMode.triggerCheck = triggerCheck
          if (isMaintenance) draft.maintenanceMode.isMaintenance = isMaintenance
        })
      ),

    theme: themeCache || ThemeEnum.light,
    themeColor: themeColorCache || ThemeColorEnum.default,
    /** private 不要直接调用 */
    _setThemeColor: (themeColor: ThemeColorEnum) => {
      setThemeColorCache(themeColor)
      set(() => {
        return {
          themeColor,
        }
      })
    },
    setTheme: (currentTheme?: string) =>
      set((state: IStore) => {
        if (currentTheme) {
          setThemeCache(currentTheme)
          return { theme: currentTheme }
        }
        currentTheme = state.theme === ThemeEnum.dark ? ThemeEnum.light : ThemeEnum.dark
        setThemeCache(currentTheme)
        return { theme: currentTheme }
      }),
    locale: langCache || defaultLocale,
    setLocale: (currentLocale?: string) =>
      set(() => {
        if (currentLocale) {
          return { locale: currentLocale }
        }
        return {}
      }),
    secretKey: null,
    setSecretKey: (secretKey?: string) =>
      set(() => {
        if (secretKey) {
          return { secretKey }
        }
        return {}
      }),
    // 是否融合模式
    isFusionMode: getAggregationFusion(),
    accessKey: getAccessKeyCache() || '',
    businessId: getAggregationBusinessId(),
    restockToken: getRestockTokenCache() || '',
    setFusionMode: (isFusionMode?: boolean) =>
      set(() => {
        setIsFusionModeCache(isFusionMode)
        return { isFusionMode }
      }),
    // 存 accessKey 和 businessId
    setAccessKey: (accessKey: string) =>
      set(() => {
        setAccessKeyCache(accessKey)
        return {
          accessKey: accessKey || '',
        }
      }),
    setBusinessId: (data: string) =>
      set(() => {
        setBusinessIdCache(data)
        return {
          businessId: data || '',
        }
      }),
    setRestockToken: (data: string) =>
      set(() => {
        setRestockTokenCache(data)
        return {
          restockToken: data || '',
        }
      }),
    /** 更新商户 Token */
    async updateMerchantToken(refreshToken: string, pathname) {
      const userStore = baseUserStore.getState()
      const tokenTtl = userStore.personalCenterSettings.tokenTtl as number
      const res = await postMemberAuthRefreshToken({ refreshToken, tokenTtl })
      /** error code 10000122 token 为空 */
      if (res.code === 10000122) {
        FusionModeLoginInvalidPopUp()
        return
      }

      if (res.isOk && res.data) {
        setToken(res.data)
        userStore.setLogin(true)
        /** 进入融合模式后清除 url 参数* */
        history?.pushState({}, '', pathname)
        await userStore.updatePreferenceAndUserInfoData()
      }
    },
    // 刷新次数，组件订阅更新即可起到订阅事件的作用，避免多加一个 context，同时不会两个页面都需要刷新，所以放在公共 store 里就行
    refreshCounter: 0,
    updateRefreshCounter: () => {
      set(old => {
        return {
          ...old,
          refreshCounter: old.refreshCounter + 1,
        }
      })
    },
    isWebClip: isWebClipCache || false,
    setIsWebClip: (isWebClip: boolean) =>
      set(() => {
        setIsWebClipCache(isWebClip)
        return {
          isWebClip,
        }
      }),
    // ws 的延迟时间
    wsDelayTime: 0,
    setwsDelayTime: (wsDelayTime: number) =>
      set(() => {
        return { wsDelayTime }
      }),
    isVestBag: isVestBagCache || false,
    setIsVestBag: (isVestBag: boolean) =>
      set(() => {
        setIsWebClipCache(isVestBag)
        return {
          isVestBag,
        }
      }),
    // c2c 模式，为公有或者私有
    c2cMode: {
      loaded: true,
      // 默认为公有模式，避免接口出错等问题
      isPublic: c2cMode === BusinessC2cModeEnum.public,
      c2cBusinessId,
      accessKey: '',
    } as IC2cMode,
    setC2cMode: (data: Partial<IC2cMode>) => {
      set(
        produce((draft: IStore) => {
          Object.assign(draft.c2cMode, data)
        })
      )
    },
  }
}

const baseCommonStore = create(subscribeWithSelector(getStore))
// 添加监听，A 模块变动去修改 B 模块状态
baseCommonStore.subscribe(
  state => `${state.theme}-${state.themeColor}`,
  str => {
    const [theme, themeColor] = str.split('-')
    if (typeof window !== 'undefined') {
      document.body.setAttribute('theme', theme)
      document.body.setAttribute('theme-color', themeColor)
      setCookieTheme(theme)
      setCookieThemeColor(themeColor)
    }
  }
)
baseCommonStore.subscribe(
  state => state.locale,
  locale => {
    if (typeof window !== 'undefined') {
      setLangCache(locale)
      setCookieLocale(locale)
    }
  }
)

/**
 * check isMaintenance mode on trigger
 * set maintenance mode to true
 * redirect to current page to render maintenance page
 */
baseCommonStore.subscribe(
  state => state.maintenanceMode.triggerCheck,
  () => {
    const { setMaintenanceMode } = baseCommonStore.getState()
    getMaintenanceConfigFromS3({}).then(res => {
      const maintenanceState = res.data.state
      setMaintenanceMode({ isMaintenance: maintenanceState })
      navigate(window.location.pathname)
    })
  }
)

const useCommonStore = createTrackedSelector(baseCommonStore)
// TODO: 必须要这样调用：baseCommonStore.getState()
export { useCommonStore, baseCommonStore }
