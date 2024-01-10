import { useEffect } from 'react'
import Icon from '@/components/icon'
import { link } from '@/helper/link'
import { getAuthModuleStatusByKey, AuthModuleEnum } from '@/helper/modal-dynamic'
import { getC2cFastTradePageRoutePath } from '@/helper/route'
import { useUserStore } from '@/store/user'
import { useLayoutStore } from '@/store/layout'
import { t } from '@lingui/macro'
import styles from './index.module.css'

export default NavigationCard

function NavigationCard() {
  const { getMerchantTrialQualification, setTrialAccountInfo, hasMerchantTrialQualification, isLogin } = useUserStore()
  const { headerData } = useLayoutStore()

  const coins = {
    title: t`features_home_components_navigation_card_index_510103`,
    subTitle: t`features_home_components_navigation_card_index_510104`,
    icon: 'home_quick_buy_coins',
    click: () => link(getC2cFastTradePageRoutePath()),
  }
  const trial = {
    title: t`features_user_register_index_wvdg2uy5cw`,
    subTitle: t({
      id: 'features_home_components_navigation_card_index_nqo44crxdh',
      values: { 0: headerData?.businessName },
    }),
    icon: 'home_trial',
    click: () => setTrialAccountInfo(),
  }

  const options = getAuthModuleStatusByKey(AuthModuleEnum.c2c) ? [coins, trial] : [trial]

  useEffect(() => {
    !isLogin && getMerchantTrialQualification()
  }, [isLogin])

  return (
    // todo add related link
    <>
      {hasMerchantTrialQualification && !isLogin ? (
        <div className={styles['merchant-trial-qualification']}>
          {options.map((v, index) => (
            <div className="item" key={index} onClick={v.click}>
              <Icon className="navigation-icon" name={v.icon} />
              <div className="content">
                <div className="title">{v.title}</div>
                <div className="sub-title">
                  <span>{v.subTitle}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        getAuthModuleStatusByKey(AuthModuleEnum.c2c) && (
          <div className={styles.scoped} onClick={() => link(getC2cFastTradePageRoutePath())}>
            <Icon className="navigation-icon" name="home_quick" />
            <div>
              <div className="title">{t`features_home_components_navigation_card_index_510103`}</div>
              <div className="sub-title">{t`features_home_components_navigation_card_index_510104`}</div>
            </div>
            <Icon name="next_arrow" hasTheme />
          </div>
        )
      )}
    </>
  )
}
