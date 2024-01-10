import { useEffect, useRef, useState } from 'react'
import { t } from '@lingui/macro'

import NavBar from '@/components/navbar'
import Icon from '@/components/icon'

import FullScreenLoading from '@/features/user/components/full-screen-loading'

import { Tabs, Popup, Button } from '@nbit/vant'
import { getSymbolLabelInfo } from '@/apis/market'
import { getV1PerpetualTradePairListApiRequest } from '@/apis/market/futures'

import Spot from './spot'
import Contract from './contract'
import styles from './index.module.css'

export enum vipLevelFundingType {
  spot = 'spot',
  contract = 'contract',
}
function LevelFunding() {
  const [fullScreenLoading, setFullScreenLoading] = useState<boolean>(false)

  const [curCoinList, setCurCoinList] = useState<any>([])
  const [spotList, setSpotList] = useState<any>([])
  const [contractList, setContractList] = useState<any>([])

  const [currentTab, setCurrentTab] = useState<string>(vipLevelFundingType.spot)

  const [spotVisible, setSpotVisible] = useState<boolean>(false)
  const [contractVisible, setContractVisible] = useState<boolean>(false)

  useEffect(() => {
    Promise.all([getSymbolLabelInfo({}), getV1PerpetualTradePairListApiRequest({})]).then(([res, res2]) => {
      if (res.isOk && res.data?.list?.length) {
        setSpotList(res.data?.list)
      }

      if (res2.isOk && res2.data?.list?.length) {
        setContractList(res2.data?.list)
      }
    })
  }, [])

  useEffect(() => {
    if (currentTab === vipLevelFundingType.spot) {
      setCurCoinList(spotList)
    } else {
      setCurCoinList(contractList)
    }
  }, [currentTab, spotList, contractList])

  // 节点缓存
  const tabList = [
    {
      title: (
        <span>
          {t`features_vip_level_fundting_index_eldh69aquf`}
          <Icon
            onClick={e => {
              setSpotVisible(true)
              e.stopPropagation()
            }}
            name="property_icon_tips"
            hasTheme
            className="text-xs ml-1 text-text_color_03"
          />
        </span>
      ),
      content: <Spot list={curCoinList} />,
      id: vipLevelFundingType.spot,
    },
    {
      title: (
        <span>
          {t`features_vip_level_fundting_index_bodotweakd`}
          <Icon
            onClick={e => {
              setContractVisible(true)
              e.stopPropagation()
            }}
            name="property_icon_tips"
            hasTheme
            className="text-xs ml-1 text-text_color_03"
          />
        </span>
      ),
      content: <Contract list={curCoinList} />,
      id: vipLevelFundingType.contract,
    },
  ]

  /** tab 切换 */
  const onTabChange = name => {
    setCurrentTab(name)
    // setCurrentTab(name)
  }

  return (
    <div className={styles.scoped}>
      <NavBar title={t`features_vip_vip_center_index_xvl9rcxhx4`} />
      <div className="content-wrap">
        <Tabs align="start" className="tab" active={currentTab} onChange={onTabChange}>
          {tabList?.map(item => {
            return (
              <Tabs.TabPane key={item.id} title={item.title} name={item.id}>
                <div>{item.content}</div>
              </Tabs.TabPane>
            )
          })}
        </Tabs>
      </div>

      <Popup
        className={styles.notice}
        onClose={() => setSpotVisible(false)}
        style={{ width: '292px' }}
        visible={spotVisible}
      >
        <div className="common-12-content text-text_color_01">
          {t`features_vip_level_fundting_index_5tcgxch9dc`} = {t`features_vip_level_fundting_index_uooj5rjqvo`} *{' '}
          {t`features_vip_level_fundting_index_oi1gfo5hjj`} ( Maker {t`user.third_party_01`} Taker ) *{' '}
          {t`features_vip_level_fundting_index_tujy_ofi1i`}
        </div>

        <Button
          type="primary"
          onClick={() => {
            setSpotVisible(false)
          }}
          className="confirm-button mt-4"
        >
          {t`features_trade_common_notification_index_5101066`}
        </Button>
      </Popup>

      <Popup
        className={styles.notice}
        style={{ width: '292px' }}
        onClose={() => setContractVisible(false)}
        visible={contractVisible}
      >
        <div className="common-12-content text-text_color_01">
          {t`features_vip_level_fundting_index_czppbqwjxu`} = {t`features_vip_level_fundting_index_uooj5rjqvo`} *{' '}
          {t`features_vip_level_fundting_index_oi1gfo5hjj`} ( Maker {t`user.third_party_01`} Taker ) *{' '}
          {t`features_vip_level_fundting_index_tujy_ofi1i`}
        </div>
        <Button
          type="primary"
          onClick={() => {
            setContractVisible(false)
          }}
          className="confirm-button mt-4"
        >
          {t`features_trade_common_notification_index_5101066`}
        </Button>
      </Popup>
      <FullScreenLoading isShow={fullScreenLoading} className="h-screen" />
    </div>
  )
}

export default LevelFunding
