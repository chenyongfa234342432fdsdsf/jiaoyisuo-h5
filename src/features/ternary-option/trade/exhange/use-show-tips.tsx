import { t } from '@lingui/macro'
import { Dialog } from '@nbit/vant'

export function useShowTips() {
  const fn = async () => {
    const tips = [
      {
        title: t`features_ternary_option_option_order_ternary_order_item_index_0zxr95sizg`,
        message: t`features_ternary_option_trade_exhange_order_form_advance_yilqebh9ri`,
      },
      {
        title: t`features_ternary_option_option_order_ternary_order_item_index_xilxi3n1bc`,
        message: t`features_ternary_option_trade_exhange_order_form_advance_xreygvjqdc`,
      },
      {
        title: t`features_ternary_option_option_order_ternary_order_item_index_mc2tmv6njx`,
        message: t`features_ternary_option_trade_exhange_order_form_advance_rbucogg2e8`,
      },
    ]
    for (let i = 0; i < tips.length; i += 1) {
      const tip = tips[i]
      // eslint-disable-next-line no-await-in-loop
      await Dialog.confirm({
        title: tip.title,
        // 一行居中，多行左对齐
        message: (
          <div className="text-center">
            <p
              className="inline-block text-left"
              dangerouslySetInnerHTML={{
                __html: tip.message,
              }}
            ></p>
          </div>
        ),
        className: 'dialog-confirm-wrapper confirm-black',
        confirmButtonText: t`features_trade_common_notification_index_5101066`,
        showCancelButton: false,
      }).catch(() => {})
    }
  }

  return fn
}
