import DynamicLottie from '@/components/dynamic-lottie'
import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import { useRequest, useMount, useCreation } from 'ahooks'
import classNames from 'classnames'
import { Button } from '@nbit/vant'
import NavBar from '@/components/navbar'
import { useFutureTradeStore } from '@/store/trade/future'
import { ThemeEnum } from '@/constants/base'
import { useLayoutStore } from '@/store/layout'
import { useCommonStore } from '@/store/common'
import { formatCurrency } from '@/helper/decimal'
import { useState, ReactNode } from 'react'
import PassVideo from '@/components/pass-video'
import { getMemberBaseSettingsInfo } from '@/apis/user'
import { onGetMyTotalAssets } from '@/helper/assets/overview'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { UserContractVersionEnum, ContractPreferencesTermsEnum } from '@/constants/trade'
import { setContractVersionChange, getSpecializeThreshold } from '@/apis/trade'
import { useLinkToFutureTradePage } from '@/hooks/features/trade'
import VersionUpgrade from '@/features/trade/future/settings/version-upgrade'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import UpgradeContract from '@/features/trade/future/settings/upgrade-contract'
import { fetchAndUpdateUserInfo } from '@/helper/auth'
import styles from './index.module.css'

const NormalVersionDark = 'image_contract_ordinary_black'
const NormalVersionLight = 'image_contract_ordinary_white'
const ProVersionDark = 'image_contract_major_black'
const ProVersionLight = 'image_contract_major_white'

enum VersionEnum {
  normal = '0',
}

type IVersionProps = {
  title: string
  subTitle: string
  desc: Array<string>
  value: number
  checked: boolean
  videoUrl: string
  imageSrc: string
  isSpecialityLink: boolean
  onCheck: () => void
  checkoutVideo: (v: boolean) => void
}
function Version({
  title,
  value,
  subTitle,
  desc,
  checked,
  imageSrc,
  isSpecialityLink,
  onCheck,
  checkoutVideo,
}: IVersionProps) {
  return (
    <div
      onClick={onCheck}
      className={classNames(styles['version-wrapper'], {
        'is-checked': checked,
      })}
    >
      <div className="main-content">
        <div className="version-header">
          <div className="version-title">
            <div className="title">{title}</div>
            <div className="sub-title">{subTitle}</div>
          </div>
          <Icon name={imageSrc} hasTheme className="version-show-icon" />
        </div>
        <div className="version-header-text">{`${t`features_trade_future_settings_select_version_wkvyyhfwta2kxnzwoxl3r`}${
          value === UserContractVersionEnum.base
            ? t`features_c2c_advertise_advertise_history_index_vyu3ktdhjvdhm1vr-_iav`
            : t`features/trade/future/settings/select-version-1`
        }${t`features_trade_future_settings_select_version_ab-6g7rcordxxg57s63vh`}`}</div>
        <div className="version-desc">
          {desc.map((item, index) => {
            return (
              <div className="mb-2" key={index}>
                {item}
              </div>
            )
          })}
        </div>
        {checked && <Icon name="contract_select" className="version-icon" />}
      </div>
      {isSpecialityLink && (
        <div className="flex justify-end text-sm">
          <div
            className="flex items-center text-brand_color"
            onClick={() => checkoutVideo && checkoutVideo(value === UserContractVersionEnum.professional)}
          >
            {t`features/trade/future/settings/select-version-0`} <Icon name="next_arrow" className="pt-0.5" />
          </div>
        </div>
      )}
    </div>
  )
}

type VersionPopupType = { title: string; lottieNode: ReactNode }

export function VersionPopup({ title, lottieNode }: VersionPopupType) {
  return (
    <div className={styles['select-version-popup-wrapper']}>
      <div className="text-center text-2xl font-medium text-text_color_01">{title}</div>
      <div className="popup-wrapper-animate">{lottieNode}</div>
    </div>
  )
}

export type ISelectVersionSettingProps = {
  onOk?: (isOk: boolean) => void
  isOpenContract?: boolean
}

export type ThresholdType = {
  symbol: string
  threshold: string
  userThreshold: string
}

export function SelectVersionSetting(props: ISelectVersionSettingProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [isButton, setIsButton] = useState<boolean>(false)
  const [showPopup, setShowPopup] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [videoVisible, setVideoVisible] = useState<boolean>(false)
  const [assetsThreshold, setAssetsThreshold] = useState<ThresholdType>()
  const [version, setVersion] = useState<number>(UserContractVersionEnum.base)
  const [contractVersion, setContractVersion] = useState<boolean>(false)
  const [speciality, setSpeciality] = useState<boolean>(false)

  const { theme } = useCommonStore()
  const urlData = useLayoutStore()?.columnsDataByCd
  const { headerData } = useLayoutStore()
  const { preferenceSettings, setPreference } = useFutureTradeStore()
  const { offset } = useAssetsFuturesStore().futuresCurrencySettings || {}
  const linkToFutureTradePage = useLinkToFutureTradePage()
  /** 按钮文字* */
  const settingText = () => {
    const currentVersion = preferenceSettings?.hasOpenSpecializeVersion
    const versionEnum = UserContractVersionEnum.professional
    if (currentVersion !== versionEnum && version === versionEnum) {
      return t`features_trade_future_settings_select_version_j9tq_7f3ienjxfvhvykya`
    }
    return t`user.pageContent.title_12`
  }

  const settingLink = (v: number) => {
    const currentVersion = preferenceSettings?.hasOpenSpecializeVersion
    const versionEnum = UserContractVersionEnum.professional
    const isSpeciality = v === versionEnum
    if (isSpeciality && currentVersion !== versionEnum) {
      return false
    }
    return true
  }

  /** 合约版本* */
  const versions = [
    {
      key: 2,
      imageSrc: 'standard',
      value: UserContractVersionEnum.base,
      title: t`features_c2c_advertise_advertise_history_index_vyu3ktdhjvdhm1vr-_iav`,
      subTitle: t`features/trade/future/settings/select-version-5`,
      desc: [
        t`features_trade_future_settings_select_version_dwtbc8-1lhq96ipn_zxph`,
        t`features_trade_future_settings_select_version_ka0pxrmdpg-homd8x4ena`,
      ],
      videoUrl: urlData?.[ContractPreferencesTermsEnum.contractTeachNormal]?.webUrl,
    },
    {
      key: 1,
      imageSrc: 'major',
      value: UserContractVersionEnum.professional,
      title: t`features/trade/future/settings/select-version-1`,
      subTitle: t`features/trade/future/settings/select-version-2`,
      desc: [
        t`features_trade_future_settings_select_version_hzwomn6bxwpjfvaamrzax`,
        t`features_trade_future_settings_select_version_7e7nijepy6h-e4a9oh2k8`,
        t`features_trade_future_settings_select_version_l2d9papih3ooh3uvht0qo`,
      ],
      videoUrl: urlData?.[ContractPreferencesTermsEnum.contractTeachPro]?.webUrl,
    },
  ]

  /** 获取合约版本* */
  const getContractStatusInd = async () => {
    const res = await getMemberBaseSettingsInfo({})
    if (res.isOk && res.data) {
      const versionId = res.data?.perpetualVersion
      setVersion(versionId || UserContractVersionEnum.base)
    }
    setLoading(false)
    setIsButton(false)
  }

  /** 版本切换* */
  const { run: onConfirm } = useRequest(
    async () => {
      /** 如果是专业版开通要看是否达到阈值* */
      const currentVersion = preferenceSettings?.hasOpenSpecializeVersion
      const versionEnum = UserContractVersionEnum.professional
      setIsButton(true)
      if (currentVersion !== versionEnum && version === versionEnum) {
        const newTotalAmount = await onGetMyTotalAssets()
        const { data, isOk } = await getSpecializeThreshold({})
        setIsButton(false)
        if (!isOk) return
        const totalAmount = newTotalAmount || VersionEnum.normal
        const threshold = data?.threshold || VersionEnum.normal
        if (Number(totalAmount) < Number(threshold)) {
          setAssetsThreshold({
            ...data,
            userThreshold: `${formatCurrency(newTotalAmount, offset)} ${data?.symbol || ''}`,
          })
          setVisible(true)
          return
        }
        return setContractVersion(true)
      }
      const versionRes = await setContractVersionChange({ version })
      setIsButton(false)
      if (!versionRes.isOk && !versionRes.data) return
      setShowPopup(true)
      setPreference()
      getContractStatusInd()
      fetchAndUpdateUserInfo()
    },
    {
      manual: true,
    }
  )

  const onPassVideoClose = async () => {
    setVideoVisible(false)
  }

  const onVersionChange = v => {
    setVersion(v.value)
  }

  /** 关闭合约阈值弹框* */
  const onVersionUpgradeClose = () => {
    setVisible(false)
  }

  useMount(() => {
    setLoading(true)
    getContractStatusInd()
  })

  useCreation(() => {
    let timer: any = null
    if (showPopup) {
      timer = setTimeout(() => {
        linkToFutureTradePage()
      }, 2000)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [showPopup])

  if (showPopup) {
    return (
      <VersionPopup
        title={
          version === UserContractVersionEnum.professional
            ? t({
                id: 'features_trade_future_settings_select_version_5101288',
                values: { 0: headerData?.businessName },
              })
            : t({
                id: 'features_trade_future_settings_select_version_5101289',
                values: { 0: headerData?.businessName },
              })
        }
        lottieNode={
          <DynamicLottie
            loop={false}
            className={'w-80 h-80'}
            whetherManyBusiness
            animationData={
              version === UserContractVersionEnum.professional
                ? theme === ThemeEnum.light
                  ? ProVersionLight
                  : ProVersionDark
                : theme === ThemeEnum.light
                ? NormalVersionLight
                : NormalVersionDark
            }
          />
        }
      />
    )
  }

  return (
    <div className={styles['select-version-wrapper']}>
      <div className="px-4 pt-4 pb-1 flex-1 overflow-auto">
        {versions.map(v => (
          <Version
            key={v.title}
            desc={v.desc}
            title={v.title}
            value={v.value}
            subTitle={v.subTitle}
            videoUrl={v.videoUrl}
            imageSrc={v.imageSrc}
            isSpecialityLink={settingLink(v.value)}
            checked={version === v.value}
            onCheck={() => {
              onVersionChange(v)
            }}
            checkoutVideo={(value: boolean) => {
              setSpeciality(value)
              setVideoVisible(true)
            }}
          />
        ))}
      </div>
      <div className="action">
        <Button loading={isButton} disabled={isButton} onClick={onConfirm} className="w-full" type="primary">
          {settingText()}
        </Button>
      </div>
      {visible && <VersionUpgrade data={assetsThreshold} onClose={onVersionUpgradeClose} />}
      <FullScreenLoading mask isShow={loading} />
      {videoVisible && (
        <PassVideo isSpeciality={speciality} visible={videoVisible} isConfirm={false} onClose={onPassVideoClose} />
      )}
      {contractVersion && <UpgradeContract setVisible={setContractVersion} setButton={setIsButton} />}
    </div>
  )
}
export function SelectVersionSettingInPage() {
  return (
    <div className={styles['select-version-content-wrapper']}>
      <NavBar title={t`features/trade/future/settings/select-version-9`} left={<Icon name="back" hasTheme />} />
      <SelectVersionSetting />
    </div>
  )
}
