import { t } from '@lingui/macro'
import { ActionSheet, Input, Toast } from '@nbit/vant'
import Slider from '@/components/slider'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { formatNumberDecimal, removeDecimalZero, formatCurrency } from '@/helper/decimal'
import { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import { getMyAssetsData } from '@/helper/assets/spot'
import { TradeModeEnum } from '@/constants/trade'
import { setFutureGroupCreate } from '@/apis/future/common'
import AccountName from '../account-name'
import { GroupAccountTypeEnum } from '../use-acount-bg-and-color'
import styles from './index.module.css'

function CreateNewAccount(_, ref) {
  const {
    futuresCurrencySettings: { offset = 2 },
    userAssetsFutures,
  } = useAssetsFuturesStore()

  const accountNameRef = useRef<Record<'getAccountSelectName', () => string>>()

  const [visible, setVisible] = useState<boolean>(false)

  const formatCurrencyNumber = item => {
    return formatCurrency(removeDecimalZero(formatNumberDecimal(item, Number(offset))))
  }

  const [accountMargin, setAccountMargin] = useState<string>('')

  const [percentValue, setPercentValue] = useState<number>(0)

  const setpriceOffsetChange = e => {
    return e.split('.')[1] === '' ? e : String(Number(formatNumberDecimal(e, offset)))
  }

  const onExtraMarginPercentChange = e => {
    setPercentValue(e)
    setAccountMargin(formatNumberDecimal((e / 100) * Number(userAssetsFutures?.availableBalanceValue), offset))
  }

  const onNewaccountMargin = e => {
    const triggerInputNum = setpriceOffsetChange(e) || ''

    const availableBalanceValue = userAssetsFutures?.availableBalanceValue
    const percentValueResult = (Number(triggerInputNum) / Number(setpriceOffsetChange(availableBalanceValue))) * 100
    const judgeTriggerNumber = Number(triggerInputNum) > Number(availableBalanceValue)
    setPercentValue(judgeTriggerNumber ? 100 : Number(formatNumberDecimal(percentValueResult, offset)))

    setAccountMargin(
      e ? String(judgeTriggerNumber ? Number(setpriceOffsetChange(availableBalanceValue)) : triggerInputNum || '') : ''
    )
  }

  const setCreateNewAccount = async () => {
    const name = accountNameRef.current?.getAccountSelectName()
    if (!name) {
      Toast.info(t`features_trade_future_create_new_account_index_3rbnuvbihx`)
      return
    }
    const { isOk } = await setFutureGroupCreate({
      name,
      margin: accountMargin,
      accountType: GroupAccountTypeEnum.IMMOBILIZATION,
      isAutoAdd: false,
    })
    if (isOk) {
      Toast.info(t`features_trade_future_create_new_account_index_pmegbfrprf`)
      setVisible(false)
    }
  }

  useImperativeHandle(ref, () => ({
    setOpenAccountActionSheet() {
      return setVisible(true)
    },
    setCloseAccountActionSheet() {
      return setVisible(false)
    },
  }))

  useEffect(() => {
    if (visible) {
      getMyAssetsData({ accountType: TradeModeEnum.futures })
    }
  }, [visible])

  const onActionSheetClosedChange = () => {
    setPercentValue(0)
    setAccountMargin('')
  }

  return (
    <ActionSheet
      className={styles['newaccount-select-modal-wrapper']}
      destroyOnClose
      title={t`features_trade_future_create_new_account_index_trtmqu1jvl`}
      onClose={() => setVisible(false)}
      visible={visible}
      onClosed={onActionSheetClosedChange}
    >
      <div className="create-newaccount-container">
        <AccountName ref={accountNameRef} />
        <div className="flex justify-between">
          <span className="text-text_color_02 text-sm">{t`features_trade_future_create_new_account_index_teuxwh8ktp`}</span>
          <span className="text-text_color_01 text-sm">
            {t`assets.withdraw.form.count.label-2`}
            {formatCurrencyNumber(userAssetsFutures?.availableBalanceValue)} USD
          </span>
        </div>
        <div className="newaccount-margin-input">
          <Input
            className="newaccount-margin"
            value={accountMargin}
            onChange={onNewaccountMargin}
            placeholder={t`features_trade_future_create_new_account_index_grwiaeyj4g`}
          />
          <span className="text-text_color_01 absolute right-4 text-sm top-2 font-medium">USD</span>
        </div>
        <div className="mt-4">
          <Slider
            activeColor={'var(--brand_color)'}
            showTooltip
            className="newaccount-slider"
            points={[0, 25, 50, 75, 100]}
            onChange={onExtraMarginPercentChange}
            value={percentValue}
          />
        </div>
        <div className="flex justify-between newaccount-name-button mt-10">
          <div
            className="bg-bg_sr_color flex justify-center items-center text-sm text-text_color_01"
            onClick={() => setVisible(false)}
          >{t`common.modal.close`}</div>
          <div
            className="bg-brand_color flex justify-center items-center text-sm text-button_text_02"
            onClick={() => setCreateNewAccount()}
          >{t`common.confirm`}</div>
        </div>
      </div>
    </ActionSheet>
  )
}

export default forwardRef(CreateNewAccount)
