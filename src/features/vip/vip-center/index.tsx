import { useEffect, useRef, useState } from 'react'
import { t } from '@lingui/macro'

import { oss_svg_image_domain_address } from '@/constants/oss'
import NavBar from '@/components/navbar'
import Icon from '@/components/icon'

import { link } from '@/helper/link'
import FullScreenLoading from '@/features/user/components/full-screen-loading'

import { Tabs, Popup, Button } from '@nbit/vant'
import { getV1MemberVipBaseConfigListApiRequest, getV1MemberVipBaseInfoApiRequest } from '@/apis/vip'

import { YapiGetV1MemberVipBaseConfigListData } from '@/typings/yapi/MemberVipBaseConfigListV1GetApi'
import { YapiGetV1MemberVipBaseInfoApiResponse } from '@/typings/yapi/MemberVipBaseInfoV1GetApi'
import { useVipCenterStore } from '@/store/vip'
import { useMount } from 'ahooks'
import { getTradePage } from '@/helper/route/welfare-center'
import styles from './index.module.css'
import DepositAS from '../components/deposit-actionsheet'
import DerivativeAS from '../components/derivative-actionsheet'
import FuncSwiper from './func-swiper'
import ImageSwiper from './image-swiper'

export enum vipLevelFundingType {
  spot = 'spot',
  contract = 'contract',
}

export enum amountCalStatus {
  enable = 'enable',
  disable = 'disable',
}

export enum feeType {
  spot = 'spot',
  perpetual = 'perpetual',
}

const blockWrapBg = {
  0: 'image_vip_lv0_bule_bj2x.png',
  1: 'image_vip_lv1_bule_bj2x.png',
  2: 'image_vip_lv1_bule_bj2x.png',
  3: 'image_vip_lv1_bule_bj2x.png',
  4: 'image_vip_lv4_violet_bj2x.png',
  5: 'image_vip_lv4_violet_bj2x.png',
  6: 'image_vip_lv4_violet_bj2x.png',
  7: 'image_vip_lv7_gold_bj2x.png',
  8: 'image_vip_lv7_gold_bj2x.png',
  9: 'image_vip_lv7_gold_bj2x.png',
  10: 'image_vip_lv10_black_bj2x.png',
}

function VipCenter() {
  const { getDerivativeMenu, getVipBaseInfo } = useVipCenterStore()

  const [fullScreenLoading, setFullScreenLoading] = useState<boolean>(false)

  const [depositASVis, setDepositASVis] = useState<boolean>(false)
  const [deriASVis, setDeriASVis] = useState<boolean>(false)
  const [curVipConfig, setCurVipConfig] = useState<YapiGetV1MemberVipBaseConfigListData>()
  const [curUSerConfig, setCurUSerConfig] = useState<YapiGetV1MemberVipBaseInfoApiResponse>()

  const [vipConfigList, setVipConfigList] = useState<Array<YapiGetV1MemberVipBaseConfigListData>>([])
  const swiperRef = useRef<any>()
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const vipInfo = vipConfigList?.filter(item => {
    return item.levelCode === curUSerConfig?.levelCode
  })?.[0]

  useMount(() => {
    getVipBaseInfo()
    getDerivativeMenu()
  })

  useEffect(() => {
    Promise.all([getV1MemberVipBaseConfigListApiRequest({}), getV1MemberVipBaseInfoApiRequest({})]).then(
      ([res, res2]) => {
        if (res.isOk && res.data?.length) {
          setVipConfigList(res.data as YapiGetV1MemberVipBaseConfigListData[])
          setCurVipConfig(res.data?.[res2?.data?.level || 0] || {})
          setCurrentIndex(Number(res2?.data?.level) || 0)
        }

        if (res2.isOk) {
          setCurUSerConfig(res2.data)
        }
      }
    )
  }, [])

  useEffect(() => {
    if (!vipConfigList?.length) {
      return
    }
    setCurVipConfig(vipConfigList[currentIndex])
  }, [currentIndex])

  useEffect(() => {
    if (!vipConfigList?.length) {
      return
    }
    swiperRef.current?.swipeTo(Number(curUSerConfig?.level) || 0)
  }, [vipConfigList, curUSerConfig])

  const [protectVisible, setProtectVisible] = useState<boolean>(false)
  const [upgradeVisible, setUpgradeVisible] = useState<boolean>(false)

  const [volumeVisible, setVolumeVisible] = useState<boolean>(false)
  const [assetVisible, setAssetVisible] = useState<boolean>(false)

  const fileName = 'vip/vip%E4%B8%AD%E5%BF%83%E5%88%87%E5%9B%BE%E5%B7%B2%E5%8E%8B%E7%BC%A9/'

  const nextLevelData = currentIndex === vipConfigList?.length - 1 ? curVipConfig : vipConfigList?.[currentIndex + 1]

  return (
    <div className={styles.scoped}>
      <div
        className="h-[238px] w-full"
        style={{
          backgroundImage: `url(${oss_svg_image_domain_address}${fileName}${blockWrapBg[currentIndex]})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <NavBar
          left={
            <div>
              <Icon name="back_black" className="text-lg" />
            </div>
          }
          title={t`features_user_personal_center_index_xmipdketh9`}
        />
        <div className="mt-[44px] w-full" style={{ background: 'transparent' }}>
          <ImageSwiper
            curUSerConfig={curUSerConfig}
            list={vipConfigList || []}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            swiperRef={swiperRef}
            setProtectVisible={setProtectVisible}
          />
        </div>
      </div>
      <div className="level-wrap mt-[-16px]">
        <div className="flex justify-between">
          <div className="common-16-title">{t`features_vip_vip_center_index_xvl9rcxhx4`}</div>
          <div
            className="common-12-content text-text_color_03"
            onClick={() => {
              link('/vip/vip-funding')
            }}
          >
            {t`features_vip_vip_center_index_a7lqlkjcln`}
            <Icon name="next_arrow" hasTheme className="text-xs ml-1" />
          </div>
        </div>
        {curVipConfig?.feeList?.map(item => {
          if (item.productCd === feeType.spot) {
            return (
              <>
                <div className="mt-2 common-14-title text-text_color_01">{t`features_vip_vip_center_index_p70etn7c2p`}</div>
                <div className="mt-2 flex justify-between">
                  <div
                    className="funding-block"
                    style={{
                      width: 'calc((100% - 16px) / 2)',
                    }}
                  >
                    <div className="common-14-title text-text_color_01">{Number(item.makerFee).toFixed(2)}%</div>
                    <div className="flex mt-1">
                      <span className="common-12-content text-text_color_02">{t`features_vip_vip_center_index_pbts5cxwb0`}</span>
                      {/* <div className="ml-1 funding-tag text-text_color_03 text-[10px]">
                        {100 - item.makerFee ? (
                          <span className="text-brand_color">
                            {t({
                              id: 'features_vip_vip_center_index_ruutdk9rnb',
                              values: { 0: (100 - item.makerFee) / 10 },
                            })}
                          </span>
                        ) : (
                          t`features_vip_vip_center_index_miwmlcfpro`
                        )}
                      </div> */}
                    </div>
                  </div>
                  <div
                    className="ml-4 funding-block"
                    style={{
                      width: 'calc((100% - 16px) / 2)',
                    }}
                  >
                    <div className="common-14-title text-text_color_01">{Number(item.takerFee).toFixed(2)}%</div>
                    <div className="flex mt-1">
                      <span className="common-12-content text-text_color_02">{t`features_vip_vip_center_index_cohirgthxq`}</span>
                      {/* <div className="ml-1 funding-tag text-text_color_03 text-[10px]">
                        {100 - item.takerFee ? (
                          <span className="text-brand_color">
                            {t({
                              id: 'features_vip_vip_center_index_ruutdk9rnb',
                              values: { 0: (100 - item.takerFee) / 10 },
                            })}
                          </span>
                        ) : (
                          t`features_vip_vip_center_index_miwmlcfpro`
                        )}
                      </div> */}
                    </div>
                  </div>
                </div>
              </>
            )
          }
          if (item.productCd === feeType.perpetual) {
            return (
              <>
                <div className="mt-3 common-14-title text-text_color_01">{t`features_vip_vip_center_index_uprhrflsz6`}</div>
                <div className="mt-2 flex justify-between">
                  <div
                    className="funding-block"
                    style={{
                      width: 'calc((100% - 16px) / 2)',
                    }}
                  >
                    <div className="common-14-title text-text_color_01">{Number(item.makerFee).toFixed(2)}%</div>
                    <div className="flex mt-1">
                      <span className="common-12-content text-text_color_02">{t`features_vip_vip_center_index_pbts5cxwb0`}</span>
                      {/* <div className="ml-1 funding-tag text-text_color_03 text-[10px]">
                        {100 - item.makerFee ? (
                          <span className="text-brand_color">
                            {t({
                              id: 'features_vip_vip_center_index_ruutdk9rnb',
                              values: { 0: (100 - item.makerFee) / 10 },
                            })}
                          </span>
                        ) : (
                          t`features_vip_vip_center_index_miwmlcfpro`
                        )}
                      </div> */}
                    </div>
                  </div>
                  <div
                    className="ml-4 funding-block"
                    style={{
                      width: 'calc((100% - 16px) / 2)',
                    }}
                  >
                    <div className="common-14-title text-text_color_01">{Number(item.takerFee).toFixed(2)}%</div>
                    <div className="flex mt-1">
                      <span className="common-12-content text-text_color_02">{t`features_vip_vip_center_index_cohirgthxq`}</span>
                      {/* <div className="ml-1 funding-tag text-text_color_03 text-[10px]">
                        {100 - item.takerFee ? (
                          <span className="text-brand_color">
                            {t({
                              id: 'features_vip_vip_center_index_ruutdk9rnb',
                              values: { 0: (100 - item.takerFee) / 10 },
                            })}
                          </span>
                        ) : (
                          t`features_vip_vip_center_index_miwmlcfpro`
                        )}
                      </div> */}
                    </div>
                  </div>
                </div>
              </>
            )
          }
          return null
        })}

        <div className="flex justify-between mt-4">
          <div className="common-16-title">
            {curVipConfig?.levelCode} {t`features_vip_vip_center_index_okmfalee4b`}
          </div>
          <div className="common-12-content text-text_color_03" onClick={() => link('/vip/rights-introduction')}>
            {t`features_vip_vip_center_index_a7lqlkjcln`}
            <Icon name="next_arrow" hasTheme className="text-xs ml-1" />
          </div>
        </div>
        <div className="mt-3">
          <FuncSwiper list={curVipConfig?.vipBenefits || []} />
        </div>
      </div>
      <div className="divide"></div>
      <div className="p-4 w-full box-border upgrade-wrap mt-[-16px]">
        <div className="mt-4 flex justify-between">
          <div className="common-16-title">
            {t`modules_user_personal_center_vip_upgrade_condition_index_page_cm7tozxjfz`}
            <Icon
              onClick={() => {
                setUpgradeVisible(true)
              }}
              name="property_icon_tips"
              className="text-xs ml-1 text-text_color_03"
            />
          </div>
          <div className="common-12-content text-text_color_03" onClick={() => link('/vip/upgrade-condition')}>
            {t`features_vip_vip_center_index_a7lqlkjcln`}
            <Icon name="next_arrow" hasTheme className="text-xs ml-1" />
          </div>
        </div>
        <div className="mt-2 common-12-content text-text_color_02">
          {t`features_vip_vip_center_index_and9bv8hxq`}{' '}
          <span className="text-brand_color">
            LV{' '}
            {currentIndex < Number(vipConfigList?.[vipConfigList?.length - 1]?.level) ? currentIndex + 1 : currentIndex}
          </span>{' '}
          {t`features_vip_vip_center_index_stzt5kzyxz`}
        </div>
        <div className="mt-4 flex flex-col">
          {nextLevelData?.levelCondition?.spotAmountCalStatus === amountCalStatus.enable ? (
            <div className="upgrade-block">
              <div className="left">
                <div className="icon-wrap">
                  <Icon name="icon_welfare_cash_gray" hasTheme className="text-xl !mt-0" />
                </div>
                <div className="ml-3 flex flex-col">
                  <div className="common-14-title text-text_color_01">
                    {t`features_vip_vip_center_index_g5vh6xbgql`} 30 {t`features_vip_vip_center_index_tavnzvfzms`}
                  </div>
                  <div className="mt-1 common-12-content text-text_color_03">
                    {curUSerConfig?.vipSpotAmount}/{nextLevelData?.levelCondition?.spotAmount}
                  </div>
                  <div className="step-wrap mt-1">
                    <div
                      className="step"
                      style={{
                        width: `${
                          Number(curUSerConfig?.vipSpotAmount) / nextLevelData?.levelCondition?.spotAmount >= 1
                            ? 100
                            : (Number(curUSerConfig?.vipSpotAmount) / nextLevelData?.levelCondition?.spotAmount) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="right">
                <Button
                  className="button"
                  type="primary"
                  onClick={() => {
                    link(getTradePage())
                  }}
                >{t`features_vip_vip_center_index_8ukwhechow`}</Button>
              </div>
            </div>
          ) : null}

          {nextLevelData?.levelCondition?.derivativesAmountCalStatus === amountCalStatus.enable &&
          nextLevelData?.levelCondition?.spotAmountCalStatus === amountCalStatus.enable ? (
            <div className="upgrade-divide common-12-content text-text_color_03">
              <div className="w-[23px] h-[0.5px] bg-line_color_02"></div>
              <span className="mx-1">{t`user.third_party_01`}</span>
              <div className="w-[23px] h-[0.5px] bg-line_color_02"></div>
            </div>
          ) : null}
          {nextLevelData?.levelCondition?.derivativesAmountCalStatus === amountCalStatus.enable ? (
            <div className="upgrade-block mt-2">
              <div className="left">
                <div className="icon-wrap">
                  <Icon name="icon_vip_deal" hasTheme className="text-xl !mt-0" />
                </div>
                <div className="ml-3 flex flex-col">
                  <div className="common-14-title text-text_color_01">
                    {t`features_vip_vip_center_index_g5vh6xbgql`} 30 {t`features_vip_vip_center_index_rv7imkbo3q`}
                    <Icon
                      onClick={() => {
                        setVolumeVisible(true)
                      }}
                      name="property_icon_tips"
                      className="text-xs ml-1 text-text_color_03"
                    />
                  </div>
                  <div className="mt-1 common-12-content text-text_color_03">
                    {curUSerConfig?.vipDerivativesAmount}/{nextLevelData?.levelCondition?.derivativesAmount}
                  </div>
                  <div className="step-wrap mt-1">
                    <div
                      className="step"
                      style={{
                        width: `${
                          Number(curUSerConfig?.vipDerivativesAmount) /
                            nextLevelData?.levelCondition?.derivativesAmount >=
                          1
                            ? 100
                            : (Number(curUSerConfig?.vipDerivativesAmount) /
                                nextLevelData?.levelCondition?.derivativesAmount) *
                              100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="right">
                <Button className="button" type="primary" onClick={() => setDeriASVis(true)}>
                  {t`features_vip_vip_center_index_8ukwhechow`}
                </Button>
              </div>
            </div>
          ) : null}

          {(nextLevelData?.levelCondition?.derivativesAmountCalStatus === amountCalStatus.enable ||
            nextLevelData?.levelCondition?.spotAmountCalStatus === amountCalStatus.enable) &&
          nextLevelData?.levelCondition?.balanceAmountCalStatus === amountCalStatus.enable ? (
            <div className="upgrade-divide common-12-content text-text_color_03">
              <div className="w-[23px] h-[0.5px] bg-line_color_02"></div>
              <span className="mx-1">{t`user.third_party_01`}</span>
              <div className="w-[23px] h-[0.5px] bg-line_color_02"></div>
            </div>
          ) : null}
          {nextLevelData?.levelCondition?.balanceAmountCalStatus === amountCalStatus.enable ? (
            <div className="upgrade-block mt-2">
              <div className="left">
                <div className="icon-wrap">
                  <Icon name="icon_vip_wallet" hasTheme className="text-xl !mt-0" />
                </div>
                <div className="ml-3 flex flex-col">
                  <div className="common-14-title text-text_color_01">
                    {t`features_vip_vip_center_index_tbq9nqes9z`} USD
                    <Icon
                      onClick={() => {
                        setAssetVisible(true)
                      }}
                      name="property_icon_tips"
                      className="text-xs ml-1 text-text_color_03"
                    />
                  </div>
                  <div className="mt-1 common-12-content text-text_color_03">
                    {curUSerConfig?.vipBalanceAmount}/{nextLevelData?.levelCondition?.balanceAmount}
                  </div>
                  <div className="step-wrap mt-1">
                    <div
                      className="step"
                      style={{
                        width: `${
                          Number(curUSerConfig?.vipBalanceAmount) / nextLevelData?.levelCondition?.balanceAmount >= 1
                            ? 100
                            : (Number(curUSerConfig?.vipBalanceAmount) / nextLevelData?.levelCondition?.balanceAmount) *
                              100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="right">
                <Button className="button" type="primary" onClick={() => setDepositASVis(true)}>
                  {t`features_vip_vip_center_index_9zqifkv4cu`}
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Popup
        className={styles.notice}
        style={{ zIndex: 9999, width: '292px' }}
        visible={protectVisible}
        onClose={() => setProtectVisible(false)}
      >
        <div className="common-16-title text-center">{t`features_vip_vip_center_index_wpbmuuhwnn`}</div>
        <div className="text-brand_color common-14-content  mt-4">
          {t`features_vip_vip_center_index_2wvohic4cq`} {curUSerConfig?.protectDay}{' '}
          {t`features_vip_vip_center_index_bdq15kauyb`}
        </div>
        <div className="mt-2 common-14-title">
          <span className="text-text_color_01">{t`features_vip_vip_center_index_rdzkjpaa7j`}</span>
          <span className="text-brand_color">{curUSerConfig?.levelCode}</span>
        </div>
        <div className="common-14-content">
          <span className="text-text_color_03">
            {t`features_vip_vip_center_index_g5vh6xbgql`} 30 {t`features_vip_vip_center_index_gixnxj0qa9`}
          </span>
          <span className="text-text_color_01">
            {curUSerConfig?.vipSpotAmount}/{vipInfo?.levelCondition?.spotAmount} USD
          </span>{' '}
        </div>
        <div className="common-14-content">
          <span className="text-text_color_03">
            {t`features_vip_vip_center_index_g5vh6xbgql`} 30 {t`features_vip_vip_center_index_gixnxj0qa9`}
          </span>
          <span className="text-text_color_01">
            {curUSerConfig?.vipDerivativesAmount}/{vipInfo?.levelCondition?.derivativesAmount} USD
          </span>{' '}
        </div>
        <div className="common-14-content">
          <span className="text-text_color_03">
            {t`features_vip_vip_center_index_tbq9nqes9z`} {t`features_vip_vip_center_index_fmxtmcpgxg`}
          </span>
          <span className="text-text_color_01">
            {curUSerConfig?.vipBalanceAmount}/{vipInfo?.levelCondition?.balanceAmount} USD
          </span>
        </div>
        <div className="mt-2 common-14-content text-text_color_01">
          {t({
            id: 'features_vip_vip_center_index_r111leqxym',
            values: { 0: curVipConfig?.period, 1: curVipConfig?.period },
          })}
          <span className="text-brand_color">-1</span>
          {t`features_vip_vip_center_index__teggkc2tj`}
        </div>
        <Button
          type="primary"
          onClick={() => {
            setProtectVisible(false)
          }}
          className="confirm-button mt-4"
        >
          {t`features_trade_common_notification_index_5101066`}
        </Button>
      </Popup>

      <Popup
        className={styles.notice}
        style={{ zIndex: 9999, width: '292px' }}
        visible={upgradeVisible}
        onClose={() => setUpgradeVisible(false)}
      >
        <div className="common-16-title text-center">{t`modules_user_personal_center_vip_upgrade_condition_index_page_cm7tozxjfz`}</div>
        <div className="common-14-content text-text_color_01 mt-4">
          {t`features_vip_vip_center_index_4atuvd5134`} 00:00 (UTC+8) {t`features_vip_vip_center_index_cm6ivwmc3y`} 30{' '}
          {t`features_vip_vip_center_index_hkiphwjhtn`} & {t`features_vip_vip_center_index_yxstkw1g8q`}{' '}
          {t`features_vip_vip_center_index_fjgsmamhim`} {t`features_vip_vip_center_index_wmxcoqlh59`} 08:00 (UTC+8){' '}
          {t`features_vip_vip_center_index_b0plc2lqx1`} VIP
          {t`features_vip_vip_center_index_qp3yub6vfe`}
        </div>
        <Button
          type="primary"
          onClick={() => {
            setUpgradeVisible(false)
          }}
          className="confirm-button mt-4"
        >
          {t`features_trade_common_notification_index_5101066`}
        </Button>
      </Popup>

      <Popup
        className={styles.notice}
        style={{ zIndex: 9999, width: '292px' }}
        visible={volumeVisible}
        onClose={() => setVolumeVisible(false)}
      >
        <div className="common-16-title text-center">
          {t`features_vip_vip_center_index_g5vh6xbgql`} 30 {t`features_vip_vip_center_index_rv7imkbo3q`}
        </div>
        <div className="common-14-content text-text_color_01 mt-4">{t`features_vip_vip_center_index_xaztq_vrio`}</div>
        <Button
          type="primary"
          onClick={() => {
            setVolumeVisible(false)
          }}
          className="confirm-button mt-4"
        >
          {t`features_trade_common_notification_index_5101066`}
        </Button>
      </Popup>

      <Popup
        className={styles.notice}
        style={{ zIndex: 9999, width: '292px' }}
        visible={assetVisible}
        onClose={() => setAssetVisible(false)}
      >
        <div className="common-16-title text-center">{t`features_vip_vip_center_index_tbq9nqes9z`} USD</div>
        <div className="common-14-content text-text_color_01 mt-4">{t`features_user_personal_center_vip_upgrade_condition_index_hlcup1ekyb`}</div>
        <Button
          type="primary"
          onClick={() => {
            setAssetVisible(false)
          }}
          className="confirm-button mt-4"
        >
          {t`features_trade_common_notification_index_5101066`}
        </Button>
      </Popup>
      <FullScreenLoading isShow={fullScreenLoading} className="h-screen" />

      <DepositAS visible={depositASVis} setVisible={() => setDepositASVis(false)} />
      <DerivativeAS visible={deriASVis} setVisible={() => setDeriASVis(false)} />
    </div>
  )
}

export default VipCenter
