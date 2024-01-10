import { t } from '@lingui/macro'
import { cloneDeep } from 'lodash'
import Icon from '@/components/icon'
import NavBar from '@/components/navbar'
import { IncreaseTag } from '@nbit/react'
import { useMount } from 'ahooks'
import { useState } from 'react'
import { Button, Checkbox, Toast } from '@nbit/vant'
import NoDataImage from '@/components/no-data-image'
import { AdjustCoinGroupType } from '@/typings/api/trade'
import { PersonProtectTypeEnum } from '@/constants/trade'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { getGroupQueryAll, setUserAutoMarginGroup } from '@/apis/trade'
import { formatNumberDecimal } from '@/helper/decimal'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import { getFuturesCurrencySettings } from '@/helper/assets/futures'
import styles from './index.module.css'

function AdjustCoin() {
  const [loading, setLoading] = useState<boolean>(false)
  const [isButton, setIsButton] = useState<boolean>(false)
  const [adjustCoinData, setAdjustCoinData] = useState<Array<AdjustCoinGroupType>>([])

  /** 获取法币精度* */
  const { offset } = useAssetsFuturesStore().futuresCurrencySettings

  const getAdjustCoinGroup = async () => {
    setLoading(true)
    const { data, isOk } = await getGroupQueryAll({})
    setLoading(false)
    isOk && setAdjustCoinData(data?.list || [])
  }

  const onCheckAll = v => {
    const params = cloneDeep(adjustCoinData)
    params.forEach(item => {
      if (item.id === v.id) {
        item.isAutoAdd =
          item.isAutoAdd === PersonProtectTypeEnum.open ? PersonProtectTypeEnum.close : PersonProtectTypeEnum.open
      }
    })
    setAdjustCoinData(params)
  }

  /** 取消* */
  const onCancel = () => {
    history.back()
  }

  /** 确定* */
  const onSure = async () => {
    const data = adjustCoinData?.map(item => {
      return { groupId: item.id, isAutoAdd: item.isAutoAdd }
    })
    setIsButton(true)
    const res = await setUserAutoMarginGroup({ groupAutoMarginSettingData: data })
    setIsButton(false)
    if (res.isOk && res.data) {
      Toast.success({
        message: t`features_user_personal_center_settings_converted_currency_index_587`,
        forbidClick: true,
      })
      onCancel()
    }
  }

  useMount(() => {
    getAdjustCoinGroup()
    getFuturesCurrencySettings()
  })

  return (
    <div className={styles['auto-add-margin-adjust-coin']}>
      <NavBar
        title={t`features_trade_future_settings_margin_auto_detail_adjust_coin_5101381`}
        left={<Icon name="back" hasTheme />}
      />
      <div className="adjust-coin-contair">
        {adjustCoinData?.length ? (
          adjustCoinData?.map(v => {
            return (
              <div
                key={v.id}
                onClick={() => onCheckAll(v)}
                className={`coin-contair-wrap ${v.isAutoAdd === PersonProtectTypeEnum.open ? 'select-wrap' : ''}`}
              >
                <div
                  className={`contair-wrap-title ${v.isAutoAdd === PersonProtectTypeEnum.open ? 'select-title' : ''}`}
                >
                  <div className="wrap-title-contair">
                    <div className="wrap-title">{v?.name}</div>
                  </div>
                  <Checkbox
                    shape="square"
                    onChange={() => onCheckAll(v)}
                    checked={v.isAutoAdd === PersonProtectTypeEnum.open}
                    iconRender={({ checked }) =>
                      checked ? (
                        <Icon name="login_verify_selected" className="check-icon" />
                      ) : (
                        <Icon name="login_verify_unselected" hasTheme className="check-icon" />
                      )
                    }
                  />
                </div>
                <div className={`contair-wrap-content`}>
                  <div
                    className={`wrap-content-text ${
                      v.isAutoAdd === PersonProtectTypeEnum.open ? 'select-content' : ''
                    }`}
                  >
                    {t`features_orders_future_holding_index_603`}
                  </div>
                  <div className="wrap-content-increase">
                    <IncreaseTag value={formatNumberDecimal(v?.unrealizedProfit, offset)} />
                    <div className="content-increase-text">{v?.baseCoin}</div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="mt-32">
            <NoDataImage />
          </div>
        )}
      </div>
      <div className="adjust-coin-footer">
        <Button className="coin-footer-button" onClick={onCancel}>{t`assets.financial-record.cancel`}</Button>
        <Button
          type="primary"
          onClick={onSure}
          loading={isButton}
          className="coin-footer-button"
        >{t`common.confirm`}</Button>
      </div>
      <FullScreenLoading isShow={loading} />
    </div>
  )
}

export default AdjustCoin
