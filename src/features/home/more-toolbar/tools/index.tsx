/**
 * all tool components in more-toolbar
 */

import Icon from '@/components/icon'
import LazyImage from '@/components/lazy-image'
import { link } from '@/helper/link'
import { useHomeStore } from '@/store/home'
import { FormattedTools } from '@/typings/api/home/toolbars'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { t } from '@lingui/macro'
import { Grid } from '@nbit/vant'
import classNames from 'classnames'
import { HandleRecreationEntrance } from '@/features/user/utils/common'
import { ToolbarIsExternalLinkEnum } from '@/constants/common'
import { isAbsoluteUrl } from '@/helper/common'
import Image from '@/components/image'
import { useCommonStore } from '@/store/common'
import { ThemeEnum } from '@/constants/base'
import styles from './index.module.css'
import { ToolbarGridItem } from '../../components/toolbar-grid'

type ToolItemProps = FormattedTools[0] & {
  hasText?: boolean
  isDraggable?: boolean
}

const ToolItem = (props: ToolItemProps) => {
  const { hasText = true, isDraggable = false, ...tool } = props
  const { toolbarCurrentState, ToolbarStates, userToolbarSnapshot, addTool, rmTool } = useHomeStore()

  const { theme } = useCommonStore()

  const renderBadgeIcon = () => {
    if (!tool.editable) return null

    return userToolbarSnapshot.find(each => each.name === tool.name) ? (
      !isDraggable ? (
        <Icon className="cursor-pointer" name="home-icon-not-add" hasTheme />
      ) : (
        <Icon className="cursor-pointer" name="home-icon-delete" hasTheme onClick={() => rmTool(tool)} />
      )
    ) : (
      <Icon className="cursor-pointer" name="home-icon-add" hasTheme onClick={() => addTool(tool)} />
    )
  }

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: tool.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleLink = () => {
    if (tool?.isOutlink === ToolbarIsExternalLinkEnum.yes) {
      HandleRecreationEntrance(tool?.h5Link)
      return
    }

    link(tool.h5Link, { target: isAbsoluteUrl(tool.h5Link) })
  }

  let logo = theme === ThemeEnum.dark ? (tool as any)?.whiteIcon : (tool as any)?.blackIcon
  if (!logo) logo = tool?.logo

  const GridItem = (
    <ToolbarGridItem
      className={styles.scoped}
      icon={
        <span {...listeners} onClick={() => (toolbarCurrentState === ToolbarStates.Editable ? null : handleLink())}>
          <LazyImage
            src={logo}
            className={classNames(
              { 'cursor-grab': !isDragging && isDraggable },
              { 'cursor-grabbing': isDragging && !isDraggable }
            )}
          />
        </span>
      }
      badge={{
        content: toolbarCurrentState === ToolbarStates.Editable ? renderBadgeIcon() : null,
      }}
      text={hasText && tool.name}
    />
  )

  return !isDraggable ? (
    GridItem
  ) : (
    <span ref={setNodeRef} style={style} {...attributes}>
      {GridItem}
    </span>
  )
}

const ResetTool = () => {
  const { updateSnapshot } = useHomeStore()

  return (
    <ToolbarGridItem
      className={styles.scoped}
      icon={<Icon name="a-home-icon-reset" hasTheme />}
      text={t`features/assets/financial-record/record-screen-modal/index-1`}
      onClick={() => updateSnapshot(prev => [] /* getDefaultTools() */)}
    />
  )
}

const PlaceholderTool = () => <Grid.Item className={styles.placeholder} icon={<Icon name="add" hasTheme />} />

export { ToolItem, ResetTool, PlaceholderTool }
