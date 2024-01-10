/**
 * 资产划转
 */
import { t } from '@lingui/macro'
import { Button, Input, Toast } from '@nbit/vant'
import { useEffect, useState } from 'react'
import { useGetState, useUpdateEffect } from 'ahooks'
import NavBar from '@/components/navbar'
import Icon from '@/components/icon'
import LazyImage from '@/components/lazy-image'
import { AssetsRecordTypeEnum, AssetsTransferTypeEnum } from '@/constants/assets/common'
import { usePageContext } from '@/hooks/use-page-context'
import {
  getPerpetualAssetsTransferAccount,
  getPerpetualAssetsTransferCurrency,
  postPerpetualAssetsTransfer,
} from '@/apis/assets/futures/transfer'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import {
  DetailMarginListChild,
  IPerpetualAssetsTransferAccountList,
  PerpetualAssetsTransferReq,
} from '@/typings/api/assets/futures'
import { getPerpetualGroupMarginList } from '@/apis/assets/futures/overview'
import { CoinListResp } from '@/typings/api/assets/assets'
import { requestWithLoading } from '@/helper/order'
import { link } from '@/helper/link'
import { getAssetsHistoryPageRoutePath } from '@/helper/route'
import { AssetsRouteEnum } from '@/constants/assets'
import { onSetPositionOffset } from '@/helper/assets/futures'
import { getCoinPrecision } from '@/helper/assets/spot'
import { TransferSelector } from '../transfer-selector'
import { CoinSelector } from '../coin-selector'
import styles from './index.module.css'

export enum ITransferAccountTypeEnum {
  /** 合约组 */
  group = 'group',
  /** 交易账户 */
  asset = 'asset',
  /** 新建 */
  new = 'new',
}

function AssetsFuturesTransfer() {
  const pageContext = usePageContext().urlParsed.search || {}
  const currentGroup = pageContext?.groupId
  const { assetsTransfer, updateAssetsTransfer } = useAssetsFuturesStore()
  const indexList = [1, 2, 3, 4, 5, 6]
  const [coinVisible, setCoinVisible] = useState(false) // 是否展示选择币种
  const [isChangeDirection, setIsChangeDirection] = useState(true) // 是否可以改变划转方向
  const [form, setForm, getForm] = useGetState({
    /** 划转类型 */
    type: pageContext?.type || AssetsTransferTypeEnum.to,
    /** 划转币种 */
    coin: {} as DetailMarginListChild | CoinListResp,
    /** 来源账户 */
    fromAccount: {
      groupId: pageContext?.type === AssetsTransferTypeEnum.from ? currentGroup : '',
      type:
        pageContext?.type === AssetsTransferTypeEnum.from
          ? ITransferAccountTypeEnum.group
          : ITransferAccountTypeEnum.asset,
    } as IPerpetualAssetsTransferAccountList,
    /** 目标账户 */
    toAccount: {
      groupId: pageContext?.type === AssetsTransferTypeEnum.to ? currentGroup : '',
      type:
        pageContext?.type === AssetsTransferTypeEnum.to
          ? ITransferAccountTypeEnum.group
          : ITransferAccountTypeEnum.asset,
    } as IPerpetualAssetsTransferAccountList,
    amount: '',
  })
  const [transferProps, setTransferProps] = useState({
    visible: false,
    type: AssetsTransferTypeEnum.from,
    groupId: '',
    contrastGroupId: '',
  })

  /**
   * 获取划转账户列表
   */
  const onLoadAccountList = async (coinId: string) => {
    const { fromAccount, toAccount } = { ...getForm() }
    const res = await getPerpetualAssetsTransferAccount({ coinId })
    const { isOk, data } = res || {}
    if (!isOk || !data) return

    const newAccountList = data?.list.map(item => {
      item.groupId ? (item.type = ITransferAccountTypeEnum.group) : (item.type = ITransferAccountTypeEnum.asset)
      return item
    })

    // 来源账户
    const newFromAccount =
      newAccountList.find(item =>
        fromAccount.groupId ? fromAccount.groupId === item.groupId : item.type === ITransferAccountTypeEnum.asset
      ) || ({} as IPerpetualAssetsTransferAccountList)

    // 目标账户
    let newToAccount = toAccount
    if (toAccount.type !== ITransferAccountTypeEnum.new)
      newToAccount =
        newAccountList.find(item =>
          toAccount.groupId ? toAccount.groupId === item.groupId : item.type === ITransferAccountTypeEnum.asset
        ) || ({} as IPerpetualAssetsTransferAccountList)

    setForm({
      ...getForm(),
      fromAccount: newFromAccount,
      toAccount: newToAccount,
    })
    updateAssetsTransfer({ accountList: data?.list })
  }

  /**
   * 获取逐仓保证金币种列表
   */
  const onLoadFuturesCoinList = async () => {
    const res = await getPerpetualGroupMarginList({ groupId: form.fromAccount?.groupId || currentGroup })

    const { isOk, data } = res || {}
    if (!isOk || !data) return []
    return data?.list || []
  }

  /**
   * 获取现货币种列表
   */
  const onLoadSpotCoinList = async () => {
    const res = await getPerpetualAssetsTransferCurrency({})
    const { isOk, data } = res || {}

    if (!isOk || !data) return []
    return data?.list || []
  }

  /**
   * 获取划转币种列表
   * 交易账户获取现货币种列表
   * 逐仓账户获取合约保证金币种列表
   */
  const onLoadCoinList = async () => {
    const newList: DetailMarginListChild[] | any = getForm().fromAccount.groupId
      ? await onLoadFuturesCoinList()
      : await onLoadSpotCoinList()

    let newCoin
    if (getForm().coin?.symbol) {
      newCoin = newList.find(item => item.symbol === getForm().coin?.symbol) || newList[0]
    } else {
      newCoin = newList.find(item => item.symbol === pageContext.symbol) || newList[0]
    }
    updateAssetsTransfer({ coinList: newList })
    setForm({ ...getForm(), coin: newCoin })
  }

  /**
   * 资金划转
   */
  const onAssetsTransfer = async () => {
    if (+form.amount > +form.fromAccount.amount) {
      Toast.info(t`features_assets_futures_assets_transfer_transfer_layout_index_gl2bcp3kq2ul0l61shcnv`)
      return
    }
    const params: PerpetualAssetsTransferReq = {
      fromGroupId: form.fromAccount.groupId,
      coinId: form.coin.coinId,
      amount: form.amount,
      fromType: !form.fromAccount.groupId ? ITransferAccountTypeEnum.asset : '',
      toType:
        !form.toAccount.groupId && !form.toAccount.coinId
          ? ITransferAccountTypeEnum.group
          : !form.toAccount.groupId
          ? ITransferAccountTypeEnum.asset
          : '',
      toGroupId: form.toAccount.groupId,
    }

    if (!params.fromGroupId) delete params.fromGroupId
    if (!params.toGroupId) delete params.toGroupId
    if (!params.fromType) delete params.fromType
    if (!params.toType) delete params.toType

    const res = await postPerpetualAssetsTransfer(params)
    const { isOk, data } = res || {}
    if (!isOk || !data) return

    if (data.isSuccess) {
      Toast.info(t`features_c2c_center_capital_transfer_index_s9yfftnsefjl9kltj4ocj`)
      history.back()
    } else {
      Toast.info(t`features_assets_futures_assets_transfer_transfer_layout_index_moihfcu1jxffa1upe-oxl`)
    }
  }

  useEffect(() => {
    requestWithLoading(onLoadCoinList(), 0)
  }, [])

  useUpdateEffect(() => {
    onLoadAccountList(form.coin?.coinId)
  }, [form.coin.coinId])

  useUpdateEffect(() => {
    setIsChangeDirection(!!(form.toAccount.totalAmount && +form.toAccount.totalAmount > 0))
  }, [form.toAccount])

  useUpdateEffect(() => {
    onLoadCoinList()
  }, [form.type, form.fromAccount.groupId])

  const onRenderCurrentTag = () => {
    return (
      <div className="current-tag">
        <span className="current-tag-text">{t`features/trade/common/lever/index-1`}</span>
      </div>
    )
  }

  const onRenderNewTag = () => {
    return (
      <div className="new-tag">
        <span className="new-tag-text">{t`features_assets_futures_assets_transfer_transfer_layout_index_e4yxwxgmj5trmaarrjiia`}</span>
      </div>
    )
  }

  return (
    <div className={styles['assets-transfer-root']}>
      <NavBar
        title={t`modules_assets_asset_transfer_index_page_jcc5w9apof-1nhg9yfo2j`}
        right={
          <Icon
            name="asset_record"
            hasTheme
            className="text-xl"
            onClick={() =>
              link(getAssetsHistoryPageRoutePath(AssetsRouteEnum.contract, AssetsRecordTypeEnum.futuresTransfer))
            }
          />
        }
      />

      <div className="assets-transfer-content">
        <div className="transfer-content">
          <div className="transfer-index">
            <div className="to-index" />
            {indexList.map(item => {
              return <div key={item} className="spacer" />
            })}
            <div className="from-index" />
          </div>

          <div className="transfer-account">
            <div
              className="account-cell"
              onClick={() =>
                setTransferProps({
                  visible: true,
                  groupId: form.fromAccount.groupId,
                  type: AssetsTransferTypeEnum.from,
                  contrastGroupId: form.toAccount.groupId,
                })
              }
            >
              <span className="account-index">{t`features_trade_future_c2c_22225101592`}</span>
              <div className="account-info">
                <span className="account-name">
                  {form.fromAccount.groupName || t`features_trade_future_c2c_22225101593`}
                </span>
                {form.fromAccount.groupId === currentGroup && onRenderCurrentTag()}
              </div>

              <Icon name="regsiter_icon_drop" hasTheme className="account-icon" />
            </div>

            <div className="account-spacer" />
            <div
              className="account-cell"
              onClick={() =>
                setTransferProps({
                  visible: true,
                  groupId: form.toAccount.groupId,
                  type: AssetsTransferTypeEnum.to,
                  contrastGroupId: form.fromAccount.groupId,
                })
              }
            >
              <span className="account-index">{t`features_kyc_up_load_index_5101215`}</span>
              <div className="account-info">
                <span className="account-name">
                  {form.toAccount.groupName || t`features_trade_future_c2c_22225101593`}
                </span>
                {form.toAccount.groupId === currentGroup && onRenderCurrentTag()}
                {!form.toAccount.groupId && !form.toAccount.coinId && onRenderNewTag()}
              </div>

              <Icon name="regsiter_icon_drop" hasTheme className="account-icon" />
            </div>
          </div>

          <Icon
            name={isChangeDirection ? 'switch' : 'switch_disable'}
            hasTheme={!isChangeDirection}
            className="transfer-icon"
            onClick={() => {
              if (!isChangeDirection) return

              const newFrom = { ...getForm() }

              setForm({
                ...newFrom,
                fromAccount: newFrom.toAccount,
                toAccount: newFrom.fromAccount,
                type:
                  newFrom.type === AssetsTransferTypeEnum.from
                    ? AssetsTransferTypeEnum.to
                    : AssetsTransferTypeEnum.from,
                amount: '',
              })
            }}
          />
        </div>

        <div className="transfer-coin" onClick={() => setCoinVisible(assetsTransfer?.coinList.length > 1)}>
          <span className="coin-title">{t`constants_c2c_common_iglude2ha-gaj2qgdfoqi`}</span>
          <div className="coin-cell">
            <div className="coin-info">
              <LazyImage src={form.coin?.appLogo} width={20} height={20} />
              <span className="coin-name">{form.coin?.coinName}</span>
            </div>

            <Icon name="next_arrow" hasTheme className="text-base" />
          </div>
        </div>

        <div className="transfer-cell">
          <Input
            placeholder={t`features_assets_futures_common_withdraw_modal_index_5101412`}
            className="transfer-input"
            value={form.amount}
            onChange={val =>
              setForm({
                ...getForm(),
                amount: onSetPositionOffset(val.replace(/[^\d.]/g, ''), getCoinPrecision(form.coin.symbol)),
              })
            }
          />

          <div className="transfer-info">
            <span className="info-name">{form.coin?.coinName}</span>
            <span className="info-spacer">丨</span>
            <span className="info-btn" onClick={() => setForm({ ...getForm(), amount: form.fromAccount?.amount })}>
              {t`features_trade_future_c2c_22225101596`}
            </span>
          </div>
        </div>

        <div className="transfer-max">
          <span className="max-label">{t`features_trade_future_c2c_22225101595`}</span>
          <span className="max-num">
            {form.fromAccount.amount || '--'} {form.fromAccount.coinName}
          </span>
        </div>
      </div>

      <div className="commit-cell">
        <Button
          type="primary"
          className="commit-btn"
          onClick={() => requestWithLoading(onAssetsTransfer(), 0)}
          disabled={!form.amount || +form.amount <= 0}
        >
          {t`user.field.reuse_17`}
        </Button>
      </div>

      {transferProps.visible && (
        <TransferSelector
          {...transferProps}
          onClose={() =>
            setTransferProps({
              ...transferProps,
              visible: false,
            })
          }
          onSelect={e => {
            const newForm =
              transferProps.type === AssetsTransferTypeEnum.from
                ? { ...getForm(), fromAccount: e, amount: '' }
                : { ...getForm(), toAccount: e }

            setForm(newForm)
            setTransferProps({
              visible: false,
              type: AssetsTransferTypeEnum.from,
              groupId: '',
              contrastGroupId: '',
            })
          }}
        />
      )}

      {coinVisible && (
        <CoinSelector
          coinId={form.coin?.coinId}
          visible={coinVisible}
          onClose={() => setCoinVisible(false)}
          onSelect={e => {
            setForm({ ...getForm(), coin: e, amount: '' })
            setCoinVisible(false)
          }}
        />
      )}
    </div>
  )
}

export { AssetsFuturesTransfer }
