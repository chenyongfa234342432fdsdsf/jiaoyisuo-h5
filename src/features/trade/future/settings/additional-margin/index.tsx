import { t } from '@lingui/macro'
import { useState } from 'react'
import classNames from 'classnames'
import Icon from '@/components/icon'
import NavBar from '@/components/navbar'
import LazyImage from '@/components/lazy-image'
import { Button, Dialog } from '@nbit/vant'
import { MarginModeSettingEnum } from '@/constants/trade'
import { setUserAutoMarginInfo, hasOpenOrders } from '@/apis/trade'
import { useFutureTradeStore } from '@/store/trade/future'
import { oss_svg_image_domain_address } from '@/constants/oss'
import styles from './index.module.css'

type ICardRadiosProps = {
  value: any
  options: {
    label: string
    desc: string
    value: any
    src: string
  }[]
  onChange: (value: any) => void
}

function AdditionalMarginItem({ value, options, onChange }: ICardRadiosProps) {
  return (
    <div className="mt-4 flex-1 overflow-auto">
      {options.map(option => {
        const onCheck = () => {
          if (option.value === value) {
            return
          }
          onChange(option.value)
        }
        return (
          <div
            key={option.value}
            onClick={onCheck}
            className={classNames(styles['card-radio-wrapper'], {
              'is-checked': option.value === value,
            })}
          >
            <div className="main-content">
              {option.value === value ? <Icon name="contract_select" className="select-wrap-icon" /> : null}
              <div className="card-radio-label">{option.label}</div>
              <div className="card-radio-desc">{option.desc}</div>
              <div className="card-radio-image">
                <LazyImage src={`${oss_svg_image_domain_address}${option.src}`} hasTheme imageType=".png" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function AdditionalMargin() {
  const { preferenceSettings, setPreference } = useFutureTradeStore()

  const [loading, setLoading] = useState<boolean>(false)
  const [sourceId, setSourceId] = useState<string>(preferenceSettings.marginSource)

  const onChange = async (value: MarginModeSettingEnum) => {
    setSourceId(value)
  }
  const settingAdditional = async () => {
    if (loading) return
    setLoading(true)
    const hasRes = await hasOpenOrders({})
    if (!hasRes.isOk) {
      return setLoading(false)
    }
    if (hasRes.data) {
      setLoading(false)
      return Dialog.alert({
        confirmButtonText: t`features_trade_common_notification_index_5101066`,
        message: (
          <>
            <Icon name="tips_icon" className="future-setting-margin-icon" />
            <div>{t`features_trade_future_settings_margin_index_656`}</div>
          </>
        ),
      })
    }
    const res = await setUserAutoMarginInfo({
      marginSource: sourceId,
    })
    setLoading(false)
    res.isOk && res.data && setPreference()
  }

  const options = [
    {
      label: t`features_trade_future_settings_index_vxavyxrdq9pneo7eh8ms_`,
      value: MarginModeSettingEnum.wallet,
      src: 'asset_linkage_mode',
      desc: t`features_trade_future_settings_additional_margin_index_ffn_-fyf28tcji9h6kg7s`,
    },
    {
      label: t`features_trade_future_settings_additional_margin_index_cj7uai4t___xupi4uqbzd`,
      value: MarginModeSettingEnum.group,
      src: 'open_position_amount_linkage_mode',
      desc: t`features_trade_future_settings_margin_index_660`,
    },
  ]

  return (
    <section className={styles['additional-margin-wrapper']}>
      <NavBar
        title={t`features_trade_future_settings_additional_margin_index_lxpqlopchuyomy386a0eu`}
        left={<Icon name="back" hasTheme />}
      />
      <AdditionalMarginItem options={options} onChange={onChange} value={sourceId} />
      <div className="record-text-box">
        <Icon name="prompt-symbol" className="footer-list-icon" />
        <div className="footer-list-text">{t`features_trade_future_settings_additional_margin_index_xxfygrtwts6v0fpvy9f4s`}</div>
      </div>
      <footer className="additional-margin-wrapper-bottom">
        <Button type="primary" className="w-full" onClick={settingAdditional} loading={loading}>
          {t`user.pageContent.title_12`}
        </Button>
      </footer>
    </section>
  )
}
