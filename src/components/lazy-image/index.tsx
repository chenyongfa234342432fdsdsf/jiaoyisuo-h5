import { useState, useMemo } from 'react'
import { ThemeEnum } from '@/constants/base'
import { useCommonStore } from '@/store/common'
import { LazyLoadImage, LazyLoadImageProps } from 'react-lazy-load-image-component'
import { oss_svg_image_domain_address, getIsNotMonkeyManyMerchantMode } from '@/constants/oss'
import classNames from 'classnames'
import { fastUrlUtils } from '@nbit/utils'
import styles from './index.module.css'

const { getFastUrl, getFastManyBusinessUrl, injectThemeImgUrl } = fastUrlUtils

type imageSrc = LazyLoadImageProps & {
  /** 图片地址 * */
  src: string
  width?: number
  height?: number
  imageType?: Type
  /** 图片底部名称 * */
  imageName?: string
  /** 是否是主题色图片 * */
  hasTheme?: boolean
  className?: string
  /** 是否圆角 * */
  round?: boolean
  /** 圆角大小 * */
  radius?: number
  alt?: string
  /** 加载图标和失败图标的大小 * */
  iconSize?: number | string
  /** 图片加载失败时触发 * */
  onError?: () => void
  /** 图片加载完毕时触发 * */
  afterLoad?: () => void
  /**  在占位符被图像元素替换之前调用的函数。* */
  beforeLoad?: () => void
  renderOriginalSize?: boolean
  /** 是否需要占位图片 * */
  whetherPlaceholdImg?: boolean
  /** 是否是多商户模式图片 * */
  whetherManyBusiness?: boolean
}
export enum Type {
  svg = '.svg',
  png = '.png',
}

type ImgDimension = {
  width?: number
  height?: number
}

const LazyImage = (props: imageSrc) => {
  const {
    src,
    round = false,
    className,
    hasTheme,
    imageName,
    imageType,
    renderOriginalSize = false,
    whetherPlaceholdImg = false,
    whetherManyBusiness = false,
    ...other
  } = props
  const commonState = useCommonStore()
  const themeName = commonState?.theme === ThemeEnum.dark ? '_black' : '_white'
  /** 渐变色 svg * */
  const svgAddress = oss_svg_image_domain_address

  const [dimensions, setDimensions] = useState<ImgDimension>({})

  const svgHref = `${svgAddress}load_fail_icon${themeName}${Type.svg}`
  /** 加载失败或加载时的图像 src * */
  const placeholderSrc = whetherPlaceholdImg ? (
    <img
      src={svgHref}
      alt={other.alt}
      width={renderOriginalSize ? dimensions.width : other.width}
      height={renderOriginalSize ? dimensions.height : other.height}
    />
  ) : undefined

  /**
   * retrieve img original size
   */
  const onImgLoad = ({ target }: { target: HTMLImageElement }) => {
    setDimensions({
      width: target.naturalWidth,
      height: target.naturalHeight,
    })
    return true
  }

  const href = useMemo(() => {
    if (typeof src !== 'string') {
      console.error('Image: 传入的 src 非字符串请检查', src)
      return src
    }
    const fastSrc = getFastUrl(src)
    const _src = getFastManyBusinessUrl(
      fastSrc,
      whetherManyBusiness && getIsNotMonkeyManyMerchantMode(),
      commonState?.businessId
    )
    if (hasTheme) {
      if (imageType) {
        return injectThemeImgUrl(`${_src}${imageType}`, themeName)
      }
      return injectThemeImgUrl(`${_src}`, themeName)
    }
    if (imageType) {
      return `${_src}${imageType}`
    }
    return `${_src}`
  }, [src, imageType, hasTheme, themeName])

  if (!href) {
    // fix：api 加载的时候图片内容，如果图片的地址为空，则直接返回占位。
    return (
      <span
        style={{
          width: other.width || 0,
          height: other.height || 0,
        }}
      />
    )
  }

  const placeholder = placeholderSrc ? { placeholder: placeholderSrc } : {}
  return (
    <div
      style={{ width: other.width, height: other.height }}
      className={classNames(styles.scoped, className, round ? 'lazy-radius' : '')}
    >
      <LazyLoadImage {...other} src={href} {...placeholder} onLoad={renderOriginalSize ? onImgLoad : () => {}} />
      <label>{imageName || ''}</label>
    </div>
  )
}
export default LazyImage
