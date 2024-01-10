/**
 * 复制按钮
 */
import { t } from '@lingui/macro'
import { useCopyToClipboard } from 'react-use'
import { Toast } from '@nbit/vant'
import Icon from '@/components/icon'
import classNames from 'classnames'

function CopyButton({ text = '', className }: { text: string; className?: string }) {
  const [state, copyToClipboard] = useCopyToClipboard()

  const copyToClipboardFn = (val: string | number) => {
    if (!val) {
      return
    }
    copyToClipboard(`${val}`)
    state.error ? Toast(t`assets.financial-record.copyFailure`) : Toast(t`user.secret_key_01`)
  }

  return (
    <Icon
      name="icon_agent_manage_copy"
      hasTheme
      className={classNames('', className)}
      onClick={() => copyToClipboardFn(text)}
    />
  )
}

export { CopyButton }
