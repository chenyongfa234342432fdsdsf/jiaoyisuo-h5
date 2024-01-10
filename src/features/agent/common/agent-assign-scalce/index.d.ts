import { ReactNode } from 'react'

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
  childRatio: number | string
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
  friendScale?: number | string
  /**
   * 可分配最大值
   */
  max: number | string
  /**
   * 标签名称
   */
  label: string
  /**
   * 表单校验规则
   */
  rules: formRuleType[]
  /**
   * 可分配最小值
   */
  min?: number
  /**
   * 产品线 Code
   * */
  productCd: string
}
export type AgentAssignScaleType = {
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
  scalesArray: scalesArrayItemType[]
  /**
   * 内容自定义渲染函数
   */
  contentRender?: (content) => ReactNode
  /**
   * popup 组件的其他字段
   */
  [key: string]: any
}
