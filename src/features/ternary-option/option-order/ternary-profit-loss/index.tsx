import Icon from '@/components/icon'
import { Button, Loading } from '@nbit/vant'
// import { useDebounceFn } from 'ahooks'
import NavBar from '@/components/navbar'
import { useRequest } from 'ahooks'
import { getV1OptionEarningTodayApiRequest } from '@/apis/ternary-option/order'
import { formatNumberDecimal } from '@/helper/decimal'
import dayjs from 'dayjs'
import TernaryOptionLineChart from '@/features/ternary-option/option-order/ternary-profit-loss/line-chart'
import { IncreaseTag } from '@nbit/react'
import { t } from '@lingui/macro'
import { useState } from 'react'
import ProfitPopup from '@/features/ternary-option/option-order/ternary-profit-loss/prifit-popup'
import { isArray } from 'lodash'
import { useCssThemeColors } from '@/hooks/use-css-theme-color'
import styles from './index.module.css'

export function TernaryOptionProfitLoss() {
  const msg = t`features_ternary_option_option_order_ternary_profit_loss_index_kpiehed6t_`
  const remark = t`features_ternary_option_option_order_ternary_profit_loss_index_liyb9bz7wh`

  const today = dayjs().format('YYYY-MM-DD')

  const [popupVisible, setPopupVisible] = useState(false)

  const togglePopupVisible = val => {
    setPopupVisible(val)
  }

  const { data: res, loading } = useRequest(getV1OptionEarningTodayApiRequest)
  const { list, total, currency } = res?.data || {}

  const colors = useCssThemeColors()

  const chartData = isArray(list)
    ? (list as any).map((each, idx) => {
        return {
          y: each.ts > dayjs() ? null : `${formatNumberDecimal(each.yield, 2)}`,
          x: idx === list.length - 1 ? '24:00:00' : dayjs(each.ts).format('HH:mm:ss'),
        }
      })
    : []

  return (
    <div className={styles.local}>
      <NavBar title={t`features_ternary_option_option_order_ternary_profit_loss_index_k7xmci5hoi`} />

      <div className="content">
        <div className="row title-row">
          <div className="left">
            <div>
              <span className="text pr-1">{t`features_ternary_option_option_order_ternary_profit_loss_index_k7xmci5hoi`}</span>
              <span onClick={() => togglePopupVisible(true)}>
                <Icon name="msg" hasTheme />
              </span>
            </div>
          </div>
          <div className="right">{today}</div>
        </div>
        <div className="row profit-row rounded">
          <div className="left">
            <span className="text">{t`features_ternary_option_option_order_ternary_profit_loss_index_5a5olq4n56`}</span>
          </div>
          <div className="right">
            <span className={`profit-money`}>
              <IncreaseTag
                kSign
                hasPrefix
                hasColor
                // digits={2}
                value={total}
                delZero={false}
                defaultEmptyText={'0'}
                hasPostfix={false}
                right={currency || ''}
              />
            </span>
          </div>
        </div>
        <div className="profit-echarts">
          {/* {loading ? (
            <Loading />
          ) : ( */}
          <TernaryOptionLineChart
            colors={colors}
            currency={currency}
            data={[
              {
                id: 'profit',
                color: colors.brandColor,
                data: chartData,
              },
            ]}
          />
          {/* )} */}
        </div>
        <ProfitPopup
          visible={popupVisible}
          setVisible={togglePopupVisible}
          title={t`features_ternary_option_option_order_ternary_profit_loss_index_k7xmci5hoi`}
          content={
            <>
              <div className="text-text_color_01 text-sm pb-1 msg">{msg}</div>
              <div className="text-brand_color text-sm remark ">{remark}</div>
            </>
          }
          actions={
            <>
              <Button onClick={() => togglePopupVisible(false)} type="primary">
                <span className="text-button_text_02 text-sm font-medium">{t`features_trade_common_notification_index_5101066`}</span>
              </Button>
            </>
          }
        />
      </div>
    </div>
  )
}
