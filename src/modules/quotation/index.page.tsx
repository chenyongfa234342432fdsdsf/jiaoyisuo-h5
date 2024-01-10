import React, { useEffect, useState } from 'react'
import { Tabs, Button, Skeleton } from '@nbit/vant'
import Link from '@/components/link'
import styles from './index.module.css'

export function Page({ list }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [])

  return (
    <div className={styles.scoped}>
      <Tabs active={0}>
        {list.map(item => (
          <Tabs.TabPane key={item.title} title={item.title}>
            {isLoading ? (
              <Skeleton title rowHeight={20} row={30} style={{ paddingTop: '20px' }} />
            ) : (
              <div>
                {item.data.map(dataItem => (
                  <div key={dataItem.title} className="flex justify-around mt-3 text-text_color_01">
                    <Link href={`/currency/${dataItem.id}`}>
                      <div>{dataItem.title}</div>
                      <div>{dataItem.price}</div>
                      <Button type="primary">{dataItem.gain}</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  )
}
