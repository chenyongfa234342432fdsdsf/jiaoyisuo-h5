import Icon from '@/components/icon'
import { Card, Divider } from '@nbit/vant'
import { useAgentStatsStore } from '@/store/agent/agent-gains'
import classNames from 'classnames'
import { link } from '@/helper/link'
import { t } from '@lingui/macro'
import { formatInfoBoxData } from '@/helper/agent/agent'
import { useRebateInfoOverview } from '@/hooks/features/agent'
import { IncreaseTag } from '@nbit/react'
import HideContent from '@/features/agent/common/hide-content'
import styles from './index.module.css'
import StatsInfoBar from './stats-info-bar'

type StatsInfoBoxProps = {
  type: 'income' | 'details' | 'invitation'
  data?: ReturnType<typeof formatInfoBoxData>
}

function StatsInfoBox({ type, data }: StatsInfoBoxProps) {
  const rebateInfo = useRebateInfoOverview()
  const { settlementCurrency, rebateCurrency, isHideMyInfo, toggleIsHideMyInfo } = useAgentStatsStore()

  return (
    <Card className={styles.scoped} round>
      <div
        className={classNames(
          'flex flex-row px-4',
          { 'justify-center': type === 'details' },
          { 'justify-between ': type === 'income' }
        )}
      >
        <span>
          <div className={classNames({ 'flex justify-center items-center': type === 'details' })}>
            <span className="mr-1 text-text_color_02 text-xs">
              {t`features_agent_common_stats_info_box_index_5101375`} ({rebateCurrency || '-'})
            </span>
            <Icon
              name={isHideMyInfo ? 'eyes_close' : 'eyes_open'}
              hasTheme
              className="m-0 text-base"
              onClick={() => toggleIsHideMyInfo()}
            />
          </div>
          <div className={classNames('flex flex-row items-center mt-1', { 'justify-center': type === 'details' })}>
            <HideContent className="info-encrypt" isHide={isHideMyInfo}>
              <IncreaseTag
                hasColor={false}
                hasPrefix={false}
                hasPostfix={false}
                digits={8}
                kSign
                value={rebateInfo?.totalIncome || undefined}
                delZero={false}
                defaultEmptyText={'0.00000000'}
              />
            </HideContent>
            {type === 'income' && (
              <span onClick={() => link('/agent/gains/detail')} className="text-brand_color text-xs ml-1">
                {t`features_agent_common_stats_info_box_index_5101374`}
              </span>
            )}
          </div>
        </span>
        {type !== 'details' && (
          <span>
            <span className="text-text_color_02 text-xs">{t`features_agent_common_stats_info_box_index_5101376`}</span>
            <div className="mt-1">{settlementCurrency}</div>
          </span>
        )}
      </div>
      <Divider />
      <StatsInfoBar data={data} disablePopover={type === 'details'} />
    </Card>
  )
}

export default StatsInfoBox
