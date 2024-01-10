import { t } from '@lingui/macro'
import { useState } from 'react'
import classNames from 'classnames'
import Icon from '@/components/icon'
import NavBar from '@/components/navbar'
import LazyImage from '@/components/lazy-image'
import { Button } from '@nbit/vant'
import { FutureSettingPEnum } from '@/constants/trade'
import { setUserAutoMarginInfo } from '@/apis/trade'
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

function RetrievalMethodItem({ value, options, onChange }: ICardRadiosProps) {
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
  const [sourceId, setSourceId] = useState<string>(preferenceSettings.retrieveWay)

  const onChange = async (value: FutureSettingPEnum) => {
    setSourceId(value)
  }

  const settingRetrieval = async () => {
    if (loading) return
    setLoading(true)
    const res = await setUserAutoMarginInfo({
      retrieveWay: sourceId,
    })
    setLoading(false)
    res.isOk && res.data && setPreference()
  }
  const options = [
    {
      label: t`features_trade_future_settings_margin_index_651`,
      value: FutureSettingPEnum.auto,
      src: 'contract_automatic_retrieval',
      desc: t`features_trade_future_settings_margin_index_5101404`,
    },
    {
      label: t`features_trade_future_settings_margin_index_653`,
      value: FutureSettingPEnum.manual,
      src: 'contract_manual_retrieval',
      desc: t`features_trade_future_settings_margin_index_5101405`,
    },
  ]

  return (
    <section className={styles['retrieval-method-wrapper']}>
      <NavBar title={t`features_trade_future_settings_margin_index_655`} left={<Icon name="back" hasTheme />} />
      <RetrievalMethodItem options={options} onChange={onChange} value={sourceId} />
      <footer className="retrieval-method-wrapper-bottom">
        <Button type="primary" className="w-full" onClick={settingRetrieval} loading={loading}>
          {t`user.pageContent.title_12`}
        </Button>
      </footer>
    </section>
  )
}
