/**
 * 历史仓位 - 强平详情
 */
import { t } from '@lingui/macro'
import NavBar from '@/components/navbar'
import { LiquidationPositionInfo } from '../position-info'
import { LiquidationPositionDetails } from '../details'
import styles from './index.module.css'

function LiquidationDetailsLayout() {
  return (
    <div className={styles['liquidation-details-root']}>
      <NavBar title={t`constants/assets/common-29`} />

      <LiquidationPositionInfo />
      <LiquidationPositionDetails />
    </div>
  )
}

export { LiquidationDetailsLayout }
