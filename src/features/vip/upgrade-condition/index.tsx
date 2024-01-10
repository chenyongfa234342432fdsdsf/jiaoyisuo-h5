import NavBar from '@/components/navbar'
import Icon from '@/components/icon'
import { useState } from 'react'
import { Dialog } from '@nbit/vant'
import { t } from '@lingui/macro'
import { useMount } from 'ahooks'
import { getV1MemberVipBaseConfigListApiRequest } from '@/apis/vip'
import { usePersonalCenterStore } from '@/store/user/personal-center'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import { useCommonStore } from '@/store/common'
import { getCodeDetailList } from '@/apis/common'
import styles from './index.module.css'
import { DERIVATIVE_LIST_DIC_CODE, amountCalStatus } from '../common'

type tableDataType = {
  level: string
  spot: string
  deri: string
  asset: string
}

interface dataDictionaryType {
  [key: string]: string
}

export default function UpgradeCondition() {
  const { locale } = useCommonStore()
  const { fiatCurrencyData } = usePersonalCenterStore()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Array<tableDataType>>([])
  const [derivatives, setDerivatives] = useState<string>()

  const displayFormat = (status, num, index, length) => {
    return status === amountCalStatus.disable
      ? '-'
      : length > 1 && index === 0
      ? `<${num}`
      : length > 1 && index > 0
      ? `≥${num}`
      : num
  }

  const getList = async () => {
    setLoading(true)
    const res = await getV1MemberVipBaseConfigListApiRequest({})
    const codes = await getCodeDetailList({ codeVal: DERIVATIVE_LIST_DIC_CODE, lanType: locale })
    setLoading(false)
    if (res?.isOk && res?.data && res?.data.length > 0) {
      const dics: any = res?.data[0]?.derivatives || [] // ['option', 'perpetual', 'ra']
      if (codes.isOk && codes.data) {
        const codeMap: dataDictionaryType = {}
        codes.data.forEach(item => (codeMap[item?.codeVal] = item?.codeKey))
        const derArr = dics?.map(i => codeMap[i])
        setDerivatives(derArr.join(','))
      }

      try {
        const arr = res.data?.map((i, index) => ({
          level: i.levelCode,
          spot: displayFormat(
            index === 0 ? res.data?.[1].levelCondition?.spotAmountCalStatus : i?.levelCondition?.spotAmountCalStatus,
            index === 0 ? res.data?.[1].levelCondition?.spotAmount : i?.levelCondition?.spotAmount,
            index,
            res.data?.length
          ),
          deri: displayFormat(
            index === 0
              ? res.data?.[1].levelCondition?.derivativesAmountCalStatus
              : i?.levelCondition?.derivativesAmountCalStatus,
            index === 0 ? res.data?.[1].levelCondition?.derivativesAmount : i?.levelCondition?.derivativesAmount,
            index,
            res.data?.length
          ),
          asset: displayFormat(
            index === 0
              ? res.data?.[1].levelCondition?.balanceAmountCalStatus
              : i?.levelCondition?.balanceAmountCalStatus,
            index === 0 ? res.data?.[1].levelCondition?.balanceAmount : i?.levelCondition?.balanceAmount,
            index,
            res.data?.length
          ),
        }))

        setData(arr)
      } catch (error) {
        console.log(error)
      }
    }
  }

  useMount(() => {
    getList()
  })

  const openDeriAlert = () => {
    Dialog.alert({
      title: t`features_user_personal_center_vip_upgrade_condition_index_4slrzvjyih`,
      className: 'dialog-confirm-wrapper confirm-black',
      message: t({
        id: 'features_user_personal_center_vip_upgrade_condition_index_yqs20swuil',
        values: { 0: derivatives },
      }),
      confirmButtonText: t`features_trade_common_notification_index_5101066`,
      closeOnClickOverlay: true,
    })
  }

  const openAssetAlert = () => {
    Dialog.alert({
      title: t`features_user_personal_center_vip_upgrade_condition_index_aqvghzdvu3`,
      className: 'dialog-confirm-wrapper confirm-black',
      message: t`features_user_personal_center_vip_upgrade_condition_index_hlcup1ekyb`,
      confirmButtonText: t`features_trade_common_notification_index_5101066`,
      closeOnClickOverlay: true,
    })
  }

  const col = [
    {
      key: 'level',
      name: t`features_user_personal_center_vip_upgrade_condition_index_qoeqmbh2bi`,
    },
    {
      key: 'spot',
      name: t`features_user_personal_center_vip_upgrade_condition_index_9uma1xu78x`,
    },
    {
      key: 'or1',
      name: t`user.third_party_01`,
    },
    {
      key: 'deri',
      name: (
        <span>
          {t`features_user_personal_center_vip_upgrade_condition_index_4slrzvjyih`}{' '}
          <Icon name="msg" hasTheme onClick={openDeriAlert} />
        </span>
      ),
    },
    {
      key: 'or2',
      name: t`user.third_party_01`,
    },
    {
      key: 'asset',
      name: (
        <span>
          {t`features_user_personal_center_vip_upgrade_condition_index_aqvghzdvu3`}{' '}
          <Icon name="msg" hasTheme onClick={openAssetAlert} />
        </span>
      ),
    },
  ]

  return (
    <section className={styles['vip-upgrade-condition-page']}>
      <FullScreenLoading isShow={loading} className="h-screen" mask />

      <NavBar title={t`modules_user_personal_center_vip_upgrade_condition_index_page_cm7tozxjfz`} />
      <div className="wrap">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {col.map(i => (
                  <th key={i.key}>{i.name}</th>
                ))}
              </tr>
            </thead>
            {data && data?.length > 0 ? (
              <tbody>
                {data.map((i, index) => (
                  <tr key={index}>
                    <td>{i.level}</td>
                    <td>{i.spot}</td>
                    <td>{t`user.third_party_01`}</td>
                    <td>{i.deri}</td>
                    <td>{t`user.third_party_01`}</td>
                    <td>{i.asset}</td>
                  </tr>
                ))}
              </tbody>
            ) : null}
          </table>
        </div>

        <div className="desc">{t`features_user_personal_center_vip_upgrade_condition_index_o8ptk3mkx7`}</div>
        <div className="addition">
          <h3>{t`features_user_personal_center_vip_upgrade_condition_index_rpwg2mgk_w`}</h3>
          <p>{t`features_user_personal_center_vip_upgrade_condition_index_ybarq0frwx`}</p>
          <p>
            {t({
              id: 'features_user_personal_center_vip_upgrade_condition_index_adhr8l7lxr',
              values: { 0: fiatCurrencyData?.currencyEnName },
            })}
          </p>
          <p>{t`features_user_personal_center_vip_upgrade_condition_index_8p1kwhfrfk`}</p>
          <p>{t`features_user_personal_center_vip_upgrade_condition_index_5yk4xz2n1o`}</p>
          <div>
            <Icon name="prompt-symbol" className="add-icon" />
            {t`features_user_personal_center_vip_upgrade_condition_index_a1057shaxu`}
          </div>
        </div>
      </div>
    </section>
  )
}
