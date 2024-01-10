import Icon from '@/components/icon'
import { DateOptionsTypes, infoHeaderTypes as InfoHeaderTypesFn } from '@/constants/agent'
import { useAgentStatsStore } from '@/store/agent/agent-gains'
import classNames from 'classnames'
import { partial, remove } from 'lodash'
import InfoColumn from '../info-column'
import StatsInfoPopover from '../stats-info-popover'
import styles from './index.module.css'

type TStatsInfoBar = {
  data: any
  disablePopover?: boolean
}

function StatsInfoBar({ data, disablePopover }: TStatsInfoBar) {
  const { isInfoPopUnderOpen, setInfoPopUnderState, isHideMyInfo } = useAgentStatsStore()
  const infoHeaderTypes = InfoHeaderTypesFn()

  const onChangePopover = (id, isOpen) => {
    setInfoPopUnderState(prev => {
      if (isOpen) return [...prev, id]
      return remove(prev, each => each !== id)
    })
  }
  return (
    <>
      <div className={styles.scoped}>
        <StatsInfoPopover
          disabled={disablePopover}
          onchange={partial(onChangePopover, 0)}
          data={data?.[DateOptionsTypes.now]}
        >
          <InfoColumn
            title={infoHeaderTypes[DateOptionsTypes.now].title}
            popupContent={infoHeaderTypes[DateOptionsTypes.now].content}
            value={data?.[DateOptionsTypes.now]?.total}
            hasIcon
            isHide={isHideMyInfo}
          />
        </StatsInfoPopover>
        <StatsInfoPopover
          disabled={disablePopover}
          onchange={partial(onChangePopover, 1)}
          data={data?.[DateOptionsTypes.last7Days]}
        >
          <InfoColumn
            title={infoHeaderTypes[DateOptionsTypes.last7Days].title}
            popupContent={infoHeaderTypes[DateOptionsTypes.last7Days].content}
            value={data?.[DateOptionsTypes.last7Days]?.total}
            hasIcon
            isHide={isHideMyInfo}
          />
          {!disablePopover && (
            <Icon
              className={classNames('flex justify-center translate-y-1/2', {
                hidden: isInfoPopUnderOpen.length > 0,
              })}
              name={'asset_view_coin_unfold'}
              hasTheme
            />
          )}
        </StatsInfoPopover>
        <StatsInfoPopover
          disabled={disablePopover}
          onchange={partial(onChangePopover, 2)}
          data={data?.[DateOptionsTypes.last30Days]}
        >
          <InfoColumn
            title={infoHeaderTypes[DateOptionsTypes.last30Days].title}
            popupContent={infoHeaderTypes[DateOptionsTypes.last30Days].content}
            value={data?.[DateOptionsTypes.last30Days]?.total}
            hasIcon
            isHide={isHideMyInfo}
          />
        </StatsInfoPopover>
      </div>
      {!disablePopover && isInfoPopUnderOpen.length > 0 && (
        <Icon className="mx-auto translate-y-1/2" name={'asset_view_coin_fold'} hasTheme />
      )}
    </>
  )
}

export default StatsInfoBar
