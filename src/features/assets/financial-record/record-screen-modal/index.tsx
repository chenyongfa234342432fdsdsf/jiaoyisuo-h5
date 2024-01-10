/**
 * 财务记录 - 筛选弹窗
 */
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { useState } from 'react'
import { Popup, Checkbox, Button, Toast } from '@nbit/vant'
import CommonDatePicker from '@/components/common-date-picker/index'
import { AssetsRecordDateTypeEnum } from '@/constants/assets/common'
import { FinancialRecordRebateTypeEnum, FinancialRecordRouteEnum, FinancialRecordStateEnum } from '@/constants/assets'
import { getBeforeDate } from '@/helper/date'
import { IAssetsRecordResp } from '@/typings/assets'
import { useAssetsStore } from '@/store/assets/spot'
import { getTextFromStoreEnums } from '@/helper/store'
import { createCheckboxIconRender } from '@/components/radio/icon-render'
import styles from './index.module.css'

interface RecordScreenModalProps {
  form: IAssetsRecordResp
  visible: boolean
  onClose: () => void
  onScreen: (e) => void
}

const checkboxIconRender = createCheckboxIconRender('text-base')

function RecordScreenModal(props: RecordScreenModalProps) {
  const { form, visible = false, onClose, onScreen } = props
  const { activeTab } = useAssetsStore().recordModule
  const { assetsEnums } = useAssetsStore()

  const assetsRecordStatusList = assetsEnums.financialRecordStateEnum.enums
  const assetsRecordRebateTypeList = assetsEnums.financialRecordRebateTypeList.enums
  const defaultFormData: IAssetsRecordResp = {
    startDate: getBeforeDate(AssetsRecordDateTypeEnum.week),
    endDate: new Date(new Date(new Date().getTime()).setHours(23, 59, 59, 59)).getTime(),
    dateType: AssetsRecordDateTypeEnum.week,
    status: [
      FinancialRecordStateEnum.success,
      FinancialRecordStateEnum.processing,
      FinancialRecordStateEnum.fail,
      FinancialRecordStateEnum.error,
    ],
    rebateType: [FinancialRecordRebateTypeEnum.selfRebate, FinancialRecordRebateTypeEnum.teamRebate],
  }
  const [formData, setFormData] = useState<IAssetsRecordResp>(form)

  /**
   * 关闭弹窗
   */
  const onCloseModal = () => {
    onClose()
  }

  const onRenderStatus = () => {
    return (
      <>
        <span className="screen-title mt-3.5">{t`user.security_verification_status_05`}</span>
        <Checkbox.Group
          defaultValue={formData.status}
          value={formData.status}
          direction="horizontal"
          iconSize={14}
          onChange={(names: any[]) => {
            if (
              names.length === 0 ||
              ((activeTab === FinancialRecordRouteEnum.contract || activeTab === FinancialRecordRouteEnum.fee) &&
                names.length === 1)
            ) {
              Toast.info(t`features_assets_financial_record_record_screen_modal_index_5101101`)
              return
            }
            setFormData({ ...formData, status: names })
          }}
        >
          <div className="status-list">
            {assetsRecordStatusList.map(statusItem => {
              if (
                (activeTab === FinancialRecordRouteEnum.contract ||
                  activeTab === FinancialRecordRouteEnum.fee ||
                  activeTab === FinancialRecordRouteEnum.derivative) &&
                statusItem.value === FinancialRecordStateEnum.processing
              )
                return

              if (
                activeTab === FinancialRecordRouteEnum.derivative &&
                statusItem.value === FinancialRecordStateEnum.error
              )
                return
              return (
                <Checkbox
                  name={statusItem.value}
                  key={statusItem.value}
                  shape="square"
                  className="status-item"
                  iconRender={checkboxIconRender}
                >
                  {getTextFromStoreEnums(statusItem.value, assetsEnums.financialRecordStateEnum.enums)}
                </Checkbox>
              )
            })}
          </div>
        </Checkbox.Group>
      </>
    )
  }

  const onRenderRebateType = () => {
    return (
      <>
        <span className="screen-title mt-3.5">{t`features_assets_financial_record_record_list_record_list_screen_index_ytmqhrglog`}</span>
        <Checkbox.Group
          defaultValue={formData.rebateType}
          value={formData.rebateType}
          direction="horizontal"
          iconSize={16}
          onChange={(names: any[]) => {
            if (names.length === 0) {
              Toast.info(t`features_assets_financial_record_record_screen_modal_index_gwktyzwqf7`)
              return
            }
            setFormData({ ...formData, rebateType: names })
          }}
        >
          <div className="status-list">
            {assetsRecordRebateTypeList.map(statusItem => {
              return (
                <Checkbox
                  name={statusItem.value}
                  key={statusItem.value}
                  shape="square"
                  className="status-item"
                  iconRender={checkboxIconRender}
                >
                  {getTextFromStoreEnums(statusItem.value, assetsEnums.financialRecordRebateTypeList.enums)}
                </Checkbox>
              )
            })}
          </div>
        </Checkbox.Group>
      </>
    )
  }

  return (
    <Popup
      visible={visible}
      position="bottom"
      round
      className={styles['record-screen-modal-root']}
      lockScroll
      destroyOnClose
      closeOnPopstate
      safeAreaInsetBottom
      onClose={onCloseModal}
    >
      <div className="record-screen-modal-warp">
        <div className="screen-header">
          <span>{t`features/assets/financial-record/record-screen-modal/index-0`}</span>
          <Icon hasTheme name="close" className="close-icon" onClick={onCloseModal} />
        </div>
        <CommonDatePicker
          onChange={(params: any) => {
            setFormData({
              ...formData,
              startDate: params.startDate,
              endDate: params.endDate,
              dateType: params.dateType,
            })
          }}
          startDate={formData.startDate}
          endDate={formData.endDate}
          dateType={formData.dateType}
          dateTemplate={'YYYY-MM-DD'}
        />

        {activeTab !== FinancialRecordRouteEnum.commission &&
          activeTab !== FinancialRecordRouteEnum.c2c &&
          onRenderStatus()}
        {/* TODO: 返佣下屏蔽返佣类型筛选 */}
        {/* {activeTab === FinancialRecordRouteEnum.commission && onRenderRebateType()} */}

        <div className="buttons">
          <Button
            className="reset-btn"
            onClick={() => {
              setFormData(defaultFormData)
            }}
          >{t`features/assets/financial-record/record-screen-modal/index-1`}</Button>
          <Button
            className="screen-btn"
            type="primary"
            onClick={() => onScreen(formData)}
          >{t`features/assets/financial-record/record-screen-modal/index-0`}</Button>
        </div>
      </div>
    </Popup>
  )
}

export { RecordScreenModal }
