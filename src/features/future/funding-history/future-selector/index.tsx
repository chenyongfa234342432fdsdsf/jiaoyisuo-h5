import Icon from '@/components/icon'
import { FundingHistoryTabIdEnum, getFundingHistoryTabIdEnumName } from '@/constants/future/funding-history'
import { IFuture } from '@/typings/api/future/common'
import { t } from '@lingui/macro'
import { useDebounce } from 'ahooks'
import classNames from 'classnames'
import { FC, useEffect, useState } from 'react'
import { Empty, Popup } from '@nbit/vant'
import { useApiAllMarketFuturesTradePair } from '@/hooks/features/market/common/use-api-all-coin-symbol-info'
import Search from '@/components/search'
import CommonListEmpty from '@/components/common-list/list-empty'
import styles from './index.module.css'

type IFutureListProps = {
  title: string
  onChange: (future: any) => void
  selectedFutureId: any
  futureList: IFuture[]
  setShowList: (show: boolean) => void
}

function FutureList({ onChange, setShowList, futureList, title, selectedFutureId }: IFutureListProps) {
  const [searchKey, setSearchKey] = useState('')
  const debouncedSearchKey = useDebounce(searchKey, {
    wait: 200,
  })
  const displayList = futureList.filter(item => {
    if (!debouncedSearchKey) {
      return true
    }
    const ignoreCaseKey = debouncedSearchKey.toUpperCase()
    return item.symbolName.toUpperCase().includes(ignoreCaseKey)
  })
  return (
    <div className={styles['popup-future-list-wrapper']}>
      <div className="title">{title}</div>
      <div className="mb-6 px-6">
        <Search placeholder={t`future.funding-history.search-future`} value={searchKey} onChange={setSearchKey} />
      </div>
      <div>
        {displayList.map(future => {
          const isSelected = selectedFutureId === future.id
          const futureName = future.symbolName.toUpperCase()

          return (
            <div
              onClick={() => {
                if (isSelected) {
                  setShowList(false)
                  return
                }
                onChange(future)
              }}
              className={classNames('future-item', {
                'is-selected': isSelected,
              })}
              key={future.id}
            >
              {futureName}
              {future.typeInd === 'perpetual' && <span className="ml-1">{t`assets.enum.tradeCoinType.perpetual`}</span>}
            </div>
          )
        })}
        <CommonListEmpty hidden={displayList.length > 0} />
      </div>
    </div>
  )
}

type IFutureSelectorProps = {
  type: FundingHistoryTabIdEnum
  value?: IFuture
  onChange: (future: IFuture) => void
  defaultId: string
}

function FutureSelector({ onChange, value, defaultId, type }: IFutureSelectorProps) {
  const futureName = value?.symbolName
  const { data } = useApiAllMarketFuturesTradePair()
  const futureList: IFuture[] = data as any[]

  const [showList, setShowList] = useState(false)
  const onChangeFuture = (future: any) => {
    onChange?.(future)
    setShowList(false)
  }
  useEffect(() => {
    if (futureList.length > 0 && !value) {
      onChange(futureList.find(future => future.id.toString() === defaultId) || futureList[0])
    }
  }, [futureList])
  return (
    <div>
      <div className={styles['future-selector-wrapper']} onClick={() => setShowList(true)}>
        <div className="flex items-center">
          <Icon name="contract_switch" hasTheme />
          <div className="mx-2 text-center font-semibold text-sm">
            {futureName}
            {value?.typeInd === 'perpetual' && <span className="ml-1">{t`assets.enum.tradeCoinType.perpetual`}</span>}
          </div>
        </div>
        <Icon name="next_arrow" hasTheme />
      </div>
      <Popup
        className={styles['position-content-wrapper']}
        visible={showList}
        position="right"
        onClose={() => {
          setShowList(false)
        }}
        destroyOnClose
      >
        <FutureList
          selectedFutureId={value?.id as any}
          title={getFundingHistoryTabIdEnumName(type)}
          futureList={futureList}
          setShowList={setShowList}
          onChange={onChangeFuture}
        />
      </Popup>
    </div>
  )
}

export default FutureSelector
