import { addAutoAddMarginCoin } from '@/apis/future/margin'
import { queryAllMarginCoins } from '@/apis/trade'
import Icon from '@/components/icon'
import { IMarginCoinItem } from '@/typings/api/trade'
import { t } from '@lingui/macro'
import { useMount, useRequest } from 'ahooks'
import classNames from 'classnames'
import produce from 'immer'
import { ReactNode, useState } from 'react'
import { Button, Popup, Search, Toast } from '@nbit/vant'
import LazyImage from '@/components/lazy-image'
import styles from './index.module.css'

export type ISelectCoinProps = {
  title: ReactNode
  visible?: boolean
  selectedIds: string[]
  onSelectOne?: (id: string) => void
  onVisibleChange?: (v: boolean) => void
}

export function SelectCoin({ onSelectOne, selectedIds, title, visible, onVisibleChange }: ISelectCoinProps) {
  const [coins, setCoins] = useState<IMarginCoinItem[]>([])
  const fetchCoins = async () => {
    // TODO: 添加参数为已添加
    const res = await queryAllMarginCoins({})
    if (!res.isOk || !res.data) {
      return
    }
    setCoins(res.data.flat())
  }
  const [searchKey, setSearchKey] = useState('')
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>([])
  const displayCoins = coins.filter(c => {
    return !selectedIds.includes(c.id) && (searchKey ? c.name.toUpperCase().includes(searchKey.toUpperCase()) : true)
  })
  useMount(fetchCoins)
  const { run: onConfirm, loading } = useRequest(
    async () => {
      if (onSelectOne) {
        onVisibleChange?.(false)
        return
      }
      if (localSelectedIds.length === 0) {
        return
      }
      const res = await addAutoAddMarginCoin({
        ids: localSelectedIds,
      })
      if (res.isOk) {
        Toast(t`features_trade_future_settings_margin_auto_detail_coin_select_662`)
        onVisibleChange?.(false)
      }
    },
    {
      manual: true,
    }
  )

  return (
    <Popup
      className={styles['coin-select-modal-wrapper']}
      onClose={() => onVisibleChange?.(false)}
      visible={visible}
      position="bottom"
    >
      <div className="modal-header">
        <div className="title">{title}</div>
      </div>
      <div>
        <div>
          <Search shape="round" value={searchKey} onChange={setSearchKey} />
        </div>
        <div>
          {displayCoins.map(coin => {
            const selected = localSelectedIds.includes(coin.id)
            const onSelect = () => {
              if (onSelectOne) {
                onSelectOne(coin.id)
                onVisibleChange?.(false)
                return
              }
              setLocalSelectedIds(
                produce(localSelectedIds, draft => {
                  if (selected) {
                    draft.splice(draft.indexOf(coin.id), 1)
                  } else {
                    draft.push(coin.id)
                  }
                })
              )
            }

            return (
              <div
                key={coin.id}
                className={classNames('coin-item', {
                  selected,
                })}
                onClick={onSelect}
              >
                <div className="flex items-center">
                  <LazyImage className="coin-icon" src={coin.appLogo} />
                  <div className="name">{coin.name}</div>
                </div>
                <div className="flex items-center">
                  <span>{coin.balance}</span>
                  <div className="checked-icon">{selected && <Icon name="check" hasTheme />}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="mt-2 h-1 bg-line_color_02"></div>
      <Button
        loading={loading}
        onClick={onConfirm}
        disabled={!onSelectOne && localSelectedIds.length === 0}
        className="text-text_color_03"
        block
        plain
      >
        {onSelectOne ? t`user.field.reuse_09` : t`user.field.reuse_17`}
      </Button>
    </Popup>
  )
}
