import { useState } from 'react'
import { useMount } from 'react-use'
import { useRequest } from 'ahooks'
import { Toast } from '@nbit/vant'
import { t } from '@lingui/macro'
import UserSelectConfigurationItem from '@/features/user/common/select-configuration-item'
import { useUserStore } from '@/store/user'
import { UserSelectConfigurationItemType } from '@/typings/api/user'
import { postMemberBaseColorTtpe } from '@/apis/user'
import { getIsLogin } from '@/helper/auth'
import Icon from '@/components/icon'
import NavBar from '@/components/navbar'
import { UserUpsAndDownsColorEnum } from '@/constants/user'

function UserPersonalCenterSettingsUpsAndDowns() {
  const store = useUserStore()
  const { setMemberBaseColor, setPersonalCenterSettings, updatePreferenceAndUserInfoData } = store
  const info = store.personalCenterSettings
  const isLogin = getIsLogin()

  const colorList = [
    {
      key: 1,
      value: 2,
      icon: <Icon name="user_red_and_green" />,
      text: t`user.account_security.settings_04`,
      // 用 colors 是要兼容未登录的情况
      isChecked: info.colors === UserUpsAndDownsColorEnum.redUpGreenDown,
    },
    {
      key: 2,
      value: 1,
      icon: <Icon name="user_green_and_red" />,
      text: t`features_user_personal_center_settings_colors_index_510246`,
      isChecked: info.colors === UserUpsAndDownsColorEnum.greenUpRedDown,
    },
  ]

  useMount(() => {
    isLogin && updatePreferenceAndUserInfoData()
  })

  const handleUpdateColors = (color: number) => {
    setMemberBaseColor(color)
    isLogin && updatePreferenceAndUserInfoData()

    setPersonalCenterSettings({ colors: color })
    Toast.success(t`features_user_personal_center_settings_converted_currency_index_587`)
    window.history.back()
  }

  const postBaseColorType = async (color: number) => {
    if (isLogin) {
      const res = await postMemberBaseColorTtpe({ marketSetting: color })
      if (res.isOk && res.data?.isSuccess) {
        handleUpdateColors(color)
      }

      return
    }

    handleUpdateColors(color)
  }

  const { run } = useRequest(postBaseColorType, {
    manual: true,
  })

  const handleSettingOptions = (row: UserSelectConfigurationItemType) => run(row.value as number)
  return (
    <section className="user-personal-center-settings-color">
      <NavBar title={t`user.account_security.settings_03`} />

      <div className="user-personal-center-settings-color-wrap">
        <UserSelectConfigurationItem list={colorList} settingOptions={handleSettingOptions} />
      </div>
    </section>
  )
}

export default UserPersonalCenterSettingsUpsAndDowns
