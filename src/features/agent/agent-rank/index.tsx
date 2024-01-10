import { useEffect, useState } from 'react'

import { oss_svg_image_domain_address } from '@/constants/oss'
import LazyImage from '@/components/lazy-image'
import { getV1AgtRebateInfoHistoryGetTopApiRequest } from '@/apis/agent'
import { YapiGetV1AgtRebateInfoHistoryGetTopListProfitListData } from '@/typings/yapi/AgtRebateInfoHistoryGetTopV1GetApi'
import { Button, Popup } from '@nbit/vant'
import { t } from '@lingui/macro'
import NavBar from '@/components/navbar'
import CommonListEmpty from '@/components/common-list/list-empty'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import { I18nsEnum } from '@/constants/i18n'
import { useCommonStore } from '@/store/common'
import Styles from './index.module.css'

function AgentRank() {
  const [profitList, setProfitList] = useState<Array<YapiGetV1AgtRebateInfoHistoryGetTopListProfitListData>>([])
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false)
  const [fullScreenLoading, setFullScreenLoading] = useState<boolean>(false)
  const getInviteApi = () => {
    getV1AgtRebateInfoHistoryGetTopApiRequest({})
      .then(res => {
        if (res.isOk) {
          setProfitList(res.data?.profitList as Array<YapiGetV1AgtRebateInfoHistoryGetTopListProfitListData>)
        }
      })
      .finally(() => {
        setFullScreenLoading(false)
      })
  }
  /** 获取邀请码 */
  useEffect(() => {
    setFullScreenLoading(true)
    getInviteApi()
  }, [])

  const onConfirmClose = () => {
    setConfirmVisible(false)
  }

  const openGuidePop = () => {
    setConfirmVisible(true)
  }

  const commonState = useCommonStore()

  return (
    <div className={Styles.scoped}>
      <NavBar title={t`features_agent_agent_rank_index_5101543`} />

      <div
        className="rank-title-wrap"
        style={{
          backgroundImage: `url(${oss_svg_image_domain_address}agent/list_bj.png)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          height: commonState?.locale !== I18nsEnum['zh-HK'] ? '260px' : '200px',
        }}
      >
        <h1
          style={{
            width: commonState?.locale !== I18nsEnum['zh-HK'] ? '220px' : '',
          }}
        >{t`features_agent_agent_rank_index_5101544`}</h1>
        <p>{t`features_agent_agent_rank_index_5101545`}</p>
        <div className="guide" onClick={openGuidePop}>
          {t`features_agent_agent_rank_index_5101542`}
        </div>
      </div>

      <div className="rank-wrap">
        {profitList?.length ? (
          profitList?.map((item, index) => {
            if (index === 0) {
              return (
                <div className="rank-row" key={index}>
                  <div className="flex common-step-text">
                    <LazyImage className="rank-img" src={`${oss_svg_image_domain_address}agent/list_first.png`} />
                    <span className="ml-4">{`***${item.uid?.toString().substring(4)}`}</span>
                  </div>
                  <div className="common-step-text">{`${Number(item.actualUsdt).toFixed(2)} ${
                    item.legalCur || 'USD'
                  }`}</div>
                </div>
              )
            }

            if (index === 1) {
              return (
                <div className="rank-row mt-4" key={index}>
                  <div className="flex common-step-text">
                    <LazyImage className="rank-img" src={`${oss_svg_image_domain_address}agent/list_second.png`} />
                    <span className="ml-4">{`***${item.uid?.toString().substring(4)}`}</span>
                  </div>
                  <div className="common-step-text">{`${Number(item.actualUsdt).toFixed(2)} ${
                    item.legalCur || 'USD'
                  }`}</div>
                </div>
              )
            }

            if (index === 2) {
              return (
                <div className="rank-row mt-4" key={index}>
                  <div className="flex common-step-text">
                    <LazyImage className="rank-img" src={`${oss_svg_image_domain_address}agent/list_third.png`} />
                    <span className="ml-4">{`***${item.uid?.toString().substring(4)}`}</span>
                  </div>
                  <div className="common-step-text">{`${Number(item.actualUsdt).toFixed(2)} ${
                    item.legalCur || 'USD'
                  }`}</div>
                </div>
              )
            }

            return (
              <div className="rank-row mt-4 common-step-text" key={index}>
                <div className="flex common-step-text">
                  <div className="rank-img text-center">{index + 1}</div>
                  <span className="ml-4">{`***${item.uid?.toString().substring(4)}`}</span>
                </div>
                <div>{`${Number(item.actualUsdt).toFixed(2)} ${item.legalCur || 'USD'}`}</div>
              </div>
            )
          })
        ) : (
          <CommonListEmpty />
        )}
      </div>

      <Popup
        visible={confirmVisible}
        className={Styles.notice}
        style={{ height: '186px', width: '298px' }}
        onClose={onConfirmClose}
      >
        <div className="content">
          {t`features_agent_agent_rank_index_5101546`}
          <span className="text-brand_color">
            {t`features_agent_agent_rank_index_5101547`}~{t`features_agent_agent_rank_index_5101549`}
          </span>
        </div>
        <div className="button-wrap">
          <Button onClick={onConfirmClose} className="confirm-button">
            {t`features_agent_common_stats_popup_index_5101394`}
          </Button>
        </div>
      </Popup>
      <FullScreenLoading isShow={fullScreenLoading} className="h-screen" />
    </div>
  )
}

export default AgentRank
