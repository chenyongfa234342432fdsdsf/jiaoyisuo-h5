import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { Popup, Button } from '@nbit/vant'
import { useState, useEffect } from 'react'
import { getCodeDetailList } from '@/apis/common'
import LazyImage, { Type } from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { getProductRatioApiRequest } from '@/apis/agent/invite'
import styles from './index.module.css'

type RebateApplyPopupProps = {
  visible: boolean
  onChange?: () => void
  setVisible: (v: boolean) => void
}

type RebateDataType = {
  name: string
  productCd: string
  selfRatio: number
}

export default function RebateApplyPopup(props: RebateApplyPopupProps) {
  const { visible, onChange, setVisible } = props

  const [rebateData, setRebateData] = useState<Array<RebateDataType>>([])

  const getRebateApplyData = async () => {
    const { data } = await getCodeDetailList({ codeVal: 'agent_product_cd_ratio' })
    const { data: applyData, isOk } = await getProductRatioApiRequest({})
    if (isOk && data && applyData) {
      const newData = applyData?.products?.map(item => {
        const findData = data?.find(params => params.codeVal === item.productCd)
        return {
          ...item,
          name: findData?.codeKey,
        }
      })
      setRebateData(newData)
    }
  }

  const onApplyChange = () => {
    onChange && onChange()
  }

  useEffect(() => {
    getRebateApplyData()
  }, [])

  return (
    <Popup visible={visible} onClose={() => setVisible(false)} className={styles['rebate-apply-wrap']}>
      <div className="apply-content-wrap">
        <div className="popup-wrap">
          <div className="popup-header-background">
            <p>{t`features_agent_invite_operation_index_5101469`}</p>
          </div>
          <LazyImage
            hasTheme
            imageType={Type.png}
            className={'popup-header-image'}
            src={`${oss_svg_image_domain_address}agent/v3/image_agent_success`}
          />
          <div className="popup-header-content">
            <span>
              <label>{t`features_agent_agent_invitation_rebate_component_rebate_apply_popup_index_f2acgmrmhv`}</label>
              <label className="text-brand_color">{t`features_agent_agent_invitation_rebate_component_rebate_apply_popup_index_tqts3kgjuc`}</label>
              <label>{t`features_agent_agent_invitation_rebate_component_rebate_apply_popup_index_xysrgloeve`}</label>
            </span>
            <span>
              <label>{t`features_agent_invite_operation_index_5101472`}</label>
              {rebateData?.map((item, index) => {
                return (
                  <label key={item?.productCd} className="text-brand_color">{` ${item?.name} ${item?.selfRatio}%${
                    index >= rebateData?.length - 1 ? '' : ', '
                  }`}</label>
                )
              })}
              <label>{` ${t`features_agent_agent_invitation_rebate_component_rebate_apply_popup_index_sq3_7b_al4`}`}</label>
            </span>
            <span>{t`features_agent_agent_invitation_rebate_component_rebate_apply_popup_index_fafnwxfvpd`}</span>
            <span>{t`features_agent_agent_invitation_rebate_component_rebate_apply_popup_index_pzyxzdbmfy`}</span>
            <Button type="primary" onClick={onApplyChange}>
              {t`features_agent_invite_operation_index_5101481`}
            </Button>
          </div>
        </div>
        <div className="popup-icon">
          <Icon name="agent_popup_close" className="wrap-icon" onClick={() => setVisible(false)} />
        </div>
      </div>
    </Popup>
  )
}
