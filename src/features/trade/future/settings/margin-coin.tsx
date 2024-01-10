import { t } from '@lingui/macro'
import classNames from 'classnames'
import Icon from '@/components/icon'
import { useRequest, useMount } from 'ahooks'
import { cloneDeep } from 'lodash'
import NavBar from '@/components/navbar'
import { getIsLogin } from '@/helper/auth'
import { useEffect, useState } from 'react'
import FullTip from '@/features/trade/common/full-tip'
import { Button, Checkbox, Dialog, Toast } from '@nbit/vant'
import { IMarginCoinItem, MarginCoinArrayType } from '@/typings/api/trade'
import CoinDrag from '@/features/trade/future/settings/component/coin-drag'
import CoinSelect from '@/features/trade/future/settings/component/coin-select'
import { getAssetsMarginInfo, setAssetsMarginInfo, marginCoinListPerpetual, getMerAssetsMargin } from '@/apis/trade'
import { useFutureTradeStore } from '@/store/trade/future'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import styles from './index.module.css'

export type ITradeMarginCoinsProps = {
  onChange?: (id: string, checked: boolean) => void
  coins: IMarginCoinItem[]
  checkedIds?: string[]
  checkBoxShape?: 'round' | 'square'
}

/** 用于保证金设置和可用弹窗 */
export function TradeMarginCoins({
  checkBoxShape = 'square',
  onChange,
  coins,
  checkedIds = [],
}: ITradeMarginCoinsProps) {
  // TODO: 汇率计算，这个后续参考资产模块来实现

  return (
    <div className={styles['margin-coins']}>
      {coins.map(coin => {
        const checked = checkedIds.includes(coin.id)
        const emitChange = () => onChange?.(coin.id, !checked)
        return (
          <div key={coin.id} className="coin-item rv-hairline--bottom" onClick={emitChange}>
            <div className="flex">
              {onChange && <Checkbox className="mr-2" shape={checkBoxShape} checked={checked} />}
              <span>{coin.name}</span>
            </div>
            <span>≈{Math.random()} USD</span>
          </div>
        )
      })}
    </div>
  )
}

export type IMarginCoinTabsProps = {
  isOpenContract?: boolean
  onOk?: (isOk: boolean) => void
}

/** 用于保证金设置和可用弹窗 */
export function MarginCoinTabs({ isOpenContract = false, onOk }: IMarginCoinTabsProps) {
  const [isLoad, setIsLoad] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [isButton, setIsButton] = useState<boolean>(false)
  const [checkedAll, setCheckedAll] = useState<boolean>(false)
  const [coinSelectKey, setCoinSelectKey] = useState<string>('no')
  const [coinData, setCoinData] = useState<Array<MarginCoinArrayType>>([])

  const { openContractTransitionDatas, setOpenContractTransitionDatas, setMarginCoinData } = useFutureTradeStore()

  const isLogin = getIsLogin()

  /** 是否在开通合约调不同接口* */
  const onAssetsMarginInfo = async (isLoading: boolean) => {
    const res = await getAssetsMarginInfo({})
    if (res.isOk && res.data) {
      setCoinData(res.data.coinData)
      setCoinSelectKey(res.data.isAvg)
      isLoading &&
        Toast.success({
          message: t`features_user_personal_center_settings_converted_currency_index_587`,
          forbidClick: true,
        })
      isLoading && history.back()
    }
    setLoading(false)
    setIsButton(false)
  }
  const onMerContractMargin = async () => {
    const { data, isOk } = await getMerAssetsMargin({})
    const newData = openContractTransitionDatas?.assetsMarginData?.coinData
    let mergeData: Array<MarginCoinArrayType> = []
    if (newData?.length) {
      mergeData = data?.map(v => {
        const findData = newData.find(item => item.coinId === v.coinId)
        return { ...v, selected: !!findData }
      })
    } else {
      mergeData = data?.map(v => ({ ...v, selected: true }))
    }
    isOk && setCoinData(mergeData)
    setLoading(false)
  }

  const { run: onConfirm } = useRequest(
    async () => {
      isOpenContract ? onMerContractMargin() : onAssetsMarginInfo(false)
    },
    { manual: true }
  )

  const onCheckAll = (checked: boolean) => {
    const data = cloneDeep(coinData)
    data?.forEach(v => (v.selected = checked))
    setCoinData(data)
  }

  /** 扣款类型选择* */
  const onCoinSelectChange = v => {
    setCoinSelectKey(v?.id)
  }

  /** 拖拽* */
  const onCoinDragChange = v => {
    setCoinData(v)
  }

  /** 撤销修改* */
  const undoModification = data => {
    const selectData = cloneDeep(coinData)
    selectData?.forEach(v => {
      const undoModificationData = data.find(item => v.coinName === item.coinName)
      if (undoModificationData) {
        v.selected = true
      }
    })
    setCoinData(selectData)
  }

  /** 点击确认* */
  const onSureChange = async () => {
    setIsButton(true)
    const newCoinData = coinData?.filter(v => v.selected)
    const selectCoinData = newCoinData?.map((item, index) => {
      return {
        sort: index + 1,
        coinId: item.coinId,
      }
    })
    const sureData = {
      isAvg: coinSelectKey,
      coinData: selectCoinData,
    }
    /** 开通合约流程* */
    if (isOpenContract) {
      setOpenContractTransitionDatas({
        assetsMarginData: sureData,
      })
      setMarginCoinData(
        selectCoinData.map(v => {
          return {
            ...v,
            selected: true,
          }
        })
      )
      setIsButton(false)
      onOk && onOk(true)
      return
    }
    /** 在非开通合约流程，查询是否有冻结的保证金币种* */
    const coinRes = await marginCoinListPerpetual({})
    if (!coinRes.isOk && !coinRes.data) {
      return setIsButton(false)
    }
    const coinCurrentList = coinRes.data.list
    const freezenCoinList: Array<MarginCoinArrayType> = []
    coinCurrentList?.forEach(item => {
      const freezenData = newCoinData?.find(v => v.coinName === item.coinName)
      !freezenData && freezenCoinList.push(item)
    })
    if (freezenCoinList?.length) {
      setIsButton(false)
      return Dialog.confirm({
        cancelButtonText: t`common.modal.close`,
        confirmButtonText: t`features_trade_future_settings_margin_coin_5101360`,
        message: (
          <div className="text-left">
            <div className="add-modal-title">{t`features_trade_common_notification_index_510277`}</div>
            <div className="add-modal-content">{t`features_trade_future_settings_margin_coin_5101361`}</div>
            {freezenCoinList?.map(v => {
              return (
                <span key={v.coinId} className="text-brand_color ml-1">
                  {v.coinName}
                </span>
              )
            })}
          </div>
        ),
        className: styles['auto-add-modal'],
      })
        .then(() => {
          undoModification(freezenCoinList)
        })
        .catch(() => {})
    }
    /** 偏好设置保证金币种* */
    const res = await setAssetsMarginInfo(sureData)
    if (!res.isOk && !res.data) {
      return setIsButton(false)
    }
    isLogin && onAssetsMarginInfo(true)
  }

  useEffect(() => {
    const params = coinData?.filter(v => v.selected)
    params && setIsLoad(!params?.length || !coinData?.length)
    params && setCheckedAll(!!coinData.length && params?.length === coinData?.length)
  }, [coinData])

  useMount(() => {
    setLoading(true)
    isLogin && onConfirm && onConfirm()
  })

  return (
    <div className={classNames(styles['margin-coin-tabs-com-wrapper'])}>
      {isOpenContract ? <FullTip message={t`features_trade_future_settings_margin_coin_5101399`} /> : null}
      <CoinSelect data={coinSelectKey} onChange={onCoinSelectChange} />
      <div className="flex-1 overflow-auto">
        <CoinDrag data={coinData} onChange={onCoinDragChange} />
      </div>
      <div className="action">
        <Checkbox
          shape="square"
          checked={checkedAll}
          onChange={onCheckAll}
          className="action-check"
          iconRender={({ checked }) =>
            checked ? (
              <Icon name="login_verify_selected" className="check-icon" />
            ) : (
              <Icon name="login_verify_unselected" hasTheme className="check-icon" />
            )
          }
        >
          <span className="text-text_color_03">{t`features/trade/future/settings/margin-coin-1`}</span>
        </Checkbox>
        <Button type="primary" loading={isButton} onClick={onSureChange} className="w-full rounded" disabled={isLoad}>
          {isOpenContract ? t`user.field.reuse_23` : t`common.confirm`}
        </Button>
      </div>
      <FullScreenLoading mask isShow={loading} />
    </div>
  )
}

export function MarginCoinSetting() {
  return (
    <div className={styles['margin-coin-wrapper']}>
      <NavBar
        title={t`features/trade/future/settings/margin-coin-2`}
        left={<Icon name="back" hasTheme className="margin-coin-icon" />}
      />
      <MarginCoinTabs />
    </div>
  )
}
