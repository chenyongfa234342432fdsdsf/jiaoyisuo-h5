import classNames from 'classnames'
import { useEffect, FC, ReactNode } from 'react'
import { NavBar as VantNavBar } from '@nbit/vant'
import { isApp } from '@/helper/is-app'
import { usePageContext } from '@/hooks/use-page-context'
import { JsbridgeCommandsEnum, JsbridgeToggleTitleBarParamsEnum } from '@/constants/js-bridge'
import useJsbridge from '@/hooks/use-jsbridge'
import { omitBy } from 'lodash'
import { navigateBackHelper } from '@/helper/link'
import { useCommonStore } from '@/store/common'
import Icon from '../icon'
import styles from './index.module.css'

export type ApptextColorType = 'brand_color'

type AppNavRightType = Partial<{
  iconUrl: string
  text: string
  textColor: ApptextColorType
  onClickRight: () => void
}>

export type INavBarProps = {
  title: ReactNode
  transparent?: boolean
  right?: ReactNode
  left?: ReactNode
  iconUrl?: string
  onClickLeft?: () => void
  // 控制 app 左侧按钮返回逻辑
  onClickLeftApp?: () => void
  onClickRight?: () => void
  // 是否将 nav bar 的内容直接在 app 的 header 下展示
  isShowUnderAppNavBar?: boolean
  hasBottomBorder?: boolean

  appRightConfig?: AppNavRightType
}

/** 导航栏组件，后期会兼容 App，先占位 */
const NavBar: FC<INavBarProps> = ({
  title,
  right,
  left,
  onClickLeft,
  onClickLeftApp,
  onClickRight,
  transparent = false,
  hasBottomBorder = true,
  isShowUnderAppNavBar = false,
  appRightConfig,
}) => {
  const jsbridge = useJsbridge()
  const isInApp = isApp()

  const pageContext = usePageContext()

  // app 环境支持右侧图表和点击 callback
  useEffect(() => {
    if (!isInApp) return
    if (!jsbridge.value) {
      return
    }

    if (pageContext?.path === '/agent' || pageContext?.path?.substring(0, 7) === '/agent/') {
      if (jsbridge.value.call(JsbridgeCommandsEnum.isLogin)) {
        if (appRightConfig && appRightConfig.onClickRight) {
          jsbridge.value.register('rightClickCallback', appRightConfig.onClickRight)
          jsbridge.value.call(
            JsbridgeCommandsEnum.bindRightButtonEvent,
            // text 和 iconUrl 不可同时存在
            omitBy(
              {
                text: appRightConfig.text,
                textColor: appRightConfig.textColor,
                iconUrl: appRightConfig.iconUrl,
                callbackName: 'rightClickCallback',
              },
              x => !x
            )
          )
        }

        if (onClickLeftApp) {
          jsbridge.value.register('leftClickCallback', onClickLeftApp)
          jsbridge.value.call(JsbridgeCommandsEnum.bindLeftButtonEvent, {
            callbackName: 'leftClickCallback',
          })
        }
      }
    }

    // app 环境更新页面标题，如果没有提供，则重置为空
    if (typeof title !== 'string' || !title) title = ''
    jsbridge.value.call(JsbridgeCommandsEnum.changeTitle, title)

    // app 环境更新页面，如果没有提供右侧逻辑，则重置
    if (!appRightConfig) {
      jsbridge.value.register('rightClickCallback', () => {})
      jsbridge.value.call(JsbridgeCommandsEnum.bindRightButtonEvent, {})
    }
  }, [jsbridge.value, title])
  const { c2cMode } = useCommonStore()
  const isC2cPublicInApp = c2cMode.isPublic
  useEffect(() => {
    if (!isInApp) return
    if (!jsbridge.value) {
      return
    }
    // 公有 c2c 在 app 下隐藏原生导航栏，不必考虑还原 TODO: 这里还是应该优化成单个属性
    if (isC2cPublicInApp) {
      jsbridge.value.call(JsbridgeCommandsEnum.toggleTitleBar, JsbridgeToggleTitleBarParamsEnum.disable)
    }
  }, [c2cMode.isPublic, isInApp])

  const onClickLeftHandle = () => {
    if (onClickLeft) {
      onClickLeft?.()
    } else {
      navigateBackHelper()
    }
  }

  // h5 环境 或者 app 环境下的公有 c2c，这一块不加属性是因为涉及页面较多，一个一个加会有遗漏，这里统一处理即可
  if (!isInApp || isC2cPublicInApp) {
    return (
      <div
        className={classNames(styles['navbar-wrapper'], {
          'is-transparent': transparent,
        })}
      >
        <VantNavBar
          border={hasBottomBorder}
          leftArrow={
            left !== undefined ? (
              left
            ) : (
              <div>
                <Icon hasTheme name="back" className="text-lg" />
              </div>
            )
          }
          rightText={right}
          className="vant-navbar"
          title={title}
          onClickLeft={onClickLeftHandle}
          onClickRight={onClickRight}
        />
      </div>
    )
  } else {
    // app 环境
    if (!isShowUnderAppNavBar) return null

    return (
      <div
        className={classNames(
          styles['navbar-wrapper'],
          {
            'is-transparent': transparent,
          },
          styles['navbar-wrapper-app']
        )}
      >
        {/* 不需要左侧返回按钮 和 右侧逻辑 */}
        <VantNavBar leftArrow={null} leftText={null} rightText={null} title={title} />
      </div>
    )
  }
}

export default NavBar
