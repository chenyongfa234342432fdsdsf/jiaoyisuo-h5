import FrontPageContainer from '@/features/front-page/common/container'
import { useUserStore } from '@/store/user'
import classNames from 'classnames'
import { link } from '@/helper/link'
import { getC2cFastTradePageRoutePath } from '@/helper/route'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import styles from './index.module.css'

function FrontPageBuyCoin() {
  const { isLogin } = useUserStore()

  const handleBuyCoin = () => {
    if (!isLogin) return

    link(getC2cFastTradePageRoutePath())
  }
  return (
    <FrontPageContainer title={t`features_front_page_components_buy_coin_index_g4g2l5wu7o`}>
      <div className={`step ${styles.scoped}`}>
        <div
          className={classNames('item', {
            active: !isLogin,
          })}
        >
          <div className="num">
            <span>01</span>
          </div>
          <div className="text" onClick={() => link('/register')}>
            <label>{t`features_front_page_components_buy_coin_index_jet3y3jagx`}</label>
          </div>
          <div className="icon">
            <Icon name="arrow_icon" />
          </div>
        </div>

        <div className="line">
          <span></span>
        </div>

        <div
          className={classNames('item', {
            active: isLogin,
          })}
        >
          <div className="num">
            <span>02</span>
          </div>
          <div className="text" onClick={handleBuyCoin}>
            <label>{t`features_front_page_components_buy_coin_index_0iltf_xv6e`}</label>
          </div>
          <div className="icon">
            <Icon name="arrow_icon" />
          </div>
        </div>
      </div>
    </FrontPageContainer>
  )
}

export default FrontPageBuyCoin
