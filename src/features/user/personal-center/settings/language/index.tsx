import { useState } from 'react'
import { useMount } from 'react-use'
import { t } from '@lingui/macro'
import UserSelectConfigurationItem from '@/features/user/common/select-configuration-item'
import { I18nsEnum, I18nsMap } from '@/constants/i18n'
import { usePageContext } from '@/hooks/use-page-context'
import { UserSelectConfigurationItemType } from '@/typings/api/user'
import NavBar from '@/components/navbar'
import { setLocale } from '@/helper/i18n'
import { parseLanguagePageRedirectUrl } from '@/helper/user'

function UserPersonalCenterSettingsLanguage() {
  const [languageList, setLanguageList] = useState<Array<UserSelectConfigurationItemType>>([])

  const pageContext = usePageContext()

  const redirectUrl = parseLanguagePageRedirectUrl(pageContext) || '/personal-center/settings'

  useMount(() => {
    let list: UserSelectConfigurationItemType[] = []
    Object.keys(I18nsMap).forEach((v, i) => {
      list.push({ key: i, value: I18nsEnum[v], text: I18nsMap[v], isChecked: v === pageContext.locale })
    })

    setLanguageList(list)
  })

  const handleSettingOptions = (row: UserSelectConfigurationItemType) => {
    setLocale(row.value as I18nsEnum, redirectUrl)
  }

  return (
    <section className="user-personal-center-settings-language">
      <NavBar
        // onClickLeft={() => link('/personal-center/settings')}
        title={t`features_user_personal_center_settings_language_index_617`}
      />

      <div className="user-personal-center-settings-language-wrap">
        <UserSelectConfigurationItem list={languageList} settingOptions={handleSettingOptions} />
      </div>
    </section>
  )
}

export default UserPersonalCenterSettingsLanguage
