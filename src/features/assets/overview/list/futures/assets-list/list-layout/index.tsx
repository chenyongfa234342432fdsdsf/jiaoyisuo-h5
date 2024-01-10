/**
 * 资产总览 - 合约资产列表
 */

import CommonList from '@/components/common-list/list'
import { useAssetsStore } from '@/store/assets/spot'
import { useBaseGuideMapStore } from '@/store/server'
import { GuideMapShowEnum } from '@/constants/common'
import { FuturesAssetsCell } from '../list-cell'

function FuturesAssetsList() {
  const { futuresAssetsMarginList = [] } = useAssetsStore().assetsModule || {}
  const { guideMap } = useBaseGuideMapStore()

  return (
    <CommonList
      finished
      showEmpty={futuresAssetsMarginList.length === 0}
      listChildren={futuresAssetsMarginList.map((item, index) => {
        return (
          <FuturesAssetsCell
            key={index}
            data={item}
            isExpand={
              guideMap?.contract_asset_list_margin === GuideMapShowEnum.yes && index === 0 && item.groupList.length > 0
            }
          />
        )
      })}
    />
  )
}

export { FuturesAssetsList }
