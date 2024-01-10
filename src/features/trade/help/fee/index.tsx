import { queryTradeNotifications } from '@/apis/trade'
import NavBar from '@/components/navbar'
import Notification from '@/components/notification'
import { HelpFeeTabTypeEnum } from '@/constants/trade'
import { getAuthModuleRoutes, AuthModuleEnum } from '@/helper/modal-dynamic'
import useApiAllCoinSymbolInfo from '@/hooks/features/market/common/use-api-all-coin-symbol-info'
import { useAssetsStore } from '@/store/assets/spot'
import { ITradeNotification } from '@/typings/api/trade'
import { t } from '@lingui/macro'
import { Tabs } from '@nbit/vant'
import { useMount } from 'ahooks'
import { useState } from 'react'
import { useCommonStore } from '@/store/common'
import { FuturesFee } from './futures'
import styles from './index.module.css'
import { SpotFee } from './spot'
import { WithdrawFee } from './withdraw'

function TradeFeeNotification() {
  const [notifications, setNotifications] = useState<ITradeNotification[]>([])
  const [visible, setVisible] = useState(true)
  const close = async () => {
    setVisible(false)
  }
  useMount(async () => {
    // TODO: 模拟通知数据，预留 UI，一期不做推送
    const res = await queryTradeNotifications({
      operateType: 2,
    } as any)
    setNotifications(res.data!.lampList || [])
  })
  if (!visible || notifications.length === 0) {
    return <></>
  }

  return <Notification notifications={notifications} onClose={close} />
}

type ITradeFeeProps = {
  defaultTab: HelpFeeTabTypeEnum
}

function TradeFee({ defaultTab = HelpFeeTabTypeEnum.withdraw }: ITradeFeeProps) {
  const { isFusionMode } = useCommonStore()
  // 资产数据字典
  const { fetchAssetEnums } = useAssetsStore()
  useMount(fetchAssetEnums)

  const symbolInfo = useApiAllCoinSymbolInfo()
  const [activeTab, setActiveTab] = useState(defaultTab || HelpFeeTabTypeEnum.spot)
  const withdraw = {
    title: t`assets.common.withdraw`,
    id: HelpFeeTabTypeEnum.withdraw,
    content: <WithdrawFee activeTab={activeTab} />,
  }
  const spot = {
    title: t`constants/trade-4`,
    id: HelpFeeTabTypeEnum.spot,
    content: <SpotFee symbolInfo={symbolInfo} activeTab={activeTab} />,
  }
  const futures = {
    title: t`constants/trade-5`,
    id: HelpFeeTabTypeEnum.futures,
    content: <FuturesFee symbolInfo={symbolInfo} activeTab={activeTab} />,
  }
  const tabs = isFusionMode
    ? [withdraw, futures]
    : getAuthModuleRoutes({ withdraw, [AuthModuleEnum.spot]: spot, [AuthModuleEnum.contract]: futures })

  return (
    <div className={styles['trade-fee-wrapper']}>
      <NavBar title={t`features_trade_header_more_features_510285`} />
      {/* <TradeFeeNotification /> */}
      <Tabs defaultActive={defaultTab} align={'start'} sticky onChange={(name: any) => setActiveTab(name)}>
        {tabs.map(tab => (
          <Tabs.TabPane title={tab.title} name={tab.id} key={tab.id}>
            {tab.content}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  )
}

export default TradeFee
