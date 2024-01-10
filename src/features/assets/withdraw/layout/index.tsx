/**
 * 资产 - 提币
 */
import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { useUnmount, useUpdateEffect } from 'ahooks'
import NavBar from '@/components/navbar'
import Icon from '@/components/icon'
import { link } from '@/helper/link'
import { getAssetsHistoryPageRoutePath } from '@/helper/route'
import {
  AssetsCoinRemindSettingTypeEnum,
  AssetsRouteEnum,
  AssetsWithdrawTypeEnum,
  MainTypeMemoTypeEnum,
  MainTypeWithdrawTypeEnum,
} from '@/constants/assets'
import { usePageContext } from '@/hooks/use-page-context'
import { AssetsQueryCoinPageListCoinListResp, QuerySubCoinListSubCoinListResp } from '@/typings/api/assets/assets'
import { requestWithLoading } from '@/helper/order'
import { getQuerySubCoinList } from '@/apis/assets/common'
import { postWithdrawCoinInfo } from '@/apis/assets/withdraw'
import { defaultWithdrawForm, useAssetsStore } from '@/store/assets/spot'
import { getAllCoinList, onGetWithdrawAddress, onVerifyAddress } from '@/helper/assets/spot'
import { decimalUtils } from '@nbit/utils'
import { AssetsRecordTypeEnum } from '@/constants/assets/common'
import CoinSelection, { ICoin } from '../../common/coin-selection'
import { WithdrawCoin } from '../coin'
import MainNetwork from '../../common/main-network'
import styles from './index.module.css'
import { WithdrawType } from '../type'
import { WithdrawPayUid } from '../pay-uid'
import StopService from '../../common/stop-service'
import { WithdrawAmount } from '../amount'
import { WithdrawHint } from '../hint'
import { WithdrawChainForm } from '../chain-form'
import { WithdrawOperate } from '../operate'
import { WithdrawNetwork } from '../network'
import { WithdrawTypeModal } from '../type-modal'

function WithdrawLayout() {
  const pageContext = usePageContext()
  const { formData, amountInfo, updateWithdrawModule } = useAssetsStore().withdrawModule || {}
  const [coinVisible, setCoinVisible] = useState(true)
  const [networkVisible, setNetworkVisible] = useState(false)
  const [networkList, setNetworkList] = useState<QuerySubCoinListSubCoinListResp[]>([])
  const [verify, setVerify] = useState(false)
  const [typeVisible, setTypeVisible] = useState(false)

  /**
   * 获取币种下主网列表
   */
  const onLoadNetwork = async () => {
    const { coin } = formData
    const res = await getQuerySubCoinList({ coinId: coin.id })

    const { isOk, data } = res || {}
    if (!isOk || !data) return
    setNetworkList(data?.subCoinList)
    setNetworkVisible(true)
  }

  /**
   * 获取提币信息
   */
  const onLoadWithdrawInfo = async () => {
    const res = await postWithdrawCoinInfo({
      coinId: formData.type === AssetsWithdrawTypeEnum.blockchain ? +formData.network.id : +formData.coin.id,
      type: formData.type,
    })

    const { isOk, data } = res || {}
    if (!isOk || !data) return

    updateWithdrawModule({ amountInfo: data })
  }

  /**
   * 获取提币地址列表
   */
  const onLoadWithdrawAddress = async () => {
    updateWithdrawModule({ addressList: await onGetWithdrawAddress() })
  }

  /**
   * 查询币种列表（带币种 ID 入口）
   */
  const onLoadCoinList = async (id: string) => {
    const res = (await getAllCoinList(AssetsCoinRemindSettingTypeEnum.withdraw)) || []
    const newCoin: AssetsQueryCoinPageListCoinListResp =
      res.find(item => item?.id === id) || ({} as AssetsQueryCoinPageListCoinListResp)

    updateWithdrawModule({ formData: { ...formData, coin: newCoin } })
    setTypeVisible(true)
  }

  useEffect(() => {
    const id = pageContext.urlParsed.search?.id
    setCoinVisible(!id)
    id && onLoadCoinList(id)
  }, [])

  useUpdateEffect(() => {
    if (!formData.type) return
    if (formData.type === AssetsWithdrawTypeEnum.blockchain) {
      requestWithLoading(onLoadNetwork(), 0)
      onLoadWithdrawAddress()

      return
    }

    requestWithLoading(onLoadWithdrawInfo(), 0)
  }, [formData.coin])

  useUpdateEffect(() => {
    formData.network?.id && onLoadWithdrawInfo()
    formData.type === AssetsWithdrawTypeEnum.platform && onLoadWithdrawInfo()
  }, [formData.network?.id, formData.type])

  useUpdateEffect(() => {
    const { type, amount, address, uid, network, memo, addressVerify } = formData || {}
    let newVerify = true

    newVerify = !!type

    if (type === AssetsWithdrawTypeEnum.blockchain) {
      newVerify =
        !!addressVerify &&
        !!amount &&
        +amount > 0 &&
        !!address &&
        !!network?.id &&
        (!(network?.isUseMemo === MainTypeMemoTypeEnum.yes) || !!memo) &&
        (!(amountInfo?.feeSymbol === formData.coin?.symbol) ||
          Number(decimalUtils.SafeCalcUtil.sub(amount, amountInfo.fee)) >= 0)
    }

    if (type === AssetsWithdrawTypeEnum.platform) {
      newVerify = !!uid && !!amount && +amount > 0
    }

    setVerify(newVerify)
  }, [formData, amountInfo])

  useUnmount(() => {
    updateWithdrawModule({ formData: defaultWithdrawForm, amountInfo: {} })
  })

  return (
    <div className={styles['withdraw-layout-root']}>
      {formData.coin?.id && (
        <div className="withdraw-layout-wrap">
          <NavBar
            title={t`assets.withdraw.title`}
            right={
              <Icon
                name="asset_record"
                hasTheme
                className="text-xl"
                onClick={() =>
                  link(
                    getAssetsHistoryPageRoutePath(
                      AssetsRouteEnum.coins,
                      formData.type === AssetsWithdrawTypeEnum.blockchain
                        ? AssetsRecordTypeEnum.extract
                        : AssetsRecordTypeEnum.pay,
                      formData.coin?.id,
                      formData.coin?.coinName
                    )
                  )
                }
              />
            }
          />

          <div className="withdraw-layout-content">
            <WithdrawCoin coin={formData.coin} onClick={() => setCoinVisible(true)} />
            <WithdrawType type={formData.type} onClick={() => setTypeVisible(true)} />

            {formData.type === AssetsWithdrawTypeEnum.platform && (
              <WithdrawPayUid
                onChangeUid={(uid: string) => updateWithdrawModule({ formData: { ...formData, uid: uid.trim() } })}
              />
            )}

            {formData.type === AssetsWithdrawTypeEnum.blockchain && (
              <>
                {formData.network?.isWithdraw === MainTypeWithdrawTypeEnum.no ? (
                  <>
                    <WithdrawNetwork onChangeNetwork={() => setNetworkVisible(true)} />
                    <StopService
                      hint={t`features_assets_withdraw_withdraw_form_510112`}
                      network={formData.network}
                      type={AssetsCoinRemindSettingTypeEnum.withdraw}
                    />
                  </>
                ) : (
                  <WithdrawChainForm
                    onChangeAddress={(address: string, addressVerify = true) =>
                      updateWithdrawModule({ formData: { ...formData, address: address.trim(), addressVerify } })
                    }
                    onChangeNetwork={() => setNetworkVisible(true)}
                    onLoadList={() => onLoadWithdrawAddress()}
                    onChangeMemo={(memo: string) =>
                      updateWithdrawModule({ formData: { ...formData, memo: memo.trim() } })
                    }
                  />
                )}
              </>
            )}

            {formData.network?.isWithdraw !== MainTypeWithdrawTypeEnum.no && (
              <WithdrawAmount
                onChangeAmount={(amount: string) =>
                  updateWithdrawModule({ formData: { ...formData, amount: amount.trim() } })
                }
              />
            )}

            {formData.network?.isWithdraw !== MainTypeWithdrawTypeEnum.no && <WithdrawHint />}
          </div>

          {formData.network?.isWithdraw !== MainTypeWithdrawTypeEnum.no && <WithdrawOperate verify={verify} />}
        </div>
      )}

      {coinVisible && (
        <CoinSelection
          withdrawType={formData.type}
          activeCoin={formData.coin?.id || ''}
          pageType={AssetsCoinRemindSettingTypeEnum.withdraw}
          onBack={() => setCoinVisible(false)}
          onCoinChange={(e: ICoin, type?: number) => {
            let newForm = { ...formData }
            if (type) newForm = { ...newForm, type }
            if (e.id !== formData.coin?.id)
              newForm = {
                ...newForm,
                coin: e,
                network: {} as QuerySubCoinListSubCoinListResp,
                address: '',
                memo: '',
                uid: '',
                amount: '',
                addressVerify: true,
              }
            updateWithdrawModule({ formData: newForm })
            setCoinVisible(false)
          }}
        />
      )}

      {networkVisible && (
        <MainNetwork
          pageType={AssetsCoinRemindSettingTypeEnum.withdraw}
          title={t`assets.common.withdraw-network.title`}
          desc={t`assets.common.withdraw-network.desc`}
          onCancel={() => setNetworkVisible(false)}
          type="action-sheet"
          networks={networkList}
          onChange={async val => {
            setNetworkVisible(false)
            if (val === formData.network?.id) return
            const newNetwork = networkList.find(item => item.id === val) || ({} as QuerySubCoinListSubCoinListResp)

            let addressVerify = true
            if (formData.address) addressVerify = await onVerifyAddress(newNetwork?.symbol, formData.address)
            updateWithdrawModule({ formData: { ...formData, network: newNetwork, addressVerify } })
          }}
          value={formData.network?.id}
        />
      )}

      <WithdrawTypeModal
        visible={typeVisible}
        type={formData.type || AssetsWithdrawTypeEnum.platform}
        onClose={() => setTypeVisible(false)}
        onConfirm={(type: number) => {
          updateWithdrawModule({ formData: { ...formData, type } })

          if (type === AssetsWithdrawTypeEnum.blockchain) {
            requestWithLoading(onLoadNetwork(), 0)
            onLoadWithdrawAddress()
          }
        }}
      />
    </div>
  )
}

export { WithdrawLayout }
