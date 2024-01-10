/**
 * 充值 - 币种选择
 */
import { t } from '@lingui/macro'
import LazyImage from '@/components/lazy-image'
import Icon from '@/components/icon'
import { ICoin } from '../../common/coin-selection'

interface IRechargeCoinProps {
  coin: ICoin
  onClick: () => void
}

function RechargeCoin(props: IRechargeCoinProps) {
  const { coin, onClick } = props

  return (
    <div className="form-cell">
      <div className="form-label">{t`assets.withdraw.form.coin.label`}</div>
      <div className="form-coin" onClick={onClick}>
        <div className="flex items-center">
          {coin?.id ? (
            <>
              <LazyImage width={20} height={20} src={coin?.appLogo} round />
              <span className="ml-1">{coin?.coinName}</span>
            </>
          ) : (
            <span className="text-text_color_04">{t`features_assets_recharge_coin_index__xnlxmamtx`}</span>
          )}
        </div>
        <div className="flex items-center">
          <span>{coin?.coinFullName}</span>
          <Icon hasTheme name="next_arrow" className="text-base" />
        </div>
      </div>
    </div>
  )
}

export { RechargeCoin }
