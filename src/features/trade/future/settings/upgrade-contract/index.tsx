import { t } from '@lingui/macro'
import { useState } from 'react'
import { getFutureProQuestions } from '@/helper/trade'
import { setContractVersionChange } from '@/apis/trade'
import { useFutureTradeStore } from '@/store/trade/future'
import { UserContractVersionEnum } from '@/constants/trade'
import { Toast } from '@nbit/vant'
import Icon from '@/components/icon'
import NavBar from '@/components/navbar'
import PassVideo from '@/components/pass-video'
import Questionnaire from '@/components/questionnaire'
import { createPortal } from 'react-dom'
import { fetchAndUpdateUserInfo } from '@/helper/auth'
import styles from './index.module.css'

export default function UpgradeContract({
  setVisible,
  setButton,
}: {
  setVisible: (visible: boolean) => void
  setButton: (button: boolean) => void
}) {
  const [visibleContract, setVisibleContract] = useState<boolean>(true)

  const { setPreference } = useFutureTradeStore()

  const onClose = () => {
    setVisible(false)
    setButton(false)
  }

  const onConfirm = () => {
    setVisibleContract(false)
  }

  const onLeftIcon = () => {
    if (visibleContract) {
      setButton(false)
      setVisible(false)
      return
    }
    setVisibleContract(true)
  }

  const nextStep = async () => {
    const { isOk, data } = await setContractVersionChange({ version: UserContractVersionEnum.professional })
    if (isOk && data) {
      setPreference()
      fetchAndUpdateUserInfo()
      Toast.success({
        message: t`features_trade_future_settings_select_version_geonwtuxrxwkifntk-bmo`,
      })
      history.back()
    }
  }
  return createPortal(
    <div className={styles['upgrade-contract-wrap']}>
      <NavBar
        title={t`features_trade_future_settings_select_version_j9tq_7f3ienjxfvhvykya`}
        onClickLeft={onLeftIcon}
        left={<Icon name="back" hasTheme />}
      />
      {visibleContract && (
        <PassVideo isSpeciality isCountDown visible={visibleContract} onConfirm={onConfirm} onClose={onClose} />
      )}
      {!visibleContract && (
        <div className="bg-bg_sr_color">
          <Questionnaire
            onOk={nextStep}
            questions={getFutureProQuestions()}
            desc=""
            confirmButtonText={t`features_trade_future_settings_upgrade_contract_index_tstcj_zjhu`}
          />
        </div>
      )}
    </div>,
    document.body
  )
}
