/**
 * 合约账户详情 - 总览模块
 */

import { useState } from 'react'
import { t } from '@lingui/macro'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import Icon from '@/components/icon'
import { link } from '@/helper/link'
import { FuturesDetailsTabEnum } from '@/constants/assets/futures'
import NavBar from '@/components/navbar'
import { GUIDE_ELEMENT_IDS_ENUM } from '@/constants/guide-ids'
import { CommonDigital } from '@/components/common-digital'
import { FuturesOverviewActions } from '../actions'
import { FuturesOverviewAccount } from '../account'
import { FuturesOverviewAssets } from '../assets'

enum FuturesOverviewTabEnum {
  account = 'account',
  assets = 'assets',
}

interface IFuturesOverviewLayoutProps {
  closeDisable: boolean
  onClick: () => void
  onFlashClose: () => void
  onRevision: () => void
  onSetAutoAddMargin: () => void
  onEditName: () => void
}

function FuturesOverviewLayout(props: IFuturesOverviewLayoutProps) {
  const {
    futuresDetails: { details },
    updateFuturesDetails,
  } = useAssetsFuturesStore()

  const [activeTab, setActiveTab] = useState(FuturesOverviewTabEnum.account)

  return (
    <div className="futures-overview-layout-wrap">
      <div className="futures-overview-intro-wrap" id={GUIDE_ELEMENT_IDS_ENUM.futureAccountDetailAccountOverview}>
        <NavBar
          title={
            <div onClick={props.onEditName} className="navbar-wrap">
              <div className="navbar-title">{details.groupName}</div>
              <Icon name="rebate_edit" hasTheme className="text-sm ml-2 flex-1" />
            </div>
          }
          right={<Icon name="asset_record" hasTheme className="header-icon" />}
          onClickRight={() => link(`/assets/futures/history/${details.groupId}/${details.groupName}`)}
          onClickLeft={() => {
            updateFuturesDetails({ activeTab: FuturesDetailsTabEnum.position })
            history.back()
          }}
        />

        <div className="overview-tabs-wrap">
          <div className="overview-tabs">
            <div className="tabs-cell">
              <div
                className={`tab-cell ${activeTab === FuturesOverviewTabEnum.account && 'active-tab-cell'}`}
                onClick={() => setActiveTab(FuturesOverviewTabEnum.account)}
              >{t`features_assets_futures_futures_details_overview_layout_index_khogo8k83p`}</div>
              <div
                className={`tab-cell ${activeTab === FuturesOverviewTabEnum.assets && 'active-tab-cell'}`}
                onClick={() => setActiveTab(FuturesOverviewTabEnum.assets)}
              >{t`features_assets_futures_futures_details_overview_layout_index__ayvx3qono`}</div>
            </div>
          </div>
        </div>

        <div className="overview-wrap">
          {activeTab === FuturesOverviewTabEnum.account && <FuturesOverviewAccount {...props} />}
          {activeTab === FuturesOverviewTabEnum.assets && <FuturesOverviewAssets />}
        </div>
      </div>

      <FuturesOverviewActions {...props} />
    </div>
  )
}

export { FuturesOverviewLayout }
