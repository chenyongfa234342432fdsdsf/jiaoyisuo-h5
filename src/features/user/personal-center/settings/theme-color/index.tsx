import { Checkbox, Toast } from '@nbit/vant'
import { t } from '@lingui/macro'
import { getIsLogin } from '@/helper/auth'
import NavBar from '@/components/navbar'
import { ThemeColorEnum, getThemeColorEnumName } from '@/constants/base'
import { DefaultRadioIconRender } from '@/components/radio/icon-render'
import classNames from 'classnames'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { useCommonStore } from '@/store/common'
import { getThemeSuffix } from '@/helper/common'
import { setThemeColor } from '@/helper/theme'
import styles from './index.module.css'

function UserPersonalCenterSettingThemeColor() {
  const { themeColor } = useCommonStore()
  const isLogin = getIsLogin()

  const skinColors = [
    {
      value: ThemeColorEnum.orange,
      img: '',
      text: getThemeColorEnumName(ThemeColorEnum.orange),
    },
    {
      value: ThemeColorEnum.blue,
      img: '',
      text: getThemeColorEnumName(ThemeColorEnum.blue),
    },
    {
      value: ThemeColorEnum.green,
      img: '',
      text: getThemeColorEnumName(ThemeColorEnum.green),
    },
    {
      value: ThemeColorEnum.default,
      img: '',
      text: getThemeColorEnumName(ThemeColorEnum.default),
    },
  ]

  const updateSkinColor = (color: ThemeColorEnum) => {
    setThemeColor(color)
    Toast.success(t`features_user_personal_center_settings_converted_currency_index_587`)
    // window.history.back()
  }

  return (
    <section className={styles['theme-color-page']}>
      <NavBar title={t`modules_user_personal_center_settings_theme_color_index_page_wpqivkckel`} />
      <div className="p-4">
        {skinColors.map((item, index) => {
          const checked = item.value === themeColor
          return (
            <div
              className={classNames('skin-item', {
                'is-checked': checked,
              })}
              key={item.value}
              onClick={() => updateSkinColor(item.value)}
            >
              <div className="img-box">
                <img
                  src={`${oss_svg_image_domain_address}settings/theme_color_${item.value}${getThemeSuffix()}.png`}
                  alt={item.text}
                />
              </div>
              <div className="flex justify-center items-center">
                <Checkbox className="-translate-y-0.5" checked={checked} iconRender={DefaultRadioIconRender} />
                <span className="text-text_color_01 ml-2">{item.text}</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default UserPersonalCenterSettingThemeColor
