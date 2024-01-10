/**
 * 资产 - 充值
 */
import { t } from '@lingui/macro'
import NavBar from '@/components/navbar'
import Icon from '@/components/icon'
import { getAssetsHistoryPageRoutePath } from '@/helper/route'
import { AssetsCoinRemindSettingTypeEnum, AssetsRouteEnum, MainTypeDepositTypeEnum } from '@/constants/assets'
import { link } from '@/helper/link'
import { usePageContext } from '@/hooks/use-page-context'
import { useEffect, useState } from 'react'
import { useGetState, useUpdateEffect } from 'ahooks'
import { getQuerySubCoinList } from '@/apis/assets/common'
import { AssetsQueryCoinPageListCoinListResp, QuerySubCoinListSubCoinListResp } from '@/typings/api/assets/assets'
import { postDepositAddress } from '@/apis/assets/recharge'
import { requestWithLoading } from '@/helper/order'
import CommonListEmpty from '@/components/common-list/list-empty'
import { getAllCoinList } from '@/helper/assets/spot'
import { AssetsRecordTypeEnum } from '@/constants/assets/common'
import { Type } from '@/components/lazy-image'
import CoinSelection, { ICoin } from '../../common/coin-selection'
import { RechargeCoin } from '../coin'
import { RechargeNetwork } from '../network'
import MainNetwork from '../../common/main-network'
import StopService from '../../common/stop-service'
import { RechargeAddress } from '../address'
import styles from './index.module.css'

function RechargeLayout() {
  const pageContext = usePageContext()
  const [coinVisible, setCoinVisible] = useState(false)
  const [networkVisible, setNetworkVisible] = useState(false)
  const [networkList, setNetworkList] = useState<QuerySubCoinListSubCoinListResp[]>([])
  const [form, setForm, getForm] = useGetState({
    coin: {} as ICoin,
    network: {} as QuerySubCoinListSubCoinListResp,
    address: '',
    hint: '',
    memo: '',
  })

  /**
   * 获取币种下主网列表
   */
  const onLoadNetwork = async () => {
    const { coin } = form
    const res = await getQuerySubCoinList({ coinId: coin.id })

    const { isOk, data } = res || {}
    if (!isOk || !data) return
    setNetworkList(data?.subCoinList)
    setNetworkVisible(true)
  }

  /**
   * 获取充值地址
   */
  const onLoadDepositAddress = async () => {
    const { network } = form
    if (!network?.id || network?.isDeposit === MainTypeDepositTypeEnum.no) return
    const res = await postDepositAddress({ coinId: +network?.id })
    const { isOk, data } = res || {}
    if (!isOk || !data) return

    setForm({ ...getForm(), ...data })
  }

  /**
   * 有主币 id 的情况下去匹配一次数据（币种详情入口）
   */
  const onLoadCoinList = async (id: string) => {
    const res = (await getAllCoinList(AssetsCoinRemindSettingTypeEnum.recharge)) || []
    const newCoin: AssetsQueryCoinPageListCoinListResp =
      res.find(item => item?.id === id) || ({} as AssetsQueryCoinPageListCoinListResp)

    setForm({ ...getForm(), coin: newCoin })
  }

  useEffect(() => {
    const id = pageContext.urlParsed.search?.id
    setCoinVisible(!id)
    id && onLoadCoinList(id)
  }, [])

  useUpdateEffect(() => {
    requestWithLoading(onLoadNetwork(), 0)
  }, [form.coin])

  useUpdateEffect(() => {
    onLoadDepositAddress()
  }, [form.network])

  return (
    <div className={styles['recharge-layout-root']}>
      {form.coin?.id && (
        <div className="recharge-layout-wrap">
          <NavBar
            title={t`assets.enum.tradeRecordType.deposit`}
            right={
              <Icon
                name="asset_record"
                hasTheme
                className="text-xl"
                onClick={() =>
                  link(
                    getAssetsHistoryPageRoutePath(
                      AssetsRouteEnum.coins,
                      AssetsRecordTypeEnum.recharge,
                      form.coin?.id,
                      form.coin?.coinName
                    )
                  )
                }
              />
            }
          />

          <div className="recharge-layout-content">
            <RechargeCoin coin={form.coin} onClick={() => setCoinVisible(true)} />
            <RechargeNetwork network={form.network} onClick={() => setNetworkVisible(true)} />

            {form.network?.id ? (
              <>
                {form.network?.isDeposit && form.network?.isDeposit === MainTypeDepositTypeEnum.no && (
                  <StopService network={form.network} type={AssetsCoinRemindSettingTypeEnum.recharge} />
                )}

                {form.network?.isDeposit && form.network?.isDeposit === MainTypeDepositTypeEnum.yes && (
                  <RechargeAddress data={form} />
                )}
              </>
            ) : (
              <CommonListEmpty
                text={t`features_assets_recharge_layout_index_n3v6ydkwf6`}
                className="recharge-empty"
                imageName="load_fail_icon"
                imageType={Type.svg}
              />
            )}
          </div>
        </div>
      )}

      {coinVisible && (
        <CoinSelection
          activeCoin={form.coin?.id || ''}
          pageType={AssetsCoinRemindSettingTypeEnum.recharge}
          onBack={() => setCoinVisible(false)}
          onCoinChange={(e: ICoin) => {
            e.id !== form.coin?.id && setForm({ ...getForm(), coin: e, network: {} as QuerySubCoinListSubCoinListResp })
            setCoinVisible(false)
          }}
        />
      )}

      {networkVisible && (
        <MainNetwork
          pageType={AssetsCoinRemindSettingTypeEnum.recharge}
          title={t`modules_assets_recharge_index_page_644`}
          desc={t`assets.common.withdraw-network.desc`}
          onCancel={() => setNetworkVisible(false)}
          type="action-sheet"
          networks={networkList}
          onChange={val => {
            if (val === form.network?.id) return
            const newNetwork = networkList.find(item => item.id === val) || ({} as QuerySubCoinListSubCoinListResp)
            setForm({ ...getForm(), network: newNetwork })
            setNetworkVisible(false)
          }}
          value={form.network?.id}
        />
      )}
    </div>
  )
}

export { RechargeLayout }
