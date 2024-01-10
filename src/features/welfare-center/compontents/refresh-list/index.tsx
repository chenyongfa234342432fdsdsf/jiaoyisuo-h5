import { List, PullRefresh } from '@nbit/vant'
import DynamicLottie from '@/components/dynamic-lottie'
import CommonListEmpty from '@/components/common-list/list-empty'
import { t } from '@lingui/macro'
import { ReactNode } from 'react'
import { ScrollToTopButton } from '../scroll-to-top-button'

const RefreshLoadingData = 'refresh_loading'
type RefreshListProps = {
  /** 是否显示 loading */
  isShow: boolean
  /** 是否已经加载完毕 */
  finished: boolean
  /** 列表数据 */
  cardListData: any[]
  /** 列表渲染函数 */
  listItem: (item, index) => ReactNode
  /** 列表下拉刷新函数 */
  onRefresh: () => void
  /** 列表滚动到底部加载函数 */
  onLoad?: (params?: any) => Promise<void>
}
export default function RefreshList({ isShow, finished, cardListData, listItem, onRefresh, onLoad }: RefreshListProps) {
  /** 刷新 */
  const onPullRefresh = () => {
    onRefresh && onRefresh()
  }
  /** 加载 */
  const onLoadList = async () => {
    onLoad && (await onLoad())
  }

  return (
    <div>
      {isShow ? (
        <DynamicLottie
          loop
          style={{ width: '25px', height: '25px', margin: '20px auto' }}
          animationData={RefreshLoadingData}
        />
      ) : (
        <PullRefresh onRefresh={onPullRefresh}>
          <List
            finished={finished}
            finishedText={cardListData.length && t`components/common-list/list-footer/index-0`}
            onLoad={onLoadList}
            offset={100}
          >
            {cardListData.length ? (
              cardListData?.map((item, index) => {
                return listItem(item, index)
              })
            ) : (
              <CommonListEmpty />
            )}
          </List>
        </PullRefresh>
      )}
      <ScrollToTopButton />
    </div>
  )
}
