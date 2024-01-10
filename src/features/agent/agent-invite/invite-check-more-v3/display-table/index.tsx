import { useAgentInviteStore } from '@/store/agent/agent-invite'
import classNames from 'classnames'
import { Popup, List, Loading } from '@nbit/vant'
import { useEffect, useRef, useState } from 'react'
import { t } from '@lingui/macro'
import { ApiStatusEnum } from '@/constants/market/market-list'
import useScrollBottom from '@/hooks/features/agent/scroll-bottom'
import NoDataImage from '@/components/no-data-image'
import Icon from '@/components/icon'
import { getInviteDetailsTableColumnSchema } from './table-schema'
import styles from './index.module.css'
import { getDetailSchema } from './detail-schema'

type productRebateListType = {
  productCd: string
  ratio: number
}
enum tableDetailKeyEnum {
  /** 产品线返佣比例列表 */
  productRebateList = 'productRebateList',
}
type tableCellDataType = {
  productRebateList?: productRebateListType[]
}
function AgentInviteCheckMoreDisplayTable({ setSelectedStatesPush, proxyType, dictionary, hierarchy }) {
  const store = useAgentInviteStore()
  const { scroller, isBottomSub } = useScrollBottom()
  const [detailPopData, setDetailPopData] = useState({
    data: {} as tableCellDataType,
    isShow: false,
  })

  const agentProductCode = dictionary?.agentProductCode || []
  const { apiData, setApiData, refresh, apiStatus, page, currencySymbol } = store.hooks.useAgentInviteTableCheckMoreV2({
    onLoadMore: isBottomSub,
  })

  return (
    <div className={styles.scoped}>
      <div className={classNames('table-wrapper')}>
        <table className="table-box">
          <thead>
            <tr className="tab-header table-common">
              {getInviteDetailsTableColumnSchema(
                store,
                setSelectedStatesPush,
                setDetailPopData,
                proxyType,
                hierarchy
              ).map(i => {
                return (
                  <th className="table-header-col" key={i.accessorKey}>
                    {i.header}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {apiData?.map(item => {
              return (
                <tr className="table-cell table-common" key={item.uid}>
                  {getInviteDetailsTableColumnSchema(
                    store,
                    setSelectedStatesPush,
                    setDetailPopData,
                    proxyType,
                    hierarchy
                  ).map((i, index) => {
                    return (
                      <td key={index} className="col-cell">
                        {i.cell && i.cell(item)}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
            {apiStatus === ApiStatusEnum.succeed && !apiData.length ? (
              <div className="no-data-box">
                <NoDataImage className="offset-no-data" footerText={t`components/common-list/list-empty/index-0`} />
              </div>
            ) : null}
            {!page.finished && (
              <div ref={scroller as HTMLDivElement | any} className="loading-wrapper">
                <Loading /> <span>{t`components_table_index_5101623`}</span>
              </div>
            )}

            {apiStatus === ApiStatusEnum.succeed && page.finished && apiData.length ? (
              <div className="load-finished-text">{t`components/common-list/list-footer/index-0`}</div>
            ) : null}
          </tbody>
        </table>
      </div>
      {/* 详情 */}
      {detailPopData.isShow && (
        <Popup
          className={classNames(styles.detail)}
          closeable
          round
          title={t`assets.coin.overview.detail`}
          position="bottom"
          visible={detailPopData.isShow}
          closeIcon={<Icon hasTheme name="close" />}
          onClose={() =>
            setDetailPopData({
              data: {},
              isShow: false,
            })
          }
        >
          <div className="detail-content">
            {getDetailSchema(proxyType).map((i, index) => {
              const detailData = detailPopData?.data
              if (i.key === tableDetailKeyEnum.productRebateList) {
                const productRebateList = detailData?.productRebateList
                /** 返佣列表渲染 */
                return productRebateList?.map(e => {
                  const findItem = agentProductCode?.find(item => item.codeVal === e?.productCd)
                  return (
                    <div key={index} className="detail-cell">
                      <span className="cell-label">
                        {t`features_agent_agent_invite_invite_check_more_v3_display_table_index_wgu8awcvjd`}
                        {findItem?.codeKey || '--'}
                      </span>
                      <span>{e.ratio}%</span>
                    </div>
                  )
                })
              }
              return (
                <div key={index} className="detail-cell">
                  <span className="cell-label">{i.labelRender && i.labelRender(currencySymbol)}</span>
                  <span>{i.render && i.render(detailData, dictionary)}</span>
                </div>
              )
            })}
          </div>
        </Popup>
      )}
    </div>
  )
}

export default AgentInviteCheckMoreDisplayTable
