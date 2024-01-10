import classNames from 'classnames'
import { FC, useEffect, useState } from 'react'
import styles from './index.module.css'

const TradeListItem: FC<{
  item: any
}> = ({ item }) => {
  const isSell = item.side === 'sell'

  return (
    <div
      className={classNames(styles['trade-list-item-wrapper'], {
        'is-sell': isSell,
      })}
    >
      <div className="price col-1">{item.price}</div>
      <div className="text col-2">{item.count}</div>
      <div className="text col-3">{item.time}</div>
    </div>
  )
}

function mockListItem() {
  return {
    id: Math.random(),
    side: Math.random() > 0.5 ? 'sell' : 'buy',
    price: Math.random().toFixed(5),
    count: Math.random().toFixed(8),
    time: '10:27:03',
  }
}
/** 交易页面实时成交 */
function TradeList() {
  const headers = [
    {
      name: '价格',
      className: 'left col-1',
    },
    {
      name: '数量',
      className: 'right col-2',
    },
    {
      name: '时间',
      className: 'right col-3',
    },
  ]
  const [tradeList, setTradeList] = useState([mockListItem()])
  useEffect(() => {
    const timer = setInterval(() => {
      setTradeList(list => {
        const newList = [...list, mockListItem()]
        if (newList.length > 50) {
          newList.shift()
        }
        return newList
      })
    }, 200)
    return () => {
      clearInterval(timer)
    }
  }, [])
  return (
    <div className={styles['trade-list-wrapper']}>
      <div>
        <div className="list-header">
          {headers.map(item => (
            <div key={item.name} className={classNames('header-item', item.className)}>
              {item.name}
            </div>
          ))}
        </div>
        <div className="list-body">
          {tradeList.map((item, index) => (
            // 这里用索引来复用更好
            <TradeListItem key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TradeList
