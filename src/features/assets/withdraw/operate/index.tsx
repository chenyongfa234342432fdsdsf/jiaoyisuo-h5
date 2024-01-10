/**
 * 提币 - 提币操作区域
 */
import { t } from '@lingui/macro'
import { Button, Dialog, Popover, Toast } from '@nbit/vant'
import { CommonDigital } from '@/components/common-digital'
import Icon from '@/components/icon'
import { AssetsWithdrawTypeEnum } from '@/constants/assets'
import { useAssetsStore } from '@/store/assets/spot'
import { decimalUtils } from '@nbit/utils'
import { useUserStore } from '@/store/user'
import { getNickName } from '@/apis/assets/withdraw'
import { formatNumberDecimal } from '@/helper/decimal'
import { calcWithdrawAmount, onVerifyAddress, rateFilter } from '@/helper/assets/spot'
import { useState } from 'react'
import { useUpdateEffect } from 'ahooks'
import { getWithdrawVerify } from '@/apis/assets/common'
import { getKycPageRoutePath } from '@/helper/route'
import { link } from '@/helper/link'
import styles from '../layout/index.module.css'
import { WithdrawConfirm } from '../comfirm'

interface IWithdrawOperateProps {
  verify: boolean
}
function WithdrawOperate(props: IWithdrawOperateProps) {
  const SafeCalcUtil = decimalUtils.SafeCalcUtil
  const { verify } = props || {}
  const { formData, amountInfo, updateWithdrawModule } = useAssetsStore().withdrawModule || {}
  const { uid: userUid } = useUserStore().userInfo || {}
  const [showConfirm, setShowConfirm] = useState(false)
  const [showWithdrawalLimit, setShowWithdrawalLimit] = useState(false)

  /**
   * 收款人 UID 校验
   */
  const onVerifyUid = async () => {
    const res = await getNickName({ uid: formData.uid })
    const { isOk, data } = res || {}

    if (!isOk || !data) return false
    updateWithdrawModule({ nickName: data && data.nickname ? data.nickname : '' })
    return isOk
  }

  const onSubmit = async () => {
    if (
      formData.type === AssetsWithdrawTypeEnum.blockchain &&
      !(await onVerifyAddress(formData.network?.symbol, formData.address))
    )
      return

    const {
      remainingWithdrawalAmount = '0',
      fee = '0',
      feeSymbol = '',
      usrFeeAmount = '',
      maxWithdrawAmount = '',
      availableAmount = '',
      minAmount = '',
    } = amountInfo
    const { type, uid, amount, coin } = formData || {}
    const res = await getWithdrawVerify({})
    const { isOk, data } = res || {}

    if (!isOk || !data || !data?.isSuccess) {
      Toast.info(data?.errMsg || '')
      return
    }

    // 平台内提币需要校验 uid
    if (type === AssetsWithdrawTypeEnum.platform && (uid === userUid || !(await onVerifyUid()))) {
      Toast(t`features_assets_withdraw_withdraw_layout_510170`)
      return
    }

    if (Number(amount) > Number(availableAmount)) {
      Toast(t`features_assets_withdraw_withdraw_form_510110`)
      return
    }

    if (Number(amount) < Number(minAmount)) {
      Toast(t`features_assets_withdraw_withdraw_form_510111`)
      return
    }

    if (Number(amount) > Number(maxWithdrawAmount)) {
      Toast.info(t`features_assets_withdraw_withdraw_layout_5101238`)
      return
    }

    if (
      Number(remainingWithdrawalAmount) > -1 &&
      Number(`${formatNumberDecimal(rateFilter({ symbol: coin?.symbol, amount, showUnit: false, rate: 'usd' }))}`) >
        Number(remainingWithdrawalAmount)
    ) {
      setShowWithdrawalLimit(true)
      return
    }

    /**
     * 区块链提币
     * 提币币种≠手续费币种 && 手续费 > 用户手续费币种可用数量
     */
    if (
      type === AssetsWithdrawTypeEnum.blockchain &&
      formData?.coin.symbol !== feeSymbol &&
      Number(fee) > Number(usrFeeAmount)
    ) {
      Toast(t`features_assets_withdraw_withdraw_layout_510148`)
      return
    }

    setShowConfirm(true)
  }

  /**
   * 计算到账数量
   */
  const onCalculateAmount = () => {
    let newAmount = '0.00'

    if (!formData.amount || Number(formData.amount) <= 0) {
      newAmount = '0.00'
    } else if (amountInfo?.feeSymbol === formData.coin?.symbol) {
      const total = `${SafeCalcUtil.add(formData.amount, amountInfo?.fee)}`

      if (amountInfo?.availableAmount && +total > +amountInfo?.availableAmount) {
        newAmount = `${SafeCalcUtil.sub(amountInfo?.availableAmount, amountInfo?.fee)}`
      } else {
        newAmount = formData.amount || '0.00'
      }
    } else {
      newAmount = formData.amount
    }

    return newAmount
  }

  useUpdateEffect(() => {}, [formData.uid, formData.address])

  return (
    <>
      <div className="operate-wrap">
        <div className="info-wrap">
          {formData.type === AssetsWithdrawTypeEnum.blockchain ? (
            <>
              <div className="info-cell">
                <div className="info-title">{t`features_assets_withdraw_withdraw_form_actions_510287`}</div>
                <CommonDigital
                  content={`${
                    calcWithdrawAmount({
                      amount: formData.amount,
                      symbol: formData.coin.symbol,
                      fee: amountInfo?.fee,
                      feeSymbol: amountInfo?.feeSymbol,
                      availableAmount: amountInfo?.availableAmount,
                    }) || '0.00'
                  } ${formData.coin?.symbol || '--'}`}
                  className="info-value"
                />
              </div>

              <div className="info-cell">
                <Popover
                  placement="top"
                  theme="dark"
                  reference={
                    <div className="info-title">
                      <span>{t`assets.withdraw.confirm.charge`}</span>
                      <Icon name="msg" className="info-hint-icon" hasTheme />
                    </div>
                  }
                  className={styles['withdraw-operate-popover-root']}
                >{t`assets.withdraw.form.tips.charge`}</Popover>
                <CommonDigital
                  content={`${amountInfo?.fee || '0.00'} ${amountInfo?.feeCoinName || '--'}`}
                  className="value"
                />
              </div>
            </>
          ) : (
            <div className="info-cell">
              <div className="info-title">{t`features_assets_withdraw_operate_index_68jaiagty8`}</div>
              <CommonDigital
                content={`${formData.amount || '0.00'} ${formData.coin?.symbol || '--'}`}
                className="info-value"
              />
            </div>
          )}
        </div>

        <Button disabled={!verify} onClick={onSubmit} type="primary" className="withdraw-btn">
          {formData.type === AssetsWithdrawTypeEnum.blockchain
            ? t`assets.withdraw.title`
            : t`features_assets_withdraw_operate_index_mh8cn664o7`}
        </Button>
      </div>

      {showConfirm && <WithdrawConfirm onClose={() => setShowConfirm(false)} visible={showConfirm} />}

      <Dialog
        visible={showWithdrawalLimit}
        showConfirmButton={false}
        className={styles['limit-dialog-wrapper']}
        footer={
          <div className="limit-bottom">
            <Button className="limit-btn mr-4 !bg-bg_sr_color" onClick={() => setShowWithdrawalLimit(false)}>
              {t`assets.financial-record.cancel`}
            </Button>
            <Button type="primary" className="limit-btn" onClick={() => link(getKycPageRoutePath())}>
              {t`features_assets_withdraw_operate_index_qbugklenkj`}
            </Button>
          </div>
        }
      >
        <div
          dangerouslySetInnerHTML={{
            __html: t({
              id: `features_assets_withdraw_operate_index_d46xwlgv_0`,
              values: {
                0: amountInfo.remainingWithdrawalAmount || '--',
              },
            }),
          }}
          className="limit-hint"
        ></div>
      </Dialog>
    </>
  )
}

export { WithdrawOperate }
