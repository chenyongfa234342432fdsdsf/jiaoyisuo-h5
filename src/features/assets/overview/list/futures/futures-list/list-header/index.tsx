/**
 * 资产总览 - 合约列表 - 列表头部
 */
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { FuturesAssetsSortEnum, FuturesAssetsTypeEnum, getFuturesAssetsTypeName } from '@/constants/assets/futures'
import { Dropdown } from '@/features/assets/futures/common/dropdown'
import { SearchInput } from '@/features/assets/common/search-input'
import { CommonDigital } from '@/components/common-digital'
import styles from './index.module.css'
import { IFuturesPositionListForm } from '../list-layout'

interface IFuturesListHeaderProps {
  viewVisible: boolean
  formData: IFuturesPositionListForm
  onChange: (e: IFuturesPositionListForm) => void
  onChangeView?: () => void
}

function FuturesListHeader(props: IFuturesListHeaderProps) {
  const { viewVisible, formData, onChange, onChangeView } = props

  /**  合约组类型列表 */
  const FuturesAssetsTypeList = [
    { label: t`constants_market_market_list_market_module_index_5101071`, value: '' },
    { label: t`constants/assets/futures-0`, value: FuturesAssetsTypeEnum.just },
    { label: t`constants/assets/futures-1`, value: FuturesAssetsTypeEnum.negative },
  ]

  const onChangeSort = () => {
    let newSort = ''
    switch (formData.sort) {
      case '':
        newSort = FuturesAssetsSortEnum.down
        break
      case FuturesAssetsSortEnum.down:
        newSort = FuturesAssetsSortEnum.up
        break
      default:
        newSort = ''
        break
    }
    onChange({
      ...formData,
      sort: newSort,
    })
  }

  const onRenderSort = () => {
    return (
      <div className="header-sort" onClick={onChangeSort}>
        <div className="sort-text">{t`features_assets_futures_common_migrate_modal_index_5101344`}</div>

        <div className="header-sort-icons">
          <Icon
            name={formData.sort === FuturesAssetsSortEnum.up ? 'regsiter_icon_away_white_hover' : 'regsiter_icon_away'}
            className="sort-icon"
            hasTheme={formData.sort !== FuturesAssetsSortEnum.up}
          />
          <Icon
            name={
              formData.sort === FuturesAssetsSortEnum.down ? 'regsiter_icon_drop_white_hover' : 'regsiter_icon_drop'
            }
            className="sort-icon"
            hasTheme={formData.sort !== FuturesAssetsSortEnum.down}
          />
        </div>
      </div>
    )
  }

  const onRenderDropdown = () => {
    return (
      <Dropdown
        width={'75px'}
        textSize={'12px'}
        textAlign="left"
        className={`type-select ${viewVisible && 'ml-3'}`}
        label={getFuturesAssetsTypeName(formData.type) || t`constants_market_market_list_market_module_index_5101071`}
        value={formData.type}
        actionList={FuturesAssetsTypeList}
        onCommit={(val: string) =>
          onChange({
            ...formData,
            type: val,
          })
        }
      />
    )
  }

  return (
    <div className={styles['futures-list-header-root']}>
      <div className="flex items-center">
        {onRenderSort()}
        {viewVisible && onRenderDropdown()}
      </div>

      <div className="header-screen">
        {viewVisible ? (
          <Icon name="position_list" hasTheme onClick={onChangeView} />
        ) : (
          <>
            {onRenderDropdown()}
            <SearchInput
              className="name-input"
              // placeholder={t`future.funding-history.search-future`}
              placeholder={t`features_assets_overview_list_futures_futures_list_list_header_index_a_gdikp3iw`}
              value={formData.name || ''}
              onChange={(value: string) => {
                onChange({
                  ...formData,
                  name: value,
                })
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}

export { FuturesListHeader }
