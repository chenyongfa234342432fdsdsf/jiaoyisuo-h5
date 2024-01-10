/**
 * 合约 - 合约组记录
 */
import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { useMount } from 'ahooks'
import { Tabs, Toast } from '@nbit/vant'
import NavBar from '@/components/navbar'
import { usePageContext } from '@/hooks/use-page-context'
import { FuturesHistoryTabEnum } from '@/constants/assets/futures'
import { useAssetsStore } from '@/store/assets/spot'
import { AssetsRecordTypeEnum } from '@/constants/assets/common'
import { getRecordsCoinList } from '@/apis/assets/financial-records'
import { AssetsRouteEnum } from '@/constants/assets'
import { onSortArray } from '@/helper/assets/spot'
import { AssetsRecordsCoinListReq, RecordsCoinListResp } from '@/typings/api/assets/assets'
import { getFuturesCurrencySettings } from '@/helper/assets/futures'
import { FuturesHistoryContent } from './futures-history-content'
import styles from './index.module.css'
import { AssetsSelection } from '../../common/assets-selection'

function FuturesHistoryLayout() {
  const pageContext = usePageContext()

  // 资产数据字典
  const { fetchAssetEnums } = useAssetsStore()
  useMount(fetchAssetEnums)

  const [groupInfo, setGroupInfo] = useState({
    groupId: '',
    groupName: '--',
  })

  const [activeTab, setActiveTab] = useState<string | number>(FuturesHistoryTabEnum.futures)
  const [formData, setFormData] = useState({
    futures: {
      coin: {},
      type: '',
    },
    margin: {
      coin: {},
      type: '',
    },
  })
  const [showAssetsSelect, setShowAssetsSelect] = useState(false)
  const [coinList, setCoinList] = useState<RecordsCoinListResp[]>([])

  /**
   * 资产选择
   * 查询资产选择列表
   */
  const onSelectAssets = async () => {
    const params: AssetsRecordsCoinListReq = {
      logType: AssetsRouteEnum.contract,
      groupId: groupInfo.groupId,
    }

    if (activeTab === FuturesHistoryTabEnum.margin) {
      params.type = [
        AssetsRecordTypeEnum.extractBond,
        AssetsRecordTypeEnum.rechargeBond,
        AssetsRecordTypeEnum.futuresTransfer,
      ].toString()
    }

    const res = await getRecordsCoinList(params)
    const { isOk, data, message = '' } = res || {}
    if (!isOk) {
      Toast.info(message)
      return
    }

    if (data?.coinList && data?.coinList.length > 0) {
      setCoinList(data.coinList.sort(onSortArray))
    }

    setShowAssetsSelect(true)
  }

  const tabs = [
    {
      title: t`features_assets_futures_futures_history_index_bfcthsiawmjmeder_bxoc`,
      id: FuturesHistoryTabEnum.futures,
    },
    {
      title: t`features_assets_futures_futures_history_index_bsbiu7bm3ytl51quaaqa0`,
      id: FuturesHistoryTabEnum.margin,
    },
  ]

  useEffect(() => {
    setGroupInfo({
      groupId: pageContext.routeParams.id,
      groupName: pageContext.routeParams.name,
    })
    getFuturesCurrencySettings()
  }, [])

  return (
    <div className={styles['futures-history-wrapper']}>
      <NavBar
        title={t({
          id: 'features_assets_futures_futures_history_index_glxizzeszn7iyjdaaf01y',
          values: { 0: groupInfo.groupName },
        })}
      />

      <Tabs align="center" onChange={(name: string | number) => setActiveTab(name)}>
        {tabs.map(({ title, id }) => (
          <Tabs.TabPane title={title} name={id} key={id}>
            {activeTab === id && (
              <FuturesHistoryContent
                type={id}
                formData={id === FuturesHistoryTabEnum.futures ? formData.futures : formData.margin}
                groupId={pageContext.routeParams.id}
                onChangeData={e => setFormData({ ...formData, [activeTab]: { ...e } })}
                onSelectAssets={onSelectAssets}
              />
            )}
          </Tabs.TabPane>
        ))}
      </Tabs>

      {showAssetsSelect && (
        <AssetsSelection
          visible={showAssetsSelect}
          allList={coinList}
          coinId={formData[activeTab]?.coin?.id}
          onSelect={(coin?: RecordsCoinListResp) => {
            setFormData({ ...formData, [activeTab]: { ...formData[activeTab], coin: coin || null } })
            setShowAssetsSelect(false)
          }}
          onClose={() => setShowAssetsSelect(false)}
        />
      )}
    </div>
  )
}

export { FuturesHistoryLayout }
