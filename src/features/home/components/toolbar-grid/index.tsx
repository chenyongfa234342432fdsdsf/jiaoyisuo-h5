import Icon from '@/components/icon'
import LazyImage from '@/components/lazy-image'
import { ApiStatusEnum } from '@/constants/market/market-list'
import { link } from '@/helper/link'
import { useUserTools } from '@/hooks/features/home/toolbars'
import { useHomeStore } from '@/store/home'
import { t } from '@lingui/macro'
import { Grid } from '@nbit/vant'
import { ComponentProps } from 'react'
import { useScaleDom } from '@/hooks/use-scale-dom'
import { HandleRecreationEntrance } from '@/features/user/utils/common'
import { ToolbarIsExternalLinkEnum } from '@/constants/common'
import { isAbsoluteUrl } from '@/helper/common'
import Image from '@/components/image'
import { useCommonStore } from '@/store/common'
import { ThemeEnum } from '@/constants/base'
import styles from './index.module.css'

export function ToolbarGridItem(props: ComponentProps<typeof Grid.Item>) {
  // limit width to 60px
  const autoScaleRef = useScaleDom(60, null)
  return (
    <Grid.Item
      className={styles['toolbar-grid-item']}
      {...props}
      text={
        props.text && (
          <div ref={autoScaleRef} className={`text-xs text-text_color_01 ${styles['toolbar-grid-item']}`}>
            {props.text}
          </div>
        )
      }
    />
  )
}

function ToolbarGrid() {
  const { toggleMoreToolbar } = useHomeStore()
  const { theme } = useCommonStore()

  const { userTools, apiStatus } = useUserTools()

  const handleLink = (i: number) => {
    if (userTools[i]?.isOutlink === ToolbarIsExternalLinkEnum.yes) {
      HandleRecreationEntrance(userTools[i]?.h5Link)
      return
    }

    link(userTools[i].h5Link, { target: isAbsoluteUrl(userTools[i].h5Link) })
  }

  const renderGridItems = () => {
    const remaining: Array<JSX.Element> = []

    for (let i = 0; i <= userTools.length; i += 1) {
      if (i === userTools.length)
        remaining.push(
          <ToolbarGridItem
            key={i}
            icon={<Icon name="home_more" />}
            text={t`features_home_more_toolbar_header_toolbar_index_510105`}
            onClick={() => toggleMoreToolbar()}
          />
        )
      else {
        let logo = theme === ThemeEnum.dark ? (userTools[i] as any)?.whiteIcon : (userTools[i] as any)?.blackIcon
        if (!logo) logo = userTools[i]?.logo
        remaining.push(
          <ToolbarGridItem key={i} icon={<Image src={logo} />} text={userTools[i].name} onClick={() => handleLink(i)} />
        )
      }
    }

    return remaining
  }

  const renderButton = () => (
    <div className="flex flex-col mx-auto items-center my-4">
      <Icon name="login_plate" className="text-8xl" />
      <div className="edit-button" onClick={() => toggleMoreToolbar()}>
        <span className="edit-text">{t`features_home_toolbar_grid_index_510101`}</span>
      </div>
    </div>
  )

  return (apiStatus === ApiStatusEnum.succeed || apiStatus === ApiStatusEnum.failed) && userTools.length === 0 ? (
    <div className={styles.empty}>{renderButton()}</div>
  ) : (
    <Grid className={styles.scoped} border={false}>
      {renderGridItems()}
    </Grid>
  )
}

export default ToolbarGrid
