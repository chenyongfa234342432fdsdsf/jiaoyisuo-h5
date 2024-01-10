import Icon from '@/components/icon'
import NavBar from '@/components/navbar'
import { t } from '@lingui/macro'
import Link from '@/components/link'
import { Cell, Switch } from '@nbit/vant'
import { useLayoutStore } from '@/store/layout'
import LazyImage from '@/components/lazy-image'
import { setUserAutoMarginInfo } from '@/apis/trade'
import { useFutureTradeStore } from '@/store/trade/future'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { PriceProtectTypeEnum, ContractPreferencesTermsEnum } from '@/constants/trade'
import styles from './index.module.css'

function SwitchItem() {
  const { preferenceSettings, setPreference } = useFutureTradeStore()
  const onChange = async (value: boolean) => {
    const params = {
      autoAddQuota: preferenceSettings.autoAddQuota,
      protect: value ? PriceProtectTypeEnum.open : PriceProtectTypeEnum.close,
    }
    const res = await setUserAutoMarginInfo(params)
    if (!res.isOk && !res.data) return
    setPreference()
  }

  return (
    <Cell className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-base text-text_color_01">{t`features_trade_future_settings_index_633`}</span>
        </div>
        <Switch onChange={onChange} checked={preferenceSettings.protect === PriceProtectTypeEnum.open} size={20} />
      </div>
    </Cell>
  )
}

export function PriceProtectSetting() {
  const urlData = useLayoutStore()?.columnsDataByCd

  return (
    <div className={styles['price-protect-wrapper']}>
      <NavBar title={t`features_trade_future_settings_index_633`} left={<Icon name="back" hasTheme />} />
      <SwitchItem />
      <div className="px-4 pb-4">
        <div className="mb-4 bg-card_bg_color_01 relative">
          <div className="price-tag price-tag-first">
            <div className="price-tag-text">{t`features_trade_future_settings_price_protect_1ved3o5793itx8trrto7l`}</div>
          </div>
          <div className="price-tag price-tag-second">
            <div className="price-tag-text">{t`features_trade_future_settings_price_protect_ccasalzk67hjvxrg3bvrf`}</div>
          </div>
          <LazyImage src={`${oss_svg_image_domain_address}contract_spread_protection`} hasTheme imageType={'.png'} />
        </div>
        <h3 className="text-base mb-2">{t`features_trade_future_settings_price_protect_642`}</h3>
        <div className="text-text_color_03 mb-8">
          {t`features_trade_future_settings_price_protect_643`}
          <Link href={urlData?.[ContractPreferencesTermsEnum.marginProtection]?.webUrl} className="text-brand_color">
            {t`features_trade_future_settings_price_protect_xkdhd5hukk0ofdxnb5gnu`}
          </Link>
          {t`features_trade_future_settings_price_protect_lmiqazpggsbc3g23xaodr`}
        </div>
        <div className="flex text-xs text-text_color_01">
          <Icon name="prompt-symbol" className="price-protect-icon" />
          <div>{t`features_trade_future_settings_price_protect_645`}</div>
        </div>
      </div>
    </div>
  )
}
