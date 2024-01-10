import { Popup } from '@nbit/vant'
import Icon from '@/components/icon'

export function AgentPopup(props) {
  return <Popup round closeIcon={<Icon hasTheme name="close" />} {...props} />
}
