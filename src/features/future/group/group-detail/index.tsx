import {
  queryFutureGroupDetail,
  queryFutureGroupWillCloseWhenCancelPledge,
  updateFutureGroupPledge,
} from '@/apis/future/common'
import Icon from '@/components/icon'
import Link from '@/components/link'
import NavBar from '@/components/navbar'
import { formatCurrency } from '@/helper/decimal'
import { IFutureGroup } from '@/typings/api/future/common'
import { t } from '@lingui/macro'
import { Button, Dialog, Tabs, Toast } from '@nbit/vant'
import { useRequest, useMount, useUpdateEffect } from 'ahooks'
import { useState } from 'react'
import { oss_svg_image_domain_address } from '@/constants/oss'
import LazyImage from '@/components/lazy-image'
import { GroupRecords } from './group-records'
import styles from './index.module.css'

function GroupOverview({ group }: { group: IFutureGroup }) {
  const pledgeGroupName = t({
    id: 'features_future_group_group_detail_index_759',
    values: {
      name: group.pledgeBy?.name || group.pledgeTo?.name,
    },
  })
  const { run: onPledge, loading } = useRequest(
    async () => {
      if (!group.pledgeTo) {
        const closeRes = await queryFutureGroupWillCloseWhenCancelPledge({ id: group.id })
        if (!closeRes.isOk) {
          return
        }
        if (closeRes.data) {
          await Dialog.confirm({
            message: t`features_future_group_group_detail_index_760`,
          })
        }
      }
      const res = await updateFutureGroupPledge({ id: group.id })
      if (!res.isOk) {
        return
      }
      if (group.pledgeTo) {
        Toast(t`features_future_group_group_detail_index_761`)
      } else {
        Toast(t`features_future_group_group_detail_index_762`)
      }
    },
    {
      manual: true,
    }
  )

  return (
    <div className={styles['group-detail-overview-wrapper']}>
      <LazyImage src={`${oss_svg_image_domain_address}bg_bedeck.png`} hasTheme className="bedeck-img" />
      <div className="flex justify-between mb-6">
        <div>
          <div className="text-text_color_03 text-xs">
            <span>{t`features_future_group_group_detail_index_763`}</span>
          </div>
          <span className="text-2xl text-text_color_01">{formatCurrency(group.groupAssets || 0, 4)}USD</span>
          <div>
            {/* TODO: 等资产出来了用资产的函数 */}
            <span className="text-text_color_03 text-base">=$123456</span>
          </div>
        </div>
        {(group.pledgeBy || group.pledgeTo) && (
          <div className="text-xs relative">
            <div className="mb-0.5">
              {group.pledgeBy ? (
                <span className="text-brand_color">{t`features_future_group_group_detail_index_764`}</span>
              ) : (
                t`features_future_group_group_detail_index_765`
              )}
            </div>
            <div className="text-brand_color">{pledgeGroupName}</div>
          </div>
        )}
      </div>
      <div className="flex">
        <div className="asset-item">
          <span className="text-xs text-text_color_03">{t`features_future_group_group_detail_index_766`}</span>
          <div className="value">
            <span className="font-semibold text-sm">{formatCurrency(group.extraMarginAssets || 0, 4)}USD</span>
            <Link className="text-brand_color text-xs ml-2" href={`/future/groups/${group.id}/extra-margin`}>
              {t`assets.coin.overview.detail`}&gt;
            </Link>
          </div>
        </div>
      </div>
      <div>
        {group.pledgeTo && (
          <Button
            onClick={onPledge}
            loading={loading}
            className="mt-8"
            block
          >{t`features/assets/futures/futures-list/index-4`}</Button>
        )}
        {!group.pledgeTo && !group.pledgeBy && (
          <Button
            onClick={onPledge}
            loading={loading}
            className="mt-8"
            type="primary"
            block
          >{t`features/assets/futures/futures-list/index-3`}</Button>
        )}
      </div>
    </div>
  )
}

function FutureGroupDetail({ id }: { id: string }) {
  const [group, setGroup] = useState<IFutureGroup>({} as any)
  const { run, loading } = useRequest(
    async () => {
      const res = await queryFutureGroupDetail({ id })
      if (!res.isOk || !res.data) {
        return
      }
      setGroup(res.data)
    },
    {
      manual: true,
    }
  )
  useMount(run)
  useUpdateEffect(() => {
    run()
  }, [id])
  const navTitle = t({
    id: 'features_future_group_group_detail_index_767',
    values: {
      name: group.name,
    },
  })

  return (
    <div>
      <NavBar title={navTitle} />
      <GroupOverview group={group} />
      <div className="h-1 bg-line_color_02"></div>
      <Tabs>
        <Tabs.TabPane name="holdings" title={t`features_future_group_group_detail_index_768`}>
          {t`features_future_group_group_detail_index_768`}
        </Tabs.TabPane>
        <Tabs.TabPane name="records" title={t`features_future_group_group_detail_index_769`}>
          <GroupRecords group={group} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default FutureGroupDetail
