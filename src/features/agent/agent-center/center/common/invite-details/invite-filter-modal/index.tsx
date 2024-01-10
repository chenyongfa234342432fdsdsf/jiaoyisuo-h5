/**
 * 代理中心 - 邀请详情 - 筛选弹窗
 */
import { t } from '@lingui/macro'
import { Button, DatetimePicker, Input, Popup } from '@nbit/vant'
import Icon from '@/components/icon'
import {
  AgentCenterTimeTypeEnum,
  AgentModalTypeEnum,
  InviteCertificationList,
  getAgentCenterTimeTypeNumber,
  getInviteCertificationStatusTypeName,
} from '@/constants/agent/agent-center/center'
import classNames from 'classnames'
import { AgentCenterInviteDetailReq } from '@/typings/api/agent/agent-center/center'
import { useState } from 'react'
import { useGetState, useUpdateEffect } from 'ahooks'
import { CheckTimeDifference, formatDate, getPeriodDayTime } from '@/helper/date'
import { initInviteDetailForm } from '@/store/agent/agent-center/center'
import styles from './index.module.css'

interface InviteFilterModalProps {
  visible: boolean
  form: AgentCenterInviteDetailReq
  model?: string
  onClose: () => void
  onChange: (e) => void
}

enum DateTypeEnum {
  start = 'start',
  end = 'end',
}

function InviteFilterModal(props: InviteFilterModalProps) {
  const { visible, form, model, onClose, onChange } = props || {}
  const [formData, setFormData, getFormData] = useGetState(form)
  const [activeDate, setActiveDate] = useState(DateTypeEnum.start)
  const [hintVisible, setHintVisible] = useState(false)
  const [errInfo, setErrInfo] = useState({
    teamNumErr: '',
    timeErr: '',
  })

  const onCommit = () => {
    if (errInfo?.teamNumErr || errInfo?.timeErr) return
    onChange({ ...getFormData() })
    onClose()
  }

  useUpdateEffect(() => {
    // 数据验证逻辑
    const { teamNumMin, teamNumMax, startTime, endTime } = formData
    const newErrorInfo = { ...errInfo }

    if ((teamNumMin && !teamNumMax) || (!teamNumMin && teamNumMax)) {
      newErrorInfo.teamNumErr = t`features_agent_agent_center_center_common_invite_details_invite_filter_modal_index_zbns86lplx`
    } else if (teamNumMin && teamNumMax && +teamNumMin > +teamNumMax) {
      newErrorInfo.teamNumErr = t`features_agent_agent_center_center_common_invite_details_invite_filter_modal_index_ycxln27voj`
    } else {
      newErrorInfo.teamNumErr = ''
    }

    if ((startTime && !endTime) || (!startTime && endTime)) {
      newErrorInfo.timeErr = t`features_agent_agent_center_center_common_overview_date_picker_index_icvdj21fy6`
    } else if (CheckTimeDifference(startTime, endTime)) {
      newErrorInfo.timeErr = t`features_agent_agent_center_center_common_invite_details_invite_filter_modal_index_3o2xhtpol9`
    } else if (startTime && endTime && startTime > endTime) {
      newErrorInfo.timeErr = t`features_agent_agent_center_center_common_invite_details_invite_filter_modal_index_ffo9pjxjpu`
    } else {
      newErrorInfo.timeErr = ''
    }

    setErrInfo(newErrorInfo)
  }, [formData.teamNumMin, formData.teamNumMax, formData.startTime, formData.endTime])

  return (
    <>
      <Popup
        visible={visible}
        position="bottom"
        onClose={onClose}
        className={styles['invite-filter-modal-root']}
        closeOnPopstate
        safeAreaInsetBottom
        destroyOnClose
      >
        <div className="modal-header">
          <div className="header-title">{t`features/assets/financial-record/record-screen-modal/index-0`}</div>
          <Icon name="close" hasTheme className="close-icon" onClick={onClose} />
        </div>

        <div className="modal-content">
          <div className="filter-label">{t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_list_filter_form_index_5101424`}</div>
          <div className="certification-list">
            {InviteCertificationList?.map(certificationData => {
              return (
                <div
                  className={classNames('certification-cell', {
                    active: certificationData === formData?.isRealName,
                  })}
                  key={certificationData}
                  onClick={() => setFormData({ ...getFormData(), isRealName: certificationData })}
                >
                  {getInviteCertificationStatusTypeName(certificationData)}
                </div>
              )
            })}
          </div>

          <div className="filter-cell-wrap">
            <div className="filter-label">
              {model === AgentModalTypeEnum.threeLevel
                ? t`features_agent_invite_describe_index_5101500`
                : t`constants_agent_index_jszioqtxqu`}
            </div>
            <div className="filter-wrap !mb-0">
              <Input
                value={formData?.teamNumMin}
                type="number"
                onChange={val => setFormData({ ...getFormData(), teamNumMin: val.replace(/[-.]/g, '') })}
                placeholder={t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_list_filter_form_index_5101425`}
                className="filter-cell"
                align="center"
              />

              <div className="filter-interval">-</div>

              <Input
                value={formData?.teamNumMax}
                type="number"
                onChange={val => setFormData({ ...getFormData(), teamNumMax: val.replace(/[-.]/g, '') })}
                placeholder={t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_list_filter_form_index_5101426`}
                className="filter-cell"
                align="center"
              />
            </div>
            {errInfo?.teamNumErr && <div className="err-text">{errInfo.teamNumErr}</div>}
          </div>

          <div className="filter-cell-wrap !pb-5">
            <div className="filter-label">{t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_list_filter_form_index_5101432`}</div>
            <div className="filter-wrap !mb-2">
              <div
                className={classNames('filter-cell', {
                  active: activeDate === DateTypeEnum.start,
                })}
                onClick={() => setActiveDate(DateTypeEnum.start)}
              >
                {formData?.startTime ? formatDate(formData?.startTime) : '--'}
              </div>
              <div className="filter-interval">{t`features_assets_financial_record_datetime_search_index_602`}</div>
              <div
                className={classNames('filter-cell', {
                  active: activeDate === DateTypeEnum.end,
                })}
                onClick={() => setActiveDate(DateTypeEnum.end)}
              >
                {formData?.endTime ? formatDate(formData?.endTime) : '--'}
              </div>
            </div>
            <div className="flex items-center mb-1">
              <div className="date-hint">
                {t`features_agent_agent_gains_detail_index_5101383`} 12{' '}
                {t`features_agent_agent_gains_detail_index_5101384`}
              </div>
              <Icon name="msg" hasTheme className="hint-icon" onClick={() => setHintVisible(true)} />
            </div>

            {errInfo?.timeErr && <div className="err-text">{errInfo.timeErr}</div>}
          </div>

          <DatetimePicker
            type="date"
            showToolbar={false}
            onCancel={onClose}
            maxDate={new Date()}
            value={
              activeDate === DateTypeEnum.start
                ? new Date(
                    formData?.startTime
                      ? formData?.startTime
                      : new Date(new Date(new Date().getTime()).setHours(0, 0, 0, 0)).getTime()
                  )
                : new Date(
                    formData?.endTime
                      ? formData?.endTime
                      : getPeriodDayTime(getAgentCenterTimeTypeNumber(AgentCenterTimeTypeEnum.today)).end
                  )
            }
            onChange={value => {
              if (activeDate === DateTypeEnum.start) {
                setFormData({
                  ...getFormData(),
                  startTime: new Date(new Date(new Date(value).getTime()).setHours(0, 0, 0, 0)).getTime(),
                })
                return
              }

              setFormData({
                ...getFormData(),
                endTime: new Date(new Date(new Date(value).getTime()).setHours(23, 59, 59, 59)).getTime(),
              })
            }}
          />
        </div>

        <div className="modal-bottom">
          <Button
            className="modal-btn mr-4 bg-card_bg_color_02 border-card_bg_color_02"
            onClick={() =>
              setFormData({
                ...initInviteDetailForm,
                uid: formData?.uid,
                registerDateSort: formData?.registerDateSort,
                rebateLevel: formData?.rebateLevel,
              })
            }
          >
            {t`features/assets/financial-record/record-screen-modal/index-1`}
          </Button>
          <Button type="primary" className="modal-btn" onClick={onCommit}>
            {t`assets.financial-record.complete`}
          </Button>
        </div>
      </Popup>

      <Popup className={styles['hint-popup-wrapper']} visible={hintVisible} onClose={() => setHintVisible(false)}>
        <div className="popup-title">{t`features_agent_agent_gains_detail_index_5101379`}</div>
        <div className="popup-content">
          {t`features_agent_agent_center_center_common_invite_details_invite_filter_modal_index_kqhqiucgpy`}
        </div>
        <Button type="primary" className="popup-btn" onClick={() => setHintVisible(false)}>
          {t`features_trade_common_notification_index_5101066`}
        </Button>
      </Popup>
    </>
  )
}

export { InviteFilterModal }
