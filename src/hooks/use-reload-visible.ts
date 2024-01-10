import { useSafeState } from 'ahooks'

/**
 * 使用此 hook 来更新 visible 状态以使组件重载，只提供置为 false 的方法，之后会自动重置为 true
 */
export function useReloadVisible(init = true) {
  const [visible, setVisible] = useSafeState(init)

  const close = () => {
    setVisible(false)
    setTimeout(() => {
      setVisible(true)
    }, 100)
  }

  return [visible, close] as const
}
