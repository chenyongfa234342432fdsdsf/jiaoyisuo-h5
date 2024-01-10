/**
 * 资产总览 - 合约
 */
import { t } from '@lingui/macro'
import { Tabs } from '@nbit/vant'
import { FuturesOverviewTabTypeEnum } from '@/constants/assets/futures'
import { useAssetsStore } from '@/store/assets/spot'
import { useUpdateEffect } from 'ahooks'
import { onGetContractOverview } from '@/helper/assets/overview'
import { useCommonStore } from '@/store/common'
import { FuturesPositionList } from '../futures-list/list-layout'
import { FuturesAssetsList } from '../assets-list/list-layout'
import styles from './index.module.css'

function FuturesListLayout() {
  const { isFusionMode } = useCommonStore()
  const { futuresActiveTab, updateAssetsModule } = useAssetsStore().assetsModule || {}

  const tabList = [
    {
      title: t`features_assets_overview_list_futures_futures_layout_index_zdvdlvoazd`,
      id: FuturesOverviewTabTypeEnum.isolated,
      content: <FuturesPositionList showUnit={!isFusionMode} />,
    },
    {
      title: t`features_assets_futures_futures_details_index_0v_1bd-c13k3skave7hyl`,
      id: FuturesOverviewTabTypeEnum.assets,
      content: <FuturesAssetsList />,
    },
  ]

  useUpdateEffect(() => {
    onGetContractOverview()
  }, [futuresActiveTab])

  return (
    <Tabs
      align="start"
      className={styles['futures-layout-root']}
      active={futuresActiveTab}
      onClickTab={async (params: any) => updateAssetsModule({ futuresActiveTab: params.name })}
    >
      {tabList.map(({ title, id, content }) => (
        <Tabs.TabPane title={title} name={id} key={id}>
          {content}
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
}

export { FuturesListLayout }
