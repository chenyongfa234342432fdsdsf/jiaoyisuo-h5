import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import Link from '@/components/link'
import NavBar from '@/components/navbar'
import { useBoolean, useMount } from 'ahooks'
import { useState, useRef } from 'react'
import { setUserAutoMarginInfo, getUserAutoMarginInfo } from '@/apis/trade'
import { Cell, Radio, Popover, Button, Toast } from '@nbit/vant'
import { GearEnum, PersonProtectTypeEnum } from '@/constants/trade'
import { AutoDetailType } from '@/typings/api/trade'
import { useFutureTradeStore } from '@/store/trade/future'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import { AutoAddMarginBolus } from './bolus'
import { AutoAddMarginCoins } from './coins'
import { AutoAddMarginGroups } from './group'
import styles from './index.module.css'

function AutoTriggerPercentSetting({ onChange }: { onChange: (v) => void }) {
  const { preferenceSettings } = useFutureTradeStore()

  const [radio, setRadio] = useState<number>(preferenceSettings.autoAddThreshold || GearEnum.low)

  const AutoTriggerData = [
    { id: GearEnum.low, name: t`features_trade_future_settings_margin_auto_detail_index_5101366` },
    { id: GearEnum.middle, name: t`features_trade_future_settings_margin_auto_detail_index_5101367` },
    { id: GearEnum.high, name: t`features_trade_future_settings_margin_auto_detail_index_5101368` },
  ]

  const onRadioChange = async name => {
    setRadio(name)
    onChange && onChange(name)
  }

  return (
    <Cell className="p-4">
      <div className="auto-trigger-wrap">
        <span className="trigger-wrap-text">{t`features_trade_future_settings_margin_auto_detail_index_5101369`}</span>
        <Popover
          theme="dark"
          placement="bottom-start"
          offset={[-2, 2]}
          reference={<Icon name="msg" className="trigger-wrap-icon" />}
        >
          <div className="p-2 text-xs">{t`features_trade_future_settings_margin_auto_detail_index_5101530`}</div>
        </Popover>
      </div>
      <Radio.Group value={radio} direction="horizontal" onChange={onRadioChange}>
        {AutoTriggerData.map(v => {
          return (
            <Radio
              key={v.id}
              name={v.id}
              className="trigger-wrap-radio"
              iconRender={({ checked }) =>
                checked ? (
                  <Icon name="login_agreement_selected" className="settlement-select-icon" />
                ) : (
                  <Icon name="login_agreement_unselected" className="settlement-select-icon" />
                )
              }
            >
              {v.name}
            </Radio>
          )
        })}
      </Radio.Group>
    </Cell>
  )
}

function AutoAddMarginDetailSettings() {
  const coinPrice = useRef<string>('')
  const coinRadio = useRef<number | string>(GearEnum.low)
  const [isButton, setIsButton] = useState<boolean>(false)
  const [autoAddMarginData, setAutoAddMarginData] = useState<AutoDetailType>()

  const [loading, { setTrue, setFalse }] = useBoolean(false)

  const { preferenceSettings, setPreference } = useFutureTradeStore()

  const setUserAutoMargin = async () => {
    const res = await getUserAutoMarginInfo({})
    if (res.isOk && res.data) {
      setAutoAddMarginData(res.data)
    }
    setFalse()
    setIsButton(false)
  }

  /** 输入保证金价值* */
  const onCoinChange = v => {
    coinPrice.current = v
  }

  /** 选择的补齐保证金档位* */
  const onRadioChange = v => {
    coinRadio.current = v
  }

  /** 确认追加保证金价值* */
  const onSureChange = async () => {
    const price = coinPrice.current
    if (Number(price) > Number(autoAddMarginData?.maxSettingAmount)) {
      return Toast.info(
        `${t`features_trade_future_settings_margin_auto_detail_index_oyxrcad-bicm4lxeqeoim`}${
          autoAddMarginData?.maxSettingAmount
        }${autoAddMarginData?.currencySymbol}`
      )
    }
    setTrue()
    setIsButton(true)
    const params = {
      /** 如果没设置保证金要传 null, 不需要判断是否为空阻止* */
      autoAddQuota: price ? Number(price) : null,
      autoAddThreshold: coinRadio.current,
      isAutoAdd: PersonProtectTypeEnum.open,
    }
    const res = await setUserAutoMarginInfo(params)
    if (!res.isOk && !res.data) {
      setFalse()
      setIsButton(false)
      return
    }
    coinPrice.current = ''
    setPreference()
    setUserAutoMargin()
  }

  useMount(() => {
    setTrue()
    setUserAutoMargin()
    coinRadio.current = preferenceSettings.autoAddThreshold || GearEnum.low
  })

  return (
    <div className={styles['auto-add-margin-groups-settings']}>
      <NavBar
        title={t`features_trade_future_settings_margin_auto_detail_index_672`}
        left={<Icon name="back" hasTheme />}
        right={
          <Link href="/future/settings/margin/records/unset">
            <Icon name="asset_record" hasTheme className="groups-settings-icon" />
          </Link>
        }
      />
      <div className="pb-24">
        <AutoTriggerPercentSetting onChange={onRadioChange} />
        <div className="mt-2 h-1 bg-line_color_02" />
        <AutoAddMarginGroups />
        <div className="mt-2 h-1 bg-line_color_02" />
        <AutoAddMarginCoins data={autoAddMarginData} onChange={onCoinChange} loading={loading} />
        <div className="mt-2 h-1 bg-line_color_02" />
        <AutoAddMarginBolus data={autoAddMarginData} />
      </div>
      <div className="groups-settings-footer">
        <Button type="primary" onClick={onSureChange} className="w-full" loading={isButton}>
          {t`common.confirm`}
        </Button>
      </div>
      <FullScreenLoading mask isShow={loading} />
    </div>
  )
}

export default AutoAddMarginDetailSettings
