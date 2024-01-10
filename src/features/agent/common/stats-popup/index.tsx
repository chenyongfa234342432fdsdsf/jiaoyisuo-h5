import { t } from '@lingui/macro'
import { Button, Popup } from '@nbit/vant'
import styles from './index.module.css'

function StatsPopup({ title, content, visible, setVisible }) {
  return (
    <Popup className={styles['stats-popup']} visible={visible} onClose={() => setVisible(false)} destroyOnClose>
      <div className="stats-popup-title">{title}</div>
      <div className="stats-popup-body">{content}</div>
      <Button onClick={() => setVisible(false)} type="primary">
        {t`features_agent_common_stats_popup_index_5101394`}
      </Button>
    </Popup>
  )
}

export default StatsPopup
