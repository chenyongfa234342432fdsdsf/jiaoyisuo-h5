/**
 * 数量/价格展示组件
 * 根据控件宽度和内容实现字体自动缩放及点击展示全部内容功能
 * 整合资产加密展示组件
 */
import { useAssetsStore } from '@/store/assets/spot'
import { Toast } from '@nbit/vant'
import { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { useUpdateEffect, useUpdateLayoutEffect } from 'ahooks'
import { useAgentCenterStore } from '@/store/agent/agent-center/center'
import styles from './index.module.css'

export enum DigitalModuleTypeEnum {
  /** 资产 */
  assets = 'assets',
  /** 代理中心 */
  agent = 'agent',
}
interface CommonDigitalProps {
  content: string | number
  /** 是否需要隐藏金额功能 */
  isEncrypt?: boolean
  className?: string
  style?: any
  children?: any
  /** 省略符号 默认****** */
  ellipsis?: string
  /** 隐藏数据模块类型 */
  moduleType?: string
}

function CommonDigital({
  content,
  isEncrypt = false,
  className,
  style,
  children,
  ellipsis = '******',
  moduleType = DigitalModuleTypeEnum.assets,
}: CommonDigitalProps) {
  const ref: any = useRef(null)
  const spanRef: any = useRef(null)
  const { encryption } = useAssetsStore().assetsModule
  const { encryption: agentEncryption } = useAgentCenterStore()
  const [isOverflow, setIsOverflow] = useState(false)

  const onGetPageEncrypt = () => {
    return {
      [DigitalModuleTypeEnum.assets]: encryption,
      [DigitalModuleTypeEnum.agent]: agentEncryption,
    }[moduleType]
  }

  const pageEncrypt = onGetPageEncrypt()
  const contentText = pageEncrypt && isEncrypt ? ellipsis : content || '--'

  const onChangeSize = () => {
    const outerWidth = ref.current?.offsetWidth
    const childWidth = spanRef.current?.offsetWidth
    setIsOverflow(outerWidth < childWidth)
  }

  useEffect(() => {
    onChangeSize()
  }, [])

  useUpdateEffect(() => {}, [pageEncrypt])

  useUpdateLayoutEffect(() => {
    onChangeSize()
  }, [contentText])

  return (
    <div ref={ref} className={classNames(styles['common-digital-root'], className)} style={style}>
      <span
        ref={spanRef}
        className={`text ${isOverflow ? 'text-zoom' : ''}`}
        onClick={(e: any) => {
          if (!isOverflow || (encryption && isEncrypt)) return

          e.stopPropagation()
          Toast.info(`${content}`)
        }}
      >
        {contentText}
      </span>
      {children}
    </div>
  )
}

export { CommonDigital }
