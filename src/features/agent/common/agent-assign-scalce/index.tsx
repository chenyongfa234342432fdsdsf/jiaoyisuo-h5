import { Button, Form } from '@nbit/vant'
import { ReactNode, useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import { debounce } from 'lodash'
import { getCodeDetailList } from '@/apis/common'
import { YapiGetV1OpenapiComCodeGetCodeDetailListData } from '@/typings/yapi/OpenapiComCodeGetCodeDetailListV1GetApi'
import AgentAssignSlider from '../agent-assign-slider'
import Styles from './index.module.css'
import { AgentPopup } from '../agent-popup'
/**
 * 查询邀请码列表接口请求和相应定义
 */
export type ProductsItemType = {
  /**
   * 产品线：1=现货，2=合约，3=借币，4=三元期权，5=娱乐区
   */
  productCd: string | number
  /**
   * 自身返佣比例
   */
  selfRatio: number | string
  /**
   * 好友返佣比例
   */
  childRatio?: number | string
}
type formRuleType = {
  /**
   * 是否必填
   */
  required: boolean
  /**
   * 提示
   */
  message: string
}
export type scalesArrayItemType = {
  /**
   * 好友比例
   */
  childRatio?: number | string
  /**
   * 可分配最大值
   */
  max: number | string
  /**
   * 可分配最小值
   */
  min?: number
  /**
   * 产品线 Code
   * */
  productCd: string | number
}
type AgentAssignScaleType = {
  /**
   * 弹窗标题
   */
  title: string | ReactNode
  /**
   * 弹窗内容提示
   */
  contentTip?: string | ReactNode
  /**
   * 是否显示
   */
  editVisible: boolean
  /**
   * 表单关闭函数
   */
  onEditClose: () => void
  /**
   * 表单提交函数
   */
  onEditFinish: (values) => void
  /**
   * 提交按钮 loading 状态
   */
  saveLoading: boolean
  /**
   * 可分配产品线数据
   */
  scalesArray: ProductsItemType[]
  /**
   * 内容自定义渲染函数
   */
  contentRender?: (content) => ReactNode
  /**
   * 不能往回拽的标识
   */
  noBackDrag?: boolean
  /**
   * 外部产品线字典值数据
   */
  agentProductLine?: YapiGetV1OpenapiComCodeGetCodeDetailListData[]
  /**
   * popup 组件的其他字段
   */
  [key: string]: any
}
/** 比例分配组件 */
export default function AgentAssignScale({
  noBackDrag = true,
  title,
  contentTip,
  editVisible,
  onEditClose,
  onEditFinish,
  saveLoading,
  scalesArray,
  contentRender,
  agentProductLine,
  ...rest
}: AgentAssignScaleType) {
  const [popForm] = Form.useForm()
  const [productLineList, setProductLineList] = useState<scalesArrayItemType[]>([])
  const [productLineDictionary, setProductLineDictionary] = useState<YapiGetV1OpenapiComCodeGetCodeDetailListData[]>([])
  /** 默认内容 */
  const getContentForm = productLineList => {
    const node = (
      <div className="scale-slider">
        {productLineList.map(i => {
          const { max, friendScale, min, productCd } = i
          const dictionaryItemKey = productLineDictionary?.find(item => item.codeVal === i.productCd)?.codeKey || ''
          const label = t({
            id: 'features_agent_common_agent_assign_scalce_index_g6ajgl09ls',
            values: { 0: dictionaryItemKey },
          })
          const rules = [
            {
              required: true,
              message: t({
                id: 'features_agent_common_agent_assign_scalce_index_tiaxyljb40',
                values: { 0: dictionaryItemKey },
              }),
            },
          ]
          return (
            <>
              <Form.Item
                name={productCd}
                rules={rules}
                key={productCd}
                label={
                  <span className="text-text_color_02 text-sm font-normal">
                    {label}：<span className="text-text_color_01 font-medium">{Number(max)}%</span>
                  </span>
                }
              >
                <AgentAssignSlider
                  min={min || 0}
                  sliderVal={Number(friendScale) || 0}
                  key={productCd}
                  max={Number(max)}
                  onChange={val => popForm.setFieldValue(productCd, val)}
                />
              </Form.Item>
              <Form.Subscribe to={[productCd]}>
                {() => {
                  const currentFieldVal = popForm.getFieldValue(productCd)
                  return (
                    <div className="manage-form-text">
                      <span>
                        {t`features_agent_invite_operation_index_5101486`}{' '}
                        <span className="text-brand_color font-medium">{Number(max || 0) - currentFieldVal}%</span>
                      </span>
                      <span>
                        {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101409`}{' '}
                        <span className="text-brand_color font-medium">{currentFieldVal}%</span>
                      </span>
                    </div>
                  )
                }}
              </Form.Subscribe>
            </>
          )
        })}
      </div>
    )
    return node
  }
  useEffect(() => {
    if (editVisible) {
      /** 获取产品线比例接口 */
      if (agentProductLine) {
        setProductLineDictionary(agentProductLine)
      } else {
        getCodeDetailList({ codeVal: 'agent_product_cd_ratio' }).then(res => {
          setProductLineDictionary(res.data || [])
        })
      }

      const productScalesArray = scalesArray.map(i => {
        const { childRatio, selfRatio, productCd } = i
        popForm.setFieldValue(i.productCd, childRatio || 0)
        return {
          friendScale: Number(childRatio || 0),
          max: Number(selfRatio || 0) + Number(childRatio || 0),
          min: noBackDrag ? Number(childRatio || 0) : 0,
          productCd,
        }
      })
      setProductLineList(productScalesArray)
    }
  }, [editVisible])
  /**
   * 表单关闭时进行初始化
   */
  const onPopFormClose = () => {
    popForm.resetFields()
    onEditClose && onEditClose()
  }
  // 对分配比例表单返回数据进行接口标准格式化
  const scaleFormFormat = async values => {
    const formValue = values
    const ratios = productLineList.reduce<ProductsItemType[]>((pre, current) => {
      const childRatio = values[current.productCd]
      const preItem = {
        childRatio,
        selfRatio: Number(current.max) - Number(childRatio),
        productCd: current.productCd || '',
      }
      delete formValue[current.productCd]
      pre.push(preItem)
      return pre
    }, [])
    await onEditFinish({
      ...formValue,
      ratios,
    })
  }
  return (
    <>
      <AgentPopup
        title={title || t`features_agent_invite_operation_index_5101438`}
        visible={editVisible}
        className={Styles.pop}
        destroyOnClose
        closeable
        {...rest}
        position="bottom"
        onClose={onPopFormClose}
      >
        <Form
          layout="vertical"
          form={popForm}
          className="form-wrap"
          onFinish={debounce(scaleFormFormat, 400)}
          footer={
            <div className="m-4">
              <Button className="submit-button" loading={saveLoading} nativeType="submit" type="primary" block>
                {t`features_agent_invite_operation_index_5101482`}
              </Button>
            </div>
          }
        >
          {contentTip && <div className="content">{contentTip}</div>}
          {/* {getContentForm(scalesArray)} */}
          {typeof contentRender === 'function'
            ? contentRender(getContentForm(productLineList))
            : getContentForm(productLineList)}
        </Form>
      </AgentPopup>
    </>
  )
}
