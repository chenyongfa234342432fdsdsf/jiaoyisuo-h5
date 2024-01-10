import { useEffect, useRef, useState } from 'react'
import { t } from '@lingui/macro'

import { Search, Tabs } from '@nbit/vant'
import { useDebounceFn } from 'ahooks'
import classNames from 'classnames'
import {
  getV1MemberVipBaseFeeListApiRequest,
  getV1MemberVipBaseInfoApiRequest,
  getV1MemberVipBaseTradeFeeApiRequest,
} from '@/apis/vip'
import { YapiGetV1MemberVipBaseTradeFeeData } from '@/typings/yapi/MemberVipBaseTradeFeeV1GetApi'
import { YapiGetV1MemberVipBaseFeeData } from '@/typings/yapi/MemberVipBaseFeeListV1GetApi'
import { YapiGetV1MemberVipBaseInfoApiResponse } from '@/typings/yapi/MemberVipBaseInfoV1GetApi'
import NoDataImage from '@/components/no-data-image'
import { SearchInput } from '@/features/assets/common/search-input'
import Icon from '@/components/icon'
import styles from './index.module.css'

export enum vipLevelFundingType {
  spot = 'spot',
  contract = 'contract',
}
function Spot(props) {
  const { list } = props
  const myRef = useRef<HTMLDivElement>(null)

  const [searchKey, setSearchKey] = useState('')
  const [feeList, setFeeList] = useState<Array<YapiGetV1MemberVipBaseFeeData>>([])
  const [searchList, setSearchList] = useState<any>([])
  const [tradeFee, setTradeFee] = useState<YapiGetV1MemberVipBaseTradeFeeData>()
  // const { run: debounceSetSearchKey } = useDebounceFn(setSearchKey, {
  //   wait: 300,
  // })
  const [curUSerConfig, setCurUSerConfig] = useState<YapiGetV1MemberVipBaseInfoApiResponse>()
  useEffect(() => {
    getV1MemberVipBaseFeeListApiRequest({
      feeType: vipLevelFundingType.spot,
    }).then((res: any) => {
      if (res.isOk && res.data?.length) {
        setFeeList(res.data)
      }
    })

    getV1MemberVipBaseInfoApiRequest({}).then(res => {
      if (res.isOk) {
        setCurUSerConfig(res.data)
      }
    })
  }, [])

  const dealList: any = []
  list?.forEach((item, index) => {
    if (index % 4 === 0) {
      dealList.push([list?.slice(index, index + 4)])
    }
  })

  useEffect(() => {
    if (list?.length) {
      setSearchList(list)
      setSearchKey(list[0]?.symbolName)
    }
  }, [list])

  useEffect(() => {
    setTradeFee({
      markerFeeRate: 0,
      takerFeeRate: 0,
    })
    if (!searchKey) {
      setSearchList(list)
      return
    }
    const result = list?.filter(item => {
      return item.symbolName === searchKey?.toLocaleUpperCase()
    })

    const vagueResult = list?.filter(item => {
      return item.symbolName.indexOf(searchKey?.toLocaleUpperCase()) !== -1
    })

    if (searchKey) {
      setSearchList(vagueResult)
    }
    if (result?.length) {
      setTradeFee({
        markerFeeRate: result[0]?.sellFee,
        takerFeeRate: result[0]?.buyFee,
      })
      // getV1MemberVipBaseTradeFeeApiRequest({
      //   symbolName: result[0].symbolName,
      //   feeType: vipLevelFundingType.spot,
      // }).then(res => {
      //   if (res.isOk) {
      //     setTradeFee(res.data as YapiGetV1MemberVipBaseTradeFeeData)
      //   }
      // })
    }
  }, [searchKey])

  return (
    <div className={styles.scoped}>
      <div className="mt-4">
        <SearchInput
          placeholder={t`features_vip_level_fundting_spot_index_2bwbpjfvfx`}
          value={searchKey}
          onChange={setSearchKey}
        />
      </div>
      <div className="w-full px-4 box-border">
        <div className="common-14-title mt-4">{t`features_vip_level_fundting_spot_index_eqsymesqfy`}</div>
        <div className="text-brand_color common-12-content mt-2">{t`features_vip_level_fundting_spot_index_5fl7ooj7ai`}</div>

        {searchList?.length ? (
          <div className="w-full max-h-[120px] overflow-x-auto overflow-y-auto">
            <table className={classNames('table-component-wrapper mt-2 spot-coin-table')}>
              <tbody className="table-body">
                {dealList?.map((item, index) => {
                  return (
                    <tr key={index}>
                      {item?.[0]?.map((_item, _index) => {
                        return (
                          <td
                            onClick={() => {
                              setSearchKey(_item.symbolName)
                            }}
                            style={{
                              borderColor:
                                searchKey && _item.symbolName.indexOf(searchKey?.toLocaleUpperCase()) !== -1
                                  ? 'var(--brand_color)'
                                  : 'var(--line_color_01)',
                            }}
                            key={`${index}${_index}`}
                            className={classNames(
                              'h-[34px] w-[101px] text-xs text-center rv-hairline--top rv-hairline--bottom rv-hairline--left rv-hairline--right',
                              {
                                'bg-brand_color_special_02':
                                  searchKey && _item.symbolName.indexOf(searchKey?.toLocaleUpperCase()) !== -1,
                                'text-brand_color':
                                  searchKey && _item.symbolName.indexOf(searchKey?.toLocaleUpperCase()) !== -1,
                                'bg-card_bg_color_03': _item.symbolName.indexOf(searchKey?.toLocaleUpperCase()) === -1,
                                'text-text_color_01': _item.symbolName.indexOf(searchKey?.toLocaleUpperCase()) === -1,
                              }
                            )}
                          >
                            {_item.symbolName}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <NoDataImage className="mt-8" />
        )}

        {feeList?.length ? (
          <div className="mt-4 w-full max-h-[481px] overflow-x-auto overflow-y-auto">
            <table className={classNames('table-component-wrapper vip-coin-table')}>
              <thead>
                <tr>
                  <td
                    className={classNames(
                      'h-[35.5px] w-[75px] text-xs bg-card_bg_color_01 text-center text-text_color_02  rv-hairline--top rv-hairline--bottom rv-hairline--left rv-hairline--right'
                    )}
                  >{t`features_user_personal_center_vip_upgrade_condition_index_qoeqmbh2bi`}</td>
                  <td
                    className={classNames(
                      'h-[35.5px] w-[75px] text-xs bg-card_bg_color_01 text-center text-text_color_02  rv-hairline--top rv-hairline--bottom rv-hairline--left rv-hairline--right'
                    )}
                  >
                    Maker{t`features_vip_level_fundting_spot_index_nq3da7schz`}
                  </td>
                  <td
                    className={classNames(
                      'h-[35.5px] w-[75px] text-xs bg-card_bg_color_01 text-center text-text_color_02  rv-hairline--top rv-hairline--bottom rv-hairline--left rv-hairline--right'
                    )}
                  >
                    Taker{t`features_vip_level_fundting_spot_index_nq3da7schz`}
                  </td>
                  <td
                    className={classNames(
                      'h-[35.5px] w-[150px] text-xs bg-card_bg_color_01 text-center text-text_color_02  rv-hairline--top rv-hairline--bottom rv-hairline--left rv-hairline--right'
                    )}
                  >
                    {t`features_vip_vip_center_index_pbts5cxwb0`}(Maker)/{t`features_vip_vip_center_index_cohirgthxq`}
                    (Taker)
                  </td>
                </tr>
              </thead>

              <tbody className="table-body">
                {feeList?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td
                        className={classNames(
                          'h-[39.5px] w-[75px] text-xs text-center text-text_color_01  rv-hairline--top rv-hairline--bottom rv-hairline--left rv-hairline--right',
                          {
                            'bg-brand_color_special_02': curUSerConfig?.levelCode === item.levelCondition.levelCode,
                            'bg-card_bg_color_03': curUSerConfig?.levelCode !== item.levelCondition.levelCode,
                          }
                        )}
                      >
                        {item.levelCondition.levelCode}
                      </td>
                      <td
                        className={classNames(
                          'h-[39.5px] w-[75px] text-xs text-center text-text_color_01  rv-hairline--top rv-hairline--bottom rv-hairline--left rv-hairline--right',
                          {
                            'bg-brand_color_special_02': curUSerConfig?.levelCode === item.levelCondition.levelCode,
                            'bg-card_bg_color_03': curUSerConfig?.levelCode !== item.levelCondition.levelCode,
                          }
                        )}
                      >
                        {tradeFee?.markerFeeRate
                          ? Number(item.makerFee)
                            ? `${Number(item.makerFee).toFixed(2)}%`
                            : t`features_vip_vip_center_index_miwmlcfpro`
                          : '-'}
                      </td>
                      <td
                        className={classNames(
                          'h-[39.5px] w-[75px] text-xs text-center text-text_color_01  rv-hairline--top rv-hairline--bottom rv-hairline--left rv-hairline--right',
                          {
                            'bg-brand_color_special_02': curUSerConfig?.levelCode === item.levelCondition.levelCode,
                            'bg-card_bg_color_03': curUSerConfig?.levelCode !== item.levelCondition.levelCode,
                          }
                        )}
                      >
                        {tradeFee?.markerFeeRate
                          ? Number(item.takerFee)
                            ? `${Number(item.takerFee).toFixed(2)}%`
                            : t`features_vip_vip_center_index_miwmlcfpro`
                          : '-'}
                      </td>
                      <td
                        className={classNames(
                          'h-[39.5px] w-[150px] text-xs text-center text-text_color_01  rv-hairline--top rv-hairline--bottom rv-hairline--left rv-hairline--right',
                          {
                            'bg-brand_color_special_02': curUSerConfig?.levelCode === item.levelCondition.levelCode,
                            'bg-card_bg_color_03': curUSerConfig?.levelCode !== item.levelCondition.levelCode,
                          }
                        )}
                      >
                        {tradeFee?.markerFeeRate
                          ? `${(Number(100 - Number(item.makerFee)) * Number(tradeFee?.markerFeeRate)).toFixed(4)}%/${(
                              Number(100 - Number(item.takerFee)) * Number(tradeFee?.takerFeeRate)
                            ).toFixed(4)}%`
                          : '-'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : null}

        <div className="text-text_color_01 common-12-content mt-4">{t`features_user_personal_center_vip_upgrade_condition_index_rpwg2mgk_w`}</div>
        <p className="text-text_color_02 common-12-content mt-2">
          {t`features_vip_level_fundting_spot_index_738nk7metv`} 00:00 (UTC+8){' '}
          {t`features_vip_level_fundting_spot_index_z1vnbitobc`}
        </p>
        <p className="text-text_color_02 common-12-content mt-1">
          {t`features_vip_level_fundting_spot_index_qqdyfip1kz`} {t`features_vip_level_fundting_spot_index_bntvrja_4y`}{' '}
          00:00 (UTC+8) {t`features_vip_level_fundting_spot_index_v8dghuym3y`}
          {t`features_vip_level_fundting_spot_index_0rg52vzdmz`} {t`features_vip_level_fundting_spot_index_2dlwutnvmw`}
        </p>
        <p className="text-text_color_02 common-12-content mt-1">
          {t`features_vip_level_fundting_spot_index_w0u3jnvo_7`} 00:00 ~{' '}
          {t`features_vip_level_fundting_spot_index_qrcrnzw0y5`} {t`features_vip_level_fundting_spot_index_fxk8mmbeji`}{' '}
          VIP {t`features_vip_level_fundting_spot_index_c27qvvnerm`}
          {t`features_vip_level_fundting_spot_index_p8o7fcjdje`}
        </p>
        <p className="text-text_color_02 common-12-content mt-1">
          {t`features_user_personal_center_vip_upgrade_condition_index_5yk4xz2n1o`}
        </p>
        <p className="text-text_color_02 common-12-content mt-1">
          <Icon name="prompt-symbol" className="text-[6px] mr-1" />
          {t`features_user_personal_center_vip_upgrade_condition_index_a1057shaxu`}
        </p>
        <div className="mt-6 common-16-title">{t`features_help_center_support_index_5101072`}</div>
        <div className="mt-3 text-text_color_01 common-12-content">
          Q: {t`features_vip_level_fundting_spot_index_yqvugtpt4u`}{' '}
          {t`features_vip_level_fundting_spot_index_hipwsxyvxo`}
        </div>
        <div className="answer text-text_color_02 common-12-content mt-2">
          {t`features_vip_level_fundting_spot_index_o5voijwtoa`}
        </div>
        <div className="mt-4 text-text_color_01 common-12-content">
          Q: {t`features_vip_level_fundting_spot_index_fegfvzz3yh`}
        </div>
        <div className="answer text-text_color_02 common-12-content mt-2">{t`features_vip_level_fundting_spot_index_olefledscc`}</div>
      </div>
    </div>
  )
}

export default Spot
