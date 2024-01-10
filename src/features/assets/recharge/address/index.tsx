/**
 * 充值 - 充值地址
 */
import { t } from '@lingui/macro'
import { QRCodeCanvas } from 'qrcode.react'
import Icon from '@/components/icon'
import { MainTypeMemoTypeEnum } from '@/constants/assets'
import { Popover } from '@nbit/vant'
import { copyCoinAddress } from '../helper/common'
import styles from '../layout/index.module.css'

interface IRechargeAddressProps {
  data: any
}

function RechargeAddress(props: IRechargeAddressProps) {
  const { data } = props

  const confirmList = [
    {
      label: t`features_assets_recharge_address_index_ydtwbzrne3`,
      value: `${data?.depositMinLimit} ${data.coin?.symbol}`,
      isHide: !data?.depositMinLimit,
    },
    {
      label: t`features_assets_recharge_address_index_pomwklecgq`,
      value: t({
        id: 'features_assets_recharge_address_index_y767atuprp',
        values: { 0: data?.depositConfirmNum },
      }),
      isHide: !data?.depositConfirmNum,
    },
    {
      label: t`features_assets_recharge_address_index_xdiqrrqn7o`,
      value: t({
        id: 'features_assets_recharge_address_index_y767atuprp',
        values: { 0: data?.withdrawConfirmNum },
      }),
      isHide: !data?.withdrawConfirmNum,
    },
    {
      label: t`future.funding-history.title`,
      value: data?.contractInfo && `****${data?.contractInfo.slice(-5)}`,
      showHint: true,
      isHide: !data?.contractInfo,
    },
  ]
  return (
    <div className="form-cell">
      <div className="qr-code">
        <QRCodeCanvas value={data?.address} width="100%" height="140" />
        <div className="mt-4">
          {t({
            id: 'features_assets_recharge_address_index_abvsdwln4w',
            values: { 0: data.coin?.symbol },
          })}
        </div>
        <div>{t`features_assets_recharge_address_index_b5geg1xhhv`}</div>
      </div>

      <div className="form-cell">
        <div className="form-label">{t`features_assets_recharge_pay_address_index_510098`}</div>
        <div className="recharge-address">
          <div className="address-text">{data?.address}</div>
          <div className="copy-btn" onClick={() => copyCoinAddress(data?.address, t`user.secret_key_01`)}>
            {t`features_assets_recharge_pay_address_index_603`}
          </div>
        </div>
      </div>

      {data.network?.isUseMemo === MainTypeMemoTypeEnum.yes && (
        <div className="form-cell !mb-2.5">
          <div className="form-label">{t`assets.withdraw.confirm.memo`} (Memo)</div>
          <div className="recharge-address">
            <div className="address-text">{data?.memo}</div>
            <div
              className="copy-btn"
              onClick={() => copyCoinAddress(data?.address, t`features_assets_recharge_index_605`)}
            >
              {t`features_assets_recharge_pay_address_index_603`}
            </div>
          </div>
          <div className="address-error">{t`features_assets_recharge_index_606`}</div>
        </div>
      )}

      <div className="form-cell">
        <div className="form-label">{t`features_assets_recharge_index_510100`}</div>
        <div className="recharge-hint">
          <Icon name="msg" className="hint-icon" />
          <div className="hint-text">{data?.hint}</div>
        </div>
      </div>

      <div className="confirm-wrap">
        {confirmList.map((item, i: number) => {
          if (item.isHide) return

          return (
            <div key={i} className="confirm-cell">
              <div className="confirm-label">
                {item.label}
                {item?.showHint && (
                  <Popover
                    placement="top"
                    theme="dark"
                    reference={<Icon name="msg" className="confirm-hint-icon" hasTheme />}
                    className={styles['recharge-address-popover-root']}
                  >{t`features_assets_recharge_address_index_w_j0eafaxp`}</Popover>
                )}
              </div>
              <div className="confirm-value">{item.value}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { RechargeAddress }
