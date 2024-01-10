import { useMount } from 'react-use'
import NavBar from '@/components/navbar'
import { ActionSheet, Button, Cell, Toast } from '@nbit/vant'
import { t } from '@lingui/macro'
import { useCommonStore } from '@/store/common'
import { usePageContext } from '@/hooks/use-page-context'
import { UserUpsAndDownsColorEnum } from '@/constants/user'
import { link } from '@/helper/link'
import { getIsLogin } from '@/helper/auth'
import { useUserStore } from '@/store/user'
import { usePersonalCenterStore } from '@/store/user/personal-center'
import { I18nsMap } from '@/constants/i18n'
import { getThemeColorEnumName } from '@/constants/base'
import { useRequest } from 'ahooks'
import { useState } from 'react'
import { getMemberUserLoginOut } from '@/apis/user'
import styles from './index.module.css'
import FullScreenLoading from '../../components/full-screen-loading'

export default function UserPersonalCenterSettings() {
  const pageContext = usePageContext()
  const { isFusionMode, themeColor } = useCommonStore()

  const isLogin = getIsLogin()
  const { personalCenterSettings, updatePreferenceAndUserInfoData, clearUserCacheData } = useUserStore()
  const { fiatCurrencyData } = usePersonalCenterStore()
  const { colors, pushLanguage } = personalCenterSettings
  const [visible, setVisible] = useState<boolean>(false)

  useMount(() => {
    isLogin && updatePreferenceAndUserInfoData()
  })

  const handleUnLoginStatus = (url: string, isCheck: boolean) => {
    if (isCheck) {
      isLogin ? link(url) : Toast.info(t`features_user_personal_center_index_510102`)
      return
    }

    link(url)
  }

  const handleClearData = async (url: string) => {
    setVisible(false)
    await getMemberUserLoginOut({})
    clearUserCacheData()
    link(url)
  }

  const { run, loading } = useRequest(handleClearData, { manual: true })

  return (
    <div className={`settins ${styles.scoped}`}>
      <NavBar
        title={
          <div>
            <img src="" alt="" />
            <span>{t`user.pageContent.title_12`}</span>
          </div>
        }
        onClickLeft={() => link(isFusionMode ? '/futures/BTCUSD' : '/personal-center')}
      />

      <div className="settins-wrap">
        <Cell
          title={t`user.account_security.settings_01`}
          isLink
          value={I18nsMap[pageContext.locale as string]}
          onClick={() => link('/personal-center/settings/language')}
        />

        {!isFusionMode && (
          <Cell
            title={t`features_user_personal_center_settings_index_619`}
            isLink
            value={I18nsMap[pushLanguage as string] || t`features_user_personal_center_settings_index_5101268`}
            onClick={() => handleUnLoginStatus('/personal-center/settings/push-language', true)}
          />
        )}

        {!isFusionMode && (
          <Cell
            title={t`user.account_security.settings_02`}
            isLink
            value={fiatCurrencyData?.currencyEnName}
            onClick={() => handleUnLoginStatus('/personal-center/settings/converted-currency', true)}
          />
        )}

        <Cell
          title={t`user.personal_center_08`}
          isLink
          onClick={() => handleUnLoginStatus('/assets/withdraw/address', true)}
        />

        <div className="divider"></div>

        <Cell
          title={t`user.account_security.settings_03`}
          isLink
          value={
            colors === UserUpsAndDownsColorEnum.greenUpRedDown
              ? t`features_user_personal_center_settings_colors_index_510246`
              : t`user.account_security.settings_04`
          }
          onClick={() => link('/personal-center/settings/colors')}
        />
        {!isFusionMode && (
          <Cell
            title={t`modules_user_personal_center_settings_theme_color_index_page_wpqivkckel`}
            isLink
            value={getThemeColorEnumName(themeColor)}
            onClick={() => link('/personal-center/settings/theme-color')}
          />
        )}

        {isLogin && (
          <div className="login-out">
            <Button
              type="primary"
              onClick={() => run('/login')}
            >{t`features_user_personal_center_index_oa0glxw_zoxjimyq8lplx`}</Button>
            <Button type="primary" onClick={() => setVisible(true)}>{t`user.personal_center_13`}</Button>
          </div>
        )}
      </div>

      <ActionSheet
        className={`${styles['personal-center-action-sheet']}`}
        visible={visible}
        onCancel={() => setVisible(false)}
        cancelText={t`assets.financial-record.cancel`}
        description={t`features_user_personal_center_index_v78k_m6ea9o7ozbrxsxff`}
        actions={[{ name: t`user.personal_center_13` }]}
        onSelect={() => run('/')}
      />

      <FullScreenLoading isShow={loading} />
    </div>
  )
}
