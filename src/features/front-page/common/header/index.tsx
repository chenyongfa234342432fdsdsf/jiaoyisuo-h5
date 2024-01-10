import { useCommonStore } from '@/store/common'
import { ThemeEnum, ThemeBackGroundColor } from '@/constants/base'
import { UpdateMetaThemeColor } from '@/features/user/utils/common'
import { useLayoutStore } from '@/store/layout'
import LazyImage from '@/components/lazy-image'
import Link from '@/components/link'
import Icon from '@/components/icon'
import { getGuidePageComponentInfoByKey } from '@/helper/layout'
import { getLanguageOnSelectRedirectionUrl } from '@/helper/user'
import styles from './index.module.css'
import ShouldGuidePageComponentDisplay from '../component-should-display'

function FrontPageHeader() {
  const commonStore = useCommonStore()
  const { layoutProps, guidePageBasicWebInfo } = useLayoutStore()
  const { customerJumpUrl, imgWebIcon, businessName } = layoutProps || {}
  const { pageInfoTopBar = [] } = guidePageBasicWebInfo || {}

  const homeIcon = getGuidePageComponentInfoByKey('homeIcon', pageInfoTopBar)
  const styleSwitchIcon = getGuidePageComponentInfoByKey('styleSwitchIcon', pageInfoTopBar)
  const cusServiceIcon = getGuidePageComponentInfoByKey('cusServiceIcon', pageInfoTopBar)
  const language = getGuidePageComponentInfoByKey('language', pageInfoTopBar)

  const updateTheme = () => {
    let themeSetting: ThemeEnum
    commonStore.theme === ThemeEnum.light ? (themeSetting = ThemeEnum.dark) : (themeSetting = ThemeEnum.light)
    UpdateMetaThemeColor(ThemeBackGroundColor[themeSetting])
    commonStore.setTheme(themeSetting)
  }

  return (
    <div className={`header ${styles.scoped}`}>
      <ShouldGuidePageComponentDisplay showStatusCd={homeIcon?.showStatusCd} enabledInd={homeIcon?.enabledInd}>
        <Link className="brand" href={'/home-page'}>
          <div className="logo">
            <LazyImage src={imgWebIcon} />
          </div>
          <div className="name">
            <label>{businessName}</label>
          </div>
        </Link>
      </ShouldGuidePageComponentDisplay>
      <div className="menu">
        <ShouldGuidePageComponentDisplay
          showStatusCd={styleSwitchIcon?.showStatusCd}
          enabledInd={styleSwitchIcon?.enabledInd}
        >
          <div className="icon" onClick={updateTheme}>
            <Icon name="btn_theme" hasTheme />
          </div>
        </ShouldGuidePageComponentDisplay>
        <ShouldGuidePageComponentDisplay
          showStatusCd={cusServiceIcon?.showStatusCd}
          enabledInd={cusServiceIcon?.enabledInd}
        >
          <div className="icon">
            <Link href={customerJumpUrl || '/'}>
              <Icon name="nav_service" hasTheme />
            </Link>
          </div>
        </ShouldGuidePageComponentDisplay>
        <ShouldGuidePageComponentDisplay showStatusCd={language?.showStatusCd} enabledInd={language?.enabledInd}>
          <div className="icon">
            <Link href={getLanguageOnSelectRedirectionUrl('/')}>
              <Icon name="language_switch" hasTheme />
            </Link>
          </div>
        </ShouldGuidePageComponentDisplay>
      </div>
    </div>
  )
}

export default FrontPageHeader
