import { CSSProperties, ReactNode } from 'react'
import styles from './index.module.css'

type TStatsLayout = {
  reference?: any
  header: ReactNode
  content: ReactNode
  style?: CSSProperties
}

function StatsLayout({ reference, header, content, style }: TStatsLayout) {
  return (
    <div className={styles.scoped} ref={reference} style={style}>
      <div className="text-text_color_02 layout-header">{header}</div>
      {content}
    </div>
  )
}

export default StatsLayout
