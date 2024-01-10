import { t } from '@lingui/macro'
import { useState } from 'react'
import { cloneDeep } from 'lodash'
import Icon from '@/components/icon'
import Link from '@/components/link'
import NavBar from '@/components/navbar'
import { Cell, Switch } from '@nbit/vant'
import { getIsLogin } from '@/helper/auth'
import { I18nsMap } from '@/constants/i18n'
import { useMount, useCreation, useBoolean } from 'ahooks'
import { useInmailStore } from '@/store/inmail/setting'
import { getMemberBaseSettingsInfo } from '@/apis/user'
import { InmailMessageEnum } from '@/constants/inmail'
import { InmailMenuBodyDataType } from '@/typings/api/inmail'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import { getInmailSettings, setNoticeType, setMarketingEmail, getInmailType } from '@/apis/inmail'
import styles from './index.module.css'

enum OrderStatusType {
  enable = 1, // 开启
  noEnable = 2, // 关闭
}

const PushSettings = () => {
  const [selectAll, setSelectAll] = useState<boolean>(false)
  const [languageList, setLanguageList] = useState<string>('')
  const [moduleList, setModuleList] = useState<Array<InmailMenuBodyDataType>>([])

  const [loading, { setTrue, setFalse }] = useBoolean(false)

  const { setting, setSetting } = useInmailStore()
  const isLogin = getIsLogin()

  const getInmailModulesData = async () => {
    const { data, isOk } = await getInmailType({})
    if (isOk && data) {
      setModuleList(data)
    }
  }

  /** 获取语言设置* */
  const getBaseSettingsInfo = async () => {
    if (!isLogin) return
    const res = await getMemberBaseSettingsInfo({})
    if (res.isOk) {
      setLanguageList(I18nsMap[res.data?.pushLanguage as string])
    }
  }

  /** 获取通知类型* */
  const getNoticeType = async () => {
    setTrue()
    const res = await getInmailSettings({})
    if (res.isOk && res.data.modules) {
      const list = res.data.modules
      list.forEach(v => {
        const data = moduleList.find(item => item.id === v.id)
        data && setSetting(data.codeName, true)
      })
      setSetting('email', res.data?.isOpenMarketingEmail === 1)
    }
    setFalse()
  }

  /** 设置通知类型* */
  const onNoticeChange = (type, v) => {
    setSetting(type, v)
    if (type === 'email') {
      const status = !v ? OrderStatusType.noEnable : OrderStatusType.enable
      const options = {
        isOpenMarketingEmail: status,
      }
      setMarketingEmail(options)
    } else {
      let selectMenuData: Array<any> = []
      let noticeList = cloneDeep(setting)
      noticeList[type] = v
      for (let key in noticeList) {
        if (noticeList[key]) {
          const data = moduleList.find(item => item?.codeName === key)
          data && selectMenuData.push(data.id)
        }
      }
      const options = { moduleIds: selectMenuData }
      setNoticeType(options)
    }
  }

  /** 全选* */
  const handleAllSelect = v => {
    let noticeList = cloneDeep(setting)
    moduleList.forEach(item => {
      setSetting(item.codeName, v)
      noticeList[item.codeName as string] = v
    })
    setSetting(InmailMessageEnum.email, v)
    /** 这一块是 7 种类型* */
    let selectMenuData: Array<any> = []
    for (let key in noticeList) {
      if (noticeList[key]) {
        const data = moduleList.find(item => item.codeName === key)
        data && selectMenuData.push(data.id)
      }
    }
    const options = { moduleIds: selectMenuData }
    /** 单独处理营销类邮件开关* */
    const status = !noticeList.email ? OrderStatusType.noEnable : OrderStatusType.enable
    const params = {
      isOpenMarketingEmail: status,
    }
    setSelectAll(v)
    setNoticeType(options)
    setMarketingEmail(params)
  }

  useMount(() => {
    if (isLogin) {
      getInmailModulesData()
    }
  })

  useCreation(() => {
    if (moduleList.length) {
      getNoticeType()
      getBaseSettingsInfo()
    }
  }, [moduleList])

  useCreation(() => {
    let num = 0
    for (let key in setting) {
      if (setting[key]) {
        num += 1
      }
    }
    setSelectAll(num === moduleList.length + 1)
  }, [setting])

  return (
    <div className={styles.scoped}>
      <NavBar title={t`features_inmail_push_settings_index_5101259`} left={<Icon name="back" hasTheme />} />
      <div className="push-settings-wrap wrap-border-bottom">
        <div className="settings-wrap-tooplie">{t`features_inmail_push_settings_index_5101307`}</div>
        <Cell.Group className="settings-wrap-cell" border={false}>
          <Link href="/personal-center/settings/push-language">
            <Cell title={languageList || ''}>
              <Icon name={'next_arrow'} hasTheme className="wrap-cell-icon" />
            </Cell>
          </Link>
        </Cell.Group>
      </div>
      <div className="push-settings-wrap wrap-border-bottom">
        <div className="settings-wrap-tooplie">{t`features_inmail_push_settings_index_5101308`}</div>
        <Cell.Group className="settings-wrap-cell" border={false}>
          {moduleList.map(item => {
            return (
              <Cell key={item.id} title={item.name}>
                <Switch
                  size={20}
                  checked={setting[item.codeName as string]}
                  onChange={v => onNoticeChange(item.codeName, v)}
                />
              </Cell>
            )
          })}
          <Cell title={t`features_inmail_push_settings_index_5101306`}>
            <Switch
              size={20}
              checked={setting[InmailMessageEnum.email]}
              onChange={v => onNoticeChange(InmailMessageEnum.email, v)}
            />
          </Cell>
        </Cell.Group>
      </div>
      <div className="push-settings-wrap">
        <Cell.Group className="settings-wrap-cell" border={false}>
          <Cell title={t`features_inmail_push_settings_index_5101302`}>
            <Switch checked={selectAll} size="24px" onChange={v => handleAllSelect(v)} />
          </Cell>
        </Cell.Group>
        <div className="settings-wrap-bottom">{t`features_inmail_push_settings_index_5101309`}</div>
      </div>
      <FullScreenLoading mask isShow={loading} className="fixed" />
    </div>
  )
}
export default PushSettings
