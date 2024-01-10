import { queryFutureGroupRecords } from '@/apis/future/common'
import CommonList from '@/components/common-list/list'
import { SelectActionSheet } from '@/components/select-action-sheet'
import {
  getGroupRecordStatusEnumName,
  getGroupRecordTypeEnumName,
  GroupRecordStatusEnum,
  GroupRecordTypeEnum,
} from '@/constants/future/group'
import { formatDate } from '@/helper/date'
import { useLoadMore } from '@/hooks/use-load-more'
import { IFutureGroup, IFutureGroupRecord, IQueryFutureGroupRecordsReq } from '@/typings/api/future/common'
import { t } from '@lingui/macro'
import { IncreaseTag } from '@nbit/react'
import { useRequest, useSetState, useUpdateEffect } from 'ahooks'
import { useState } from 'react'
import styles from './index.module.css'

export function GroupRecords({ group }: { group: IFutureGroup }) {
  const statusList = [
    GroupRecordStatusEnum.all,
    GroupRecordStatusEnum.succeed,
    GroupRecordStatusEnum.failed,
    GroupRecordStatusEnum.pending,
  ].map(item => ({
    name: getGroupRecordStatusEnumName(item),
    value: item,
  }))
  const typeList = [GroupRecordTypeEnum.all, GroupRecordTypeEnum.open].map(item => ({
    name: getGroupRecordTypeEnumName(item),
    value: item,
  }))
  const [params, setParams] = useSetState<IQueryFutureGroupRecordsReq>({
    page: 1,
    pageSize: 20,
    type: '',
    status: '',
    coinId: '',
  })
  const { list, loadMore, loading, finished, refresh } = useLoadMore({
    async fetchData(page) {
      const res = await queryFutureGroupRecords({ id: group.id, ...params, page })

      if (!res.isOk || !res.data) {
        return [] as IFutureGroupRecord[]
      }
      return res.data
    },
  })
  useUpdateEffect(() => {
    refresh()
  }, [group.id, params.type, params.status, params.coinId])

  return (
    <div className={styles['group-detail-records-wrapper']}>
      <div className="flex p-4 bg-line_color_02">
        <SelectActionSheet value={params.coinId} label={t`components/footer/index-4`} actions={[]} />
        <SelectActionSheet
          value={params.type}
          label={t`features/assets/financial-record/record-list/record-list-screen/index-1`}
          actions={typeList}
          onChange={v =>
            setParams({
              type: v,
            })
          }
        />
        <SelectActionSheet
          value={params.status}
          label={t`user.security_verification_status_05`}
          actions={statusList}
          onChange={v =>
            setParams({
              status: v,
            })
          }
        />
      </div>
      <CommonList
        onRefreshing={loadMore}
        onLoadMore={refresh}
        refreshing
        finished={finished}
        listChildren={list.map(item => {
          return (
            <div className="record-item rv-hairline--bottom" key={item.id}>
              <div>
                <div>{item.future?.id}</div>
                <div className="sub-text">
                  <span className="mr-1">{formatDate(item.createTime)}</span>
                  <span>{getGroupRecordTypeEnumName(item.type)}</span>
                </div>
              </div>
              <div>
                <IncreaseTag value={item.amount} />
                <div className="sub-text text-right">{getGroupRecordStatusEnumName(item.status)}</div>
              </div>
            </div>
          )
        })}
      />
    </div>
  )
}
