import { TlayoutProps } from '@/typings/api/layout'
import {
  YapiGetV1HomeColumnGetListChildColumnsListColumnsDatasData,
  YapiGetV1HomeColumnGetListColumnsDatasData,
} from '@/typings/yapi/HomeColumnGetListV1GetApi'
import { cloneDeep, pick } from 'lodash'

const settings = 'common_settings'

function recursiveFilter(columnsDatas: YapiGetV1HomeColumnGetListColumnsDatasData[], filterFn: any) {
  if (!columnsDatas) return []
  const output: YapiGetV1HomeColumnGetListColumnsDatasData[] = []
  columnsDatas.forEach(col => {
    col.childColumns = recursiveFilter(
      col.childColumns as unknown as YapiGetV1HomeColumnGetListColumnsDatasData[],
      filterFn
    ) as unknown as YapiGetV1HomeColumnGetListChildColumnsListColumnsDatasData[]
    if (filterFn(col)) output.push(col)
  })
  return output
}

function extractFooterData(layoutProps?: TlayoutProps) {
  if (layoutProps) {
    // prevent in-place manipulation
    const footer = cloneDeep(pick(layoutProps, ['groupConfigDatas', 'columnsDatas', 'webCopyright', 'businessName']))

    footer.columnsDatas = footer.columnsDatas
      ? recursiveFilter([...footer.columnsDatas], col => col.isH5 === 1).filter(col => col.homeColumnCd !== settings)
      : []

    return footer
  }
}

function recursiveColumnMap(columnsDatas: YapiGetV1HomeColumnGetListColumnsDatasData[]) {
  let mapped = {}

  function recursiveSearch(columns: YapiGetV1HomeColumnGetListColumnsDatasData[]) {
    if (!columns || columns.length === 0) return
    columns.forEach(col => {
      recursiveSearch(col.childColumns as unknown as YapiGetV1HomeColumnGetListColumnsDatasData[])
      if (col.homeColumnCd) mapped[col.homeColumnCd] = col
    })
  }

  recursiveSearch(columnsDatas)

  return mapped
}

function determineRedirectionUrl(data: YapiGetV1HomeColumnGetListChildColumnsListColumnsDatasData) {
  if (data.isLink === 1) return data.webUrl
  const idList = (data.helpCenterId as unknown as string)?.split?.('-')
  const [id, type] = idList || []
  if (type === '2') {
    return `/support/article/${id || data.helpCenterId}`
  }
  return `/support/navigation?subMenuId=${id || data.helpCenterId}`
}

export { extractFooterData, recursiveColumnMap, determineRedirectionUrl }
