import { createFromIconfontCN } from '@react-vant/icons'
import { ThemeEnum } from '@/constants/base'
import classNames from 'classnames'
import { useCommonStore } from '@/store/common'
import { oss_svg_domain_address, oss_svg_image_domain_address, fusionOssConfig } from '@/constants/oss'
import { useEffect, useState } from 'react'
import { awaitTime } from '@/helper/common'
import LazyImage from '@/components/lazy-image'
import Styles from './index.module.css'

const brandColor = 'brand'

const IconFontModules = {}

interface IconProps {
  className?: string
  spin?: boolean
  hover?: boolean | typeof brandColor
  name: string
  onClick?: any
  rotate?: number
  hasTheme?: boolean
  // 是否远端 oss 图片、svg 链接
  isRemoteUrl?: boolean
  // 隐藏默认的负边距，为了兼容以前的代码，只能默认为 false
  hiddenMarginTop?: boolean
  id?: string
}

/** 等待 iconfont 加载完毕 */
async function awaitIconfontLoaded() {
  const targetEl = document.querySelector('svg symbol')
  if (targetEl) {
    return
  }
  await awaitTime(200)
  await awaitIconfontLoaded()
}

const Icon = (props: IconProps) => {
  const isBrandColor = props.hover === brandColor
  const isTextColor = !isBrandColor && props.hover
  const handleClick = (e: any) => {
    props.onClick && props.onClick(e)
  }
  const commonState = useCommonStore()
  const { theme, isFusionMode } = commonState
  const iconfontUrl = isFusionMode ? fusionOssConfig.absoluteIconfontJs : oss_svg_domain_address
  let IconFont: ReturnType<typeof createFromIconfontCN>
  if (IconFontModules[iconfontUrl]) {
    IconFont = IconFontModules[iconfontUrl]
  } else {
    IconFont = createFromIconfontCN(iconfontUrl)
    IconFontModules[iconfontUrl] = IconFont
  }
  const [isRemoteUrl, setIsRemoteUrl] = useState(props.isRemoteUrl)
  useEffect(() => {
    setIsRemoteUrl(props.isRemoteUrl)
  }, [props.isRemoteUrl])
  // svg 支持明暗色主题切换

  let href = ''
  let iconName = ''

  /** 主题颜色后缀 */
  const themeText = props.hasTheme ? (theme === ThemeEnum.dark ? '_black' : '_white') : ''

  if (isRemoteUrl) {
    /** 渐变色远程链接 */
    href = `${oss_svg_image_domain_address}${props.name}${themeText}.svg`
  } else {
    /** 图标名称 */
    iconName = `icon-${props.name}${themeText}`
  }
  const findSymbolIcon = async () => {
    if (isRemoteUrl) {
      return
    }
    await awaitIconfontLoaded()
    // iconfont 图片里没有的话就用远程的
    const targetEl = document.getElementById(iconName)
    if (targetEl) {
      return
    }
    setIsRemoteUrl(true)
  }

  useEffect(() => {
    findSymbolIcon()
  }, [iconfontUrl])

  return (
    <div
      id={props.id}
      className={classNames(Styles.scoped, props.className, {
        'text-brand_color': isBrandColor,
        'text-text_color_01': isTextColor,
        'hidden-mt': props.hiddenMarginTop,
      })}
      onClick={handleClick}
    >
      {isRemoteUrl ? (
        <div className={`nb-icon icon-${props.name}${themeText}`}>
          <LazyImage src={href} />
        </div>
      ) : (
        <IconFont name={iconName} spin={props.spin} rotate={props.rotate} className="svg-icon" />
      )}
    </div>
  )
}

export default Icon
