import { useEffect, useRef, useState } from 'react'
import { t } from '@lingui/macro'

import classNames from 'classnames'
import Icon from '@/components/icon'
import { requestWithLoading } from '@/helper/order'
import { getCodeDetailList } from '@/apis/common'
import { YapiGetV1OpenapiComCodeGetCodeDetailListData } from '@/typings/yapi/OpenapiComCodeGetCodeDetailListV1GetApi'
import { getV1WelfareMissionListApiRequest } from '@/apis/welfare-center'

import { link } from '@/helper/link'
import { useLayoutStore } from '@/store/layout'

import { TaskType, TaskTypeCode, ruleHomeColumnCd } from '@/constants/welfare-center/common'
import ChallengeList from './challenge-list'
import AchievementList from './achievement-list'
import styles from './index.module.css'

function MyTask() {
  const [cardActive, setCardActive] = useState(TaskType.challenge)

  const [historyFinished, setHistoryFinished] = useState<boolean>(false)
  const [historyPositionList, setHistoryPositionList] = useState<any>([])

  const [pageNum, setPageNum] = useState(1)

  const [businessScene, setBusinessScene] = useState<Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>>([])
  const [couponType, setCouponType] = useState<Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>>([])
  const [couponCode, setCouponCode] = useState<Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>>([])
  const [status, setStatus] = useState<Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>>([])
  const [taskTypeCode, setTaskTypeCode] = useState<Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>>([])
  const [condition, setCondition] = useState<Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>>([])
  const [missionCondition, setMissionCondition] = useState<Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>>([])

  const onLoadHistory = async (isRefresh?: boolean) => {
    const params = {
      missionType: cardActive === TaskType.challenge ? TaskTypeCode.challenge : TaskTypeCode.achievements,
      pageNum: isRefresh ? 1 : pageNum,
      pageSize: 20,
    }

    const res = await getV1WelfareMissionListApiRequest(params as any)

    const { isOk, data } = res || {}
    if (!isOk || !data) {
      setHistoryFinished(true)
      return
    }

    const nList = isRefresh ? data.list : [...historyPositionList, ...data.list]
    setHistoryFinished(nList.length >= +data?.total)
    setHistoryPositionList(nList)

    setPageNum(isRefresh ? 1 : pageNum + 1)
  }

  useEffect(() => {
    requestWithLoading(onLoadHistory(true), 0)
  }, [cardActive])

  useEffect(() => {
    Promise.all([
      /** 使用场景枚举 */
      getCodeDetailList({ codeVal: 'business_scene' }),
      /** 卡券分类枚举 */
      getCodeDetailList({ codeVal: 'coupon_type_cd' }),
      /** 卡券类型枚举 */
      getCodeDetailList({ codeVal: 'coupon_name_cd' }),
      /** 优惠券状态字典 */
      getCodeDetailList({ codeVal: 'status' }),
      /** 任务类型枚举 */
      getCodeDetailList({ codeVal: 'welfare_mission_type_code' }),
      /** 条件 */
      getCodeDetailList({ codeVal: 'welfare_common_condition_scene_options' }),
      getCodeDetailList({ codeVal: 'welfare_achievments_mission_condition_options' }),
    ]).then(
      ([
        businessSceneRes,
        couponTypeRes,
        couponCodeRes,
        statusRes,
        taskTypeCodeRes,
        conditionRes,
        missionConditionRes,
      ]) => {
        if (businessSceneRes.isOk) {
          setBusinessScene(businessSceneRes.data || [])
        }

        if (couponTypeRes.isOk) {
          setCouponType(couponTypeRes.data || [])
        }

        if (couponCodeRes.isOk) {
          setCouponCode(couponCodeRes.data || [])
        }

        if (statusRes.isOk) {
          setStatus(statusRes.data || [])
        }

        if (taskTypeCodeRes.isOk) {
          setTaskTypeCode(taskTypeCodeRes.data || [])
        }

        if (conditionRes.isOk) {
          setCondition(conditionRes.data || [])
        }

        if (missionConditionRes.isOk) {
          setMissionCondition(missionConditionRes.data || [])
        }
      }
    )
  }, [])

  let taskUrl = ''
  const layoutProps = useLayoutStore()
  const columnsDataByCd = layoutProps?.columnsDataByCd

  if (columnsDataByCd) {
    taskUrl = columnsDataByCd[ruleHomeColumnCd.activity_center]?.h5Url || ''
  }

  return (
    <div className={styles.scoped}>
      {/* <NoDataImage className="mt-8" /> */}

      <div className="w-full px-4 box-border flex justify-between items-center mt-4 h-[30px]">
        <div>
          <span
            className={classNames('btn', {
              active: cardActive === TaskType.challenge,
            })}
            onClick={() => {
              setCardActive(TaskType.challenge)
              setHistoryPositionList([])
            }}
          >{t`features_welfare_center_my_task_index_jnab2yzlfj`}</span>
          <span
            className={classNames('btn', {
              active: cardActive === TaskType.achievement,
            })}
            onClick={() => {
              setCardActive(TaskType.achievement)
              setHistoryPositionList([])
            }}
          >{t`features_welfare_center_my_task_index_pqdk4q2gme`}</span>
        </div>
        <div className="flex items-center">
          <div
            onClick={() => {
              link(taskUrl)
            }}
            style={{
              borderBottom: '0.5px solid var(--brand_color)',
            }}
            className={classNames('common-12-content text-brand_color mr-3')}
          >{t`features_welfare_center_my_task_index_d28k_nn1pb`}</div>
          <Icon
            onClick={() => {
              link('/welfare-center/task-record')
            }}
            name="recreation_historical_record"
            className="!mt-0 text-[18px] text-text_color_02"
          />
        </div>
      </div>
      <div className="w-full px-4 box-border">
        {cardActive === TaskType.challenge ? (
          <ChallengeList
            businessScene={businessScene}
            couponType={couponType}
            couponCode={couponCode}
            status={status}
            taskTypeCode={taskTypeCode}
            condition={condition}
            onLoadHistory={onLoadHistory}
            historyPositionList={historyPositionList}
            historyFinished={historyFinished}
          />
        ) : (
          <AchievementList
            businessScene={businessScene}
            couponType={couponType}
            couponCode={couponCode}
            status={status}
            taskTypeCode={taskTypeCode}
            missionCondition={missionCondition}
            onLoadHistory={onLoadHistory}
            historyPositionList={historyPositionList}
            historyFinished={historyFinished}
          />
        )}
      </div>
    </div>
  )
}

export default MyTask
