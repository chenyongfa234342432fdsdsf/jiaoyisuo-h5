import { Popup } from '@nbit/vant'
import React from 'react'
import styles from './index.module.css'

function ProfitPopup({ title, content, visible, setVisible, actions }) {
  return (
    <Popup className={styles['stats-popup']} visible={visible} onClose={() => setVisible(false)} destroyOnClose>
      <div className="stats-popup-title">{title}</div>
      <div className="stats-popup-body">{content}</div>
      <div className="actions">{actions}</div>
    </Popup>
  )
}

export default ProfitPopup
