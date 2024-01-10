import { t } from '@lingui/macro'
import { Popup, Loading } from '@nbit/vant'
import Icon from '@/components/icon'
import { useEffect, useState } from 'react'
import { getTextFromStoreEnums } from '@/helper/store'
import { getUserRebateLevelText } from '@/helper/agent/invite'
import { AgentRebateLadderListProps } from '@/typings/api/agent/invite'
import { getQueryRebateRatioInfoApiRequest } from '@/apis/agent/invite'
import { useAgentStore } from '@/store/agent/agent-invitation-rebate'
import { AgentModeStatusEnum, LevelIconType, AgentGradeUnitEnum } from '@/constants/agent/invite'
import { YapiGetV1AgentSystemQueryRebateRatioInfoData } from '@/typings/yapi/AgentSystemQueryRebateRatioInfoV1GetApi.d'
import styles from './index.module.css'

type RebateLadderPopupProps = {
  mode: AgentModeStatusEnum | string
  visible: boolean
  setVisible: (v: boolean) => void
}

enum LadderTypeEnum {
  AND = 'AND',
}

export default function RebateLadderPopup(props: RebateLadderPopupProps) {
  const { mode, visible, setVisible } = props

  const [loading, setLoading] = useState<boolean>(false)
  const [handleLadderList, setHandleLadderList] = useState<AgentRebateLadderListProps[]>([])
  const [ladderData, setLadderData] = useState<YapiGetV1AgentSystemQueryRebateRatioInfoData>()

  const { agentEnums } = useAgentStore()

  const footerDescData = [
    t`features_agent_agent_invitation_rebate_component_rebate_ladder_popup_index_kbgtd71hy7`,
    t`features_agent_agent_invitation_rebate_component_rebate_ladder_popup_index_rhmimeswzq`,
    t`features_agent_agent_invitation_rebate_component_rebate_ladder_popup_index_ixgh2vw4gd`,
    t({
      id: 'features_agent_agent_invitation_rebate_component_rebate_ladder_popup_index_xlwuiuw_47',
      values: { 0: ladderData?.upgrade },
    }),
    t({
      id: 'features_agent_agent_invitation_rebate_component_rebate_ladder_popup_index_kq0tpudqho',
      values: { 0: ladderData?.demotion, 1: ladderData?.demotion },
    }),
  ]

  const brandColor = v => {
    return `<span class='text-brand_color'>${v}</span>`
  }

  const descText = (v, rebateLadderData, codeData) => {
    let currentLadderText = ''
    v.forEach((item, index) => {
      const lastText = index >= v?.length - 1
      const condition =
        item?.condition === LadderTypeEnum.AND
          ? t`features_agent_agent_invitation_rebate_component_rebate_ladder_popup_index__alzz1s9n_`
          : t`user.third_party_01`
      const findText = codeData?.find(params => params.value === item.codeKey)
      currentLadderText += `${findText?.label} ${brandColor(item.val)} ${
        item?.codeKey === AgentGradeUnitEnum.teamSize
          ? t`features_agent_agent_invitation_rebate_component_rebate_ladder_popup_index_awpaoqtrzc`
          : rebateLadderData?.currencySymbol
      }${lastText ? '' : condition}`
    })
    return currentLadderText
  }

  const getConditionsMetText = (conData, rebateLadderData, textData) => {
    let textDom = ''
    conData.forEach((rules, index) => {
      textDom += `${getUserRebateLevelText(
        rules?.codeKey,
        getTextFromStoreEnums(rules?.codeKey || '', textData)
      )} ${brandColor(rebateLadderData[rules?.codeKey || ''])} ${
        rules?.codeKey === AgentGradeUnitEnum.teamSize
          ? t`features_agent_agent_invitation_rebate_component_rebate_ladder_popup_index_awpaoqtrzc`
          : rebateLadderData?.currencySymbol
      }${index + 1 < conData.length ? '、' : ''}`
    })
    return textDom
  }

  const getModeLadderData = async () => {
    setLoading(true)
    const { data, isOk } = await getQueryRebateRatioInfoApiRequest({ model: mode })
    if (isOk && data) {
      setLadderData(data)
      if (mode === AgentModeStatusEnum.threeLevel) {
        const currentData = data?.threeLiveRebateRatioList
        const currentMaxLive = currentData?.[currentData?.length - 1]?.live
        const newLadderList = currentData?.map(item => {
          const conData = item?.conData?.upDownLiveDataRespDTO
          const currentText = (conData && descText(conData, data, agentEnums.agentThreeGradeRulesEnum.enums)) || ''
          const isCurrentText = getConditionsMetText(conData, data, agentEnums.agentThreeGradeRulesEnum.enums)
          return {
            text: currentText,
            grade: item?.live,
            live: LevelIconType(item?.live),
            oneRebateRatio: item?.oneRebateRatio,
            twoRebateRatio: item?.twoRebateRatio,
            threeRebateRatio: item?.threeRebateRatio,
            isCurrentGrade: item?.live === data?.live,
            isCurrentText,
            maxLive: currentMaxLive,
          }
        })
        setHandleLadderList(newLadderList)
      } else {
        const currentData = data?.areaRebateRatioList
        const currentMaxLive = currentData?.[currentData?.length - 1]?.live
        const newLadderList = currentData?.map(item => {
          const conData = item?.conData?.upDownLiveDataRespDTO
          const currentText = (conData && descText(conData, data, agentEnums.agentAreaGradeRulesEnum.enums)) || ''
          let isCurrentText = getConditionsMetText(conData, data, agentEnums.agentAreaGradeRulesEnum.enums)
          return {
            text: currentText,
            grade: item?.live,
            rebateRatio: item?.rebateRatio,
            live: LevelIconType(item?.live),
            isCurrentGrade: item?.live === data?.live,
            isCurrentText,
            maxLive: currentMaxLive,
          }
        })
        setHandleLadderList(newLadderList)
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    mode && visible && getModeLadderData()
  }, [mode, visible])

  return (
    <Popup
      visible={visible}
      position="bottom"
      onClose={() => setVisible(false)}
      className={styles['rebate-ladder-popup-wrap']}
    >
      <div className="rebate-ladder-content">
        {loading && <Loading className="load" />}
        <div className="header">
          <label>
            {mode === AgentModeStatusEnum.threeLevel
              ? t`features_agent_agent_invitation_rebate_component_rebate_ladder_popup_index_2ernqfa4db`
              : t`features_agent_agent_invitation_rebate_component_rebate_ladder_popup_index_zr68_mumvj`}
          </label>
          <Icon name="close" hasTheme className="header-icon" onClick={() => setVisible(false)} />
        </div>
        <div className="body-wrap">
          <div className="body">
            {handleLadderList?.map(item => {
              return (
                <div className="item" key={item?.live}>
                  <div className="grade">
                    <Icon name={`icon_agent_grade_${item?.live}`} className="grade-icon" />
                    <div className="grade-type">
                      {mode === AgentModeStatusEnum.threeLevel ? (
                        <div className="flex items-center">
                          <div>
                            <label>{t`features_agent_agent_invitation_rebate_component_rebate_ladder_popup_index_cp1bvostcw`}</label>
                            <span className="font-medium">{`${item?.oneRebateRatio || '--'}%`}</span>
                          </div>
                          <div className="ml-4">
                            <label>{t`features_agent_agent_invitation_rebate_component_rebate_ladder_popup_index_qfs66hjav0`}</label>
                            <span className="font-medium">{`${item?.twoRebateRatio || '--'}%`}</span>
                          </div>
                          <div className="ml-4">
                            <label>{t`features_agent_agent_invitation_rebate_component_rebate_ladder_popup_index_vzvtihuacz`}</label>
                            <span className="font-medium">{`${item?.threeRebateRatio || '--'}%`}</span>
                          </div>
                        </div>
                      ) : (
                        <span>{`${item?.rebateRatio}%`}</span>
                      )}
                    </div>
                    {item?.grade === ladderData?.live && <Icon className="ml-6 mt-px" name="login_password_satisfy" />}
                  </div>
                  <div className="grade-text" dangerouslySetInnerHTML={{ __html: item?.text }} />
                  {item?.isCurrentText &&
                    ((ladderData?.live as number) + 1 === item?.grade ||
                      (ladderData?.live === item?.maxLive && item?.maxLive === item?.grade)) && (
                      <div className="grade-text" dangerouslySetInnerHTML={{ __html: item?.isCurrentText }} />
                    )}
                </div>
              )
            })}
          </div>
          <div className="footer">
            {footerDescData?.map((item, index) => {
              return (
                <div key={index} className="footer-item">
                  <Icon name="prompt-symbol" className="footer-item-icon" />
                  <label>{item}</label>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Popup>
  )
}
