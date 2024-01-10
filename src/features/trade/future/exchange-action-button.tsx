import { t } from '@lingui/macro'
import { getTradeButtonText, getUserFutureTradeEnabled } from '@/helper/trade'
import NotLogin from '@/components/not-login'
import { useUserStore } from '@/store/user'
import { useTradeCurrentFutureCoin } from '@/hooks/features/trade'
import { useExchangeContext } from '../common/exchange/context'
import FutureNotAvailable from './not-available'

export function FutureActionButton() {
  const { tradeInfo, isBuy } = useExchangeContext()
  const { isLogin } = useUserStore()
  const currentFutureCoin = useTradeCurrentFutureCoin()

  return (
    <NotLogin className="h-full" notLoginNode={getTradeButtonText(isLogin, currentFutureCoin.marketStatus!)}>
      <FutureNotAvailable
        placeNode={
          <div className="w-full text-center">
            <span className="text-button_text_01">{t`components/questionnaire/index-4`}</span>
          </div>
        }
      >
        {getTradeButtonText(
          isLogin,
          currentFutureCoin.marketStatus!,
          !getUserFutureTradeEnabled(isBuy)
            ? t`features_trade_future_exchange_action_button_iahscd3nrp`
            : tradeInfo.onlyReduce
            ? isBuy
              ? t`features_trade_future_exchange_action_button_5101460`
              : t`features_trade_future_exchange_action_button_5101461`
            : isBuy
            ? t`features/trade/future/exchange-20`
            : t`features/trade/future/exchange-21`
        )}
      </FutureNotAvailable>
    </NotLogin>
  )
}
