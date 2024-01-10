import { useRef } from 'react'
import { t } from '@lingui/macro'
import classNames from 'classnames'
import { link } from '@/helper/link'
import Icon from '@/components/icon'
import Link from '@/components/link'
import NavBar from '@/components/navbar'
import { MarginModeSettingEnum, PersonProtectTypeEnum, FutureSettingPEnum } from '@/constants/trade'
import { Cell, Dialog, Popover, Switch } from '@nbit/vant'
import { hasOpenOrders, setUserAutoMarginInfo } from '@/apis/trade'
import { useFutureTradeStore } from '@/store/trade/future'
import styles from './index.module.css'

type ICardRadiosProps = {
  value: any
  title: string
  options: {
    label: string
    desc: string
    value: any
  }[]
  onChange: (value: any) => void
}
function CardRadios({ title, value, options, onChange }: ICardRadiosProps) {
  return (
    <div>
      <div className="h-1 bg-line_color_02 mb-4"></div>
      <div className="text-sm text-text_color_02 px-4 mb-2">{title}</div>
      <div>
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
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
function AutoAddMarginSetting() {
  const loading = useRef<boolean>(false)

  const { preferenceSettings, setPreference, isAutomaticMarginCall, setAutomaticMarginCall } = useFutureTradeStore()

  const onChange = async (value: boolean) => {
    const params = {
      isAutoAdd: value ? PersonProtectTypeEnum.open : PersonProtectTypeEnum.close,
    }
    if (loading.current) return
    loading.current = true
    const res = await setUserAutoMarginInfo(params)
    if (!res.isOk && !res.data) {
      return (loading.current = false)
    }
    setPreference()
    if (!value) {
      return (loading.current = false)
    }
    if (!isAutomaticMarginCall) {
      setAutomaticMarginCall()
      await Dialog.confirm({
        cancelButtonText: t`features_trade_future_settings_margin_index_646`,
        confirmButtonText: t`user.account_security.google_01`,
        message: (
          <div className="add-modal-wrap">
            <Icon name="tips_icon" className="modal-wrap-icon" />
            <div>
              {t`features_trade_future_settings_margin_index_647`}
              {t`features_trade_future_settings_margin_index_648`}
            </div>
          </div>
        ),
        className: 'auto-add-modal',
      })
      link('/future/settings/margin/auto-detail')
    }
    return (loading.current = false)
  }

  return (
    <Cell>
      <div className="flex items-center justify-between">
        <div>
          <span className="mr-2 text-base text-text_color_01">{t`features/trade/future/exchange-12`}</span>
          {/* TODO: tooltip 组件效果有待改进 */}
          <Popover
            placement="bottom-start"
            theme="dark"
            reference={<Icon name="msg" className="auto-add-icon" />}
            offset={[-10, 2]}
          >
            <div className="text-xs">{t`features_trade_future_settings_margin_index_649`}</div>
          </Popover>
        </div>
        <div className="flex items-center">
          {preferenceSettings.isAutoAdd === PersonProtectTypeEnum.open && (
            <Link className="text-xs text-brand_color mr-2" href="/future/settings/margin/auto-detail">
              {t`features_trade_future_settings_margin_index_650`}
            </Link>
          )}
          <Switch onChange={onChange} checked={preferenceSettings.isAutoAdd === PersonProtectTypeEnum.open} size={20} />
        </div>
      </div>
    </Cell>
  )
}
function TakeWaySetting() {
  const loading = useRef<boolean>(false)

  const { preferenceSettings, setPreference } = useFutureTradeStore()
  const onChange = async (value: FutureSettingPEnum) => {
    const params = {
      retrieveWay: value,
    }
    if (loading.current) return
    loading.current = true
    const res = await setUserAutoMarginInfo(params)
    loading.current = false
    res.isOk && res.data && setPreference()
  }
  const options = [
    {
      label: t`features_trade_future_settings_margin_index_651`,
      value: FutureSettingPEnum.auto,
      desc: t`features_trade_future_settings_margin_index_5101404`,
    },
    {
      label: t`features_trade_future_settings_margin_index_653`,
      value: FutureSettingPEnum.manual,
      desc: t`features_trade_future_settings_margin_index_5101405`,
    },
  ]

  return (
    <CardRadios
      options={options}
      title={t`features_trade_future_settings_margin_index_655`}
      onChange={onChange}
      value={preferenceSettings.retrieveWay}
    />
  )
}
function MarginModeSetting() {
  const loading = useRef<boolean>(false)

  const { preferenceSettings, setPreference } = useFutureTradeStore()
  const onChange = async (value: MarginModeSettingEnum) => {
    if (loading.current) return
    loading.current = true
    const hasRes = await hasOpenOrders({})
    if (!hasRes.isOk) {
      return (loading.current = false)
    }
    if (hasRes.data) {
      loading.current = false
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
    const params = {
      marginSource: value,
    }
    const res = await setUserAutoMarginInfo(params)
    loading.current = false
    res.isOk && res.data && setPreference()
  }
  const options = [
    {
      label: t`features_trade_future_settings_margin_index_657`,
      value: MarginModeSettingEnum.wallet,
      desc: t`features_trade_future_settings_margin_index_658`,
    },
    {
      label: t`features_trade_future_settings_margin_index_659`,
      value: MarginModeSettingEnum.group,
      desc: t`features_trade_future_settings_margin_index_660`,
    },
  ]

  return (
    <CardRadios
      options={options}
      onChange={onChange}
      title={t`features_trade_future_settings_margin_index_661`}
      value={preferenceSettings.marginSource}
    />
  )
}

function MarginSettings() {
  return (
    <div className={styles['index-page-wrapper']}>
      <NavBar title={t`features_trade_future_settings_index_632`} left={<Icon name="back" hasTheme />} />
      <div>
        <AutoAddMarginSetting />
        <TakeWaySetting />
        <MarginModeSetting />
      </div>
    </div>
  )
}

export default MarginSettings
