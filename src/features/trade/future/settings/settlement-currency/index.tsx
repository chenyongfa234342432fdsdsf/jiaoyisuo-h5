import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import NavBar from '@/components/navbar'
import { getIsLogin, fetchAndUpdateUserInfo } from '@/helper/auth'
import { useEffect, useState } from 'react'
import FullTip from '@/features/trade/common/full-tip'
import { Button, Radio, Toast, Dialog } from '@nbit/vant'
import { useFutureTradeStore } from '@/store/trade/future'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import { UserContractVersionEnum } from '@/constants/trade'
import { ContractSettlementCurrencyType, MarginCoinArrayType } from '@/typings/api/trade'
import {
  getMerClearingCoin,
  getAssetsMarginInfo,
  getMemberClearingCoin,
  getPlatformClearingCoin,
  postMemberOpenContract,
  postMemberContractClearingCoinSettings,
} from '@/apis/trade'
import styles from './index.module.css'

type SettlementCurrencyType = {
  onOk?: (isOk: boolean) => void
  isOpenContract?: boolean
}

enum SettlementEnum {
  first,
}

export function SettlementCurrency({ isOpenContract = false, onOk }: SettlementCurrencyType) {
  const [loading, setLoading] = useState<boolean>(false)
  const [currencyId, setCurrencyId] = useState<number>(SettlementEnum.first)
  const [isButton, setIsButton] = useState<boolean>(false)
  const [coinData, setCoinData] = useState<Array<MarginCoinArrayType>>([])
  const [currencyList, setCurrencyList] = useState<Array<ContractSettlementCurrencyType>>([])

  const isLogin = getIsLogin()
  const { openContractTransitionDatas, setOpenContractTransitionDatas, marginCoinData, setPreference } =
    useFutureTradeStore()

  /** 获取结算币种数据已经选择的结算币* */
  const getClearingCoinList = async (isLoading: boolean) => {
    const platformRes = await getPlatformClearingCoin({})
    if (!platformRes.isOk && !platformRes.data) {
      setLoading(false)
      setIsButton(false)
      return
    }
    setCurrencyList(platformRes.data)
    const assetsRes = await getAssetsMarginInfo({})
    assetsRes.isOk && assetsRes.data && setCoinData(assetsRes.data.coinData)
    const memberRes = await getMemberClearingCoin({})
    if (memberRes.isOk && memberRes.data?.length) {
      const { coinId } = memberRes.data[0]
      setCurrencyId(coinId)
      if (isLoading) {
        setPreference()
        Toast.success({
          message: t`features_user_personal_center_settings_converted_currency_index_587`,
          forbidClick: true,
        })
        history.back()
      }
    }
    setLoading(false)
    setIsButton(false)
  }

  /** 开通合约获取结算币* */
  const getMerPerpetualCoin = async () => {
    const { data, isOk } = await getMerClearingCoin({})
    /** 获取数据时需要知道之前是否有已选择的币种，有则状态置换为选择状态，没有选择第一个 */
    const newData = openContractTransitionDatas?.clearingCoinData
    const currentCoinData = newData?.[SettlementEnum.first] || data?.[SettlementEnum.first]
    const newCurrencyId = currentCoinData?.coinId || SettlementEnum.first
    newCurrencyId && setCurrencyId(newCurrencyId)
    isOk && setCurrencyList(data || [])
    setLoading(false)
  }

  const handleContract = async () => {
    setIsButton(false)
    await setOpenContractTransitionDatas({ clearingCoinData: [{ coinId: currencyId }] })
    // 合约开通，默认基础版
    const res = await postMemberOpenContract({
      ...openContractTransitionDatas,
      clearingCoinData: [{ coinId: currencyId }],
      perpetualVersion: UserContractVersionEnum.base,
    })
    if (res.isOk) {
      fetchAndUpdateUserInfo()
      onOk && onOk(true)
    }
  }

  const handleSubmit = async () => {
    const settlementData = isOpenContract ? marginCoinData : coinData
    if (!settlementData?.length) return
    setIsButton(true)
    const newCoinData: any = settlementData?.filter(v => v.selected).find(item => item.coinId === currencyId)
    if (!newCoinData) {
      setIsButton(false)
      Dialog.confirm({
        confirmButtonText: t`features/trade/future/settings/close-coin-1`,
        showCancelButton: false,
        message: (
          <div className="add-modal-wrap">
            <div>{t`features_trade_future_settings_settlement_currency_index_5101385`}</div>
          </div>
        ),
        className: 'auto-add-modal',
      })
      return
    }
    // 合约开通
    if (isOpenContract) {
      return handleContract()
    }
    const params = { coinId: currencyId }
    const res = await postMemberContractClearingCoinSettings({ coinData: [params] })
    if (!res.isOk && !res.data) {
      return setIsButton(false)
    }
    isLogin && getClearingCoinList(true)
  }

  /** 加载登陆判断* */
  useEffect(() => {
    setLoading(true)
    isLogin && isOpenContract ? getMerPerpetualCoin() : getClearingCoinList(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`${styles.scoped}`}>
      <FullTip message={t`features/trade/future/settings/close-coin-4`} />

      <div className="flex-1 overflow-auto">
        <Radio.Group value={currencyId} onChange={setCurrencyId}>
          {currencyList.map((v, index) => (
            <Radio
              key={index}
              name={v.coinId}
              iconRender={({ checked }) =>
                checked ? (
                  <Icon name="login_agreement_selected" className="settlement-select-icon" />
                ) : (
                  <Icon name="login_agreement_unselected" className="settlement-select-icon" />
                )
              }
            >
              <div className={styles['settlement-currency-setting-checkbox']}>
                <div className="currency">
                  <label>{`1 ${v.coinName}`}</label>
                </div>
                <div className="price">
                  <label>{`≈ ${v?.rate}`}</label>
                  <label>{v?.currencySymbol}</label>
                </div>
              </div>
            </Radio>
          ))}
        </Radio.Group>
      </div>

      <div className="action">
        <Button
          type="primary"
          className="w-full"
          loading={isButton}
          onClick={handleSubmit}
          disabled={!currencyId || isButton}
        >
          {isOpenContract ? t`user.field.reuse_23` : t`user.field.reuse_10`}
        </Button>
      </div>
      <FullScreenLoading mask isShow={loading} />
    </div>
  )
}
export function SettlementCurrencyContair() {
  return (
    <section className={styles['settlement-currency-wrapper']}>
      <NavBar title={t`features_trade_future_settings_index_5101354`} left={<Icon name="back" hasTheme />} />
      <SettlementCurrency />
    </section>
  )
}
