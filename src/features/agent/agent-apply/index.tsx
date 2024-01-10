import { useEffect, useState } from 'react'
import Icon from '@/components/icon'
import { link } from '@/helper/link'

import { Button, Toast } from '@nbit/vant'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { agent_v3_oss_svg_image_domain_address } from '@/constants/agent'
import LazyImage from '@/components/lazy-image'
import { useLayoutStore } from '@/store/layout'
import { useCommonStore } from '@/store/common'
import { t } from '@lingui/macro'
import NavBar from '@/components/navbar'
import { useAgentStore } from '@/store/agent'
import { useMount } from 'ahooks'
import { getMaxRatio } from '@/apis/agent/apply'
import Styles from './index.module.css'
import PyramidFriend from './components/pyramid-friend'

function AgentApply() {
  const { fetchUserInBlackList, userInBlackListInfo } = useAgentStore()

  useMount(() => {
    fetchUserInBlackList()
  })

  const [maxSysRate, setMaxSysRate] = useState<number>()
  const getInviteApi = () => {
    getMaxRatio({}).then(res => {
      if (res.isOk) {
        setMaxSysRate(res?.data?.maxRatio)
      }
    })
  }
  /** 获取邀请码 */
  useEffect(() => {
    getInviteApi()
  }, [])
  const { customerJumpUrl } = useLayoutStore().layoutProps || {}
  const { headerData } = useLayoutStore()
  const commonState = useCommonStore()
  return (
    <div className={Styles.scoped}>
      <NavBar
        title={t`features_agent_agent_apply_index_2pb5ufrn8s`}
        right={<Icon hasTheme className="common-icon" name="nav_service" />}
        onClickRight={() => {
          link(customerJumpUrl)
        }}
        iconUrl={`${oss_svg_image_domain_address}agent/customer_service_white.png`}
        appRightConfig={{
          iconUrl: `${oss_svg_image_domain_address}agent/customer_service_white.png`,
          onClickRight: () => {
            location.href = customerJumpUrl as string
          },
        }}
      />
      <div
        className="apply-wrap"
        style={{
          backgroundImage: `url(${agent_v3_oss_svg_image_domain_address}/bg_agent_pyramid${
            commonState?.theme === 'dark' ? '_black' : '_white'
          }.png)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
        }}
      >
        <h1 className="banner-title">{t`features_agent_agent_apply_index_ewdiukmey2`}</h1>
        <p>{t`features_agent_agent_apply_index_wy38_zeimw`}</p>
        <Button
          className="join-button"
          type="primary"
          onClick={() => {
            if (userInBlackListInfo.onTheBlacklist) {
              Toast.info({
                message: t`features_agent_agent_apply_index_2_zblxxtj7`,
              })
              return
            }
            link('/agent/join')
          }}
        >
          {t`features_agent_agent_apply_index_5101611`}
        </Button>
      </div>

      <div className="pro-warp">
        <div className="pro-row">
          <div className="step-icon">
            <Icon hasTheme name="icon_agent_pyramid_first" />
          </div>
          <div className="common-step-text text-center over-hid-two mt-3">
            {t`features_agent_agent_apply_index_uqdeq08q94`}
          </div>
          <div className="first step over-hid">{t`features_agent_agent_apply_index_5101586`}</div>
        </div>
        <div className="pro-row">
          <div className="step-icon">
            <Icon hasTheme name="icon_agent_pyramid_second" />
          </div>
          <div className="common-step-text text-center over-hid-three mt-3">
            {headerData?.businessName}
            {t`features_agent_agent_apply_index_1gjckypskc`}
          </div>
          <div className="second step over-hid">{t`features_agent_agent_apply_index_5101590`}</div>
        </div>
        <div className="pro-row">
          <div className="step-icon">
            <Icon hasTheme name="icon_agent_pyramid_third" />
          </div>
          <div className="common-step-text text-center mt-3 over-hid-three">
            {t`features_agent_agent_apply_index_5101591`},{t`features_agent_agent_apply_index_dlthchnlmf`}
          </div>
          <div className="third step over-hid">{t`features_agent_agent_apply_index_5101594`}</div>
        </div>
      </div>

      <div className="welfare-wrap">
        <LazyImage
          hasTheme
          className="welfare-img"
          src={`${agent_v3_oss_svg_image_domain_address}/img_agent_welfare.png`}
        />
        <h1>{t`features_agent_agent_apply_index_xi2vded89l`}</h1>
        <div className="common-earn-text text-center mt-2">{t`features_agent_agent_apply_index_sum2sbritf`}</div>
        <div className="welfare-row">
          <div className="row-img">
            <Icon hasTheme name="icon_agent_pyramid_pattern" />
          </div>
          <div className="welfare-col ml-2" style={{ width: 'calc(100% - 48px)' }}>
            <div className="common-welfare-text">{t`features_agent_agent_apply_index_5101598`}</div>
            <div className="common-02-text">{t`features_agent_agent_apply_index_5101599`}</div>
          </div>
        </div>
        <div className="welfare-row">
          <div className="row-img">
            <Icon hasTheme name="icon_agent_pyramid_commission" />
          </div>
          <div className="welfare-col ml-2">
            <div className="common-welfare-text">{t`features_agent_agent_apply_index_5101600`}</div>
            <div className="common-02-text">{t`features_agent_agent_apply_index_5101601`}</div>
          </div>
        </div>
        <div className="welfare-row">
          <div className="row-img">
            <Icon hasTheme name="icon_agent_pyramid_transparency" />
          </div>
          <div className="welfare-col ml-2" style={{ width: 'calc(100% - 48px)' }}>
            <div className="common-welfare-text">{t`features_agent_agent_apply_index_5101602`}</div>
            <div className="common-02-text">{t`features_agent_agent_apply_index_5101603`}</div>
          </div>
        </div>
      </div>

      <div className="earn-wrap">
        <LazyImage
          hasTheme
          className="earn-wrap-img"
          src={`${agent_v3_oss_svg_image_domain_address}/img_earn_first.png`}
        />
        <h1>{t`features_agent_agent_apply_index_5101604`}</h1>
        <div className="common-earn-text text-center mt-2">
          {t({
            id: 'features_agent_agent_apply_index_bhh3tg5kj8',
            values: {
              0: maxSysRate,
            },
          })}
        </div>
        <div className="rate-wrap">
          <div className="rate-col">
            <div className="my-scale  common-view">30%</div>
            <div className="common-step-text text-center mt-2">{t`features_agent_agent_apply_index_5101607`}</div>
          </div>
          <div className="center-icon">
            <LazyImage hasTheme className="add-img" src={`${agent_v3_oss_svg_image_domain_address}/add.png`} />
          </div>
          <div className="rate-col" style={{ width: '126px' }}>
            <div className="common-view friend-scale">20%</div>
            <div className="common-step-text text-center mt-2">{t`features_agent_agent_apply_index_5101608`}</div>
          </div>
        </div>
        <LazyImage
          className="earn-wrap-img second"
          src={`${agent_v3_oss_svg_image_domain_address}/img_earn_second.png`}
        />
        <div className="line-01"></div>
        <div className="flex flex-col w-full items-center relative">
          <div className="line-02"></div>
          <div className="pro-people">
            <div className="earn-row">
              <PyramidFriend
                tipPosition="left"
                name="A"
                popTip={
                  <>
                    <span>
                      {t`features_agent_invite_operation_index_5101486`}

                      <span className="ratio">{' 30%'}</span>
                    </span>
                    <span>
                      {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101409`}A
                      <span className="ratio">{' 20%'}</span>
                    </span>
                  </>
                }
              />
              <div style={{ marginLeft: '26px' }}>
                <PyramidFriend
                  popTip={
                    <>
                      <span>
                        {t`features_agent_invite_operation_index_5101486`}
                        <span className="ratio">{' 20%'} </span>
                      </span>
                      <span>
                        {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101409`}B
                        <span className="ratio">{' 30%'}</span>
                      </span>
                    </>
                  }
                  name="B"
                  tipPosition="right"
                />
              </div>
            </div>
          </div>
          <div className="line-wrap">
            <div className="line-03"></div>
            <div className="line-04"></div>
          </div>
          <div className="line-05"></div>
          <div className="pro-people">
            <div className="earn-row">
              <PyramidFriend
                tipPosition="left"
                popTip={
                  <>
                    <span>
                      {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101409`}B
                      <span className="ratio">{' 10%'}</span>
                    </span>
                    <span>
                      {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101409`}C
                      <span className="ratio">{' 20%'}</span>
                    </span>
                  </>
                }
                name="C"
              />
              <div style={{ marginLeft: '26px' }}>
                <PyramidFriend
                  popTip={
                    <>
                      <span>
                        {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101409`}B
                        <span className="ratio">{' 20%'}</span>
                      </span>
                      <span>
                        {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101409`}D
                        <span className="ratio">{' 10%'}</span>
                      </span>
                    </>
                  }
                  name="D"
                  tipPosition="right"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="join-wrap">
        <h1>{t`features_agent_agent_apply_index_i4ymksauaz`}</h1>
        <div className="common-earn-text">{t`features_agent_agent_apply_index_t7yizft5gh`}</div>
      </div>
      <div className="button-wrap">
        <Button
          className="apply-button"
          onClick={() => {
            if (userInBlackListInfo.onTheBlacklist) {
              Toast.info({
                message: t`features_agent_agent_apply_index_2_zblxxtj7`,
              })
              return
            }
            link('/agent/join')
          }}
        >
          {t`features_agent_agent_apply_index_5101611`}
        </Button>
      </div>
    </div>
  )
}

export default AgentApply
