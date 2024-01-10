import { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'

/** 重新渲染一个 root 到 body 里，函数式调用 */
export function renderRoot(fn: (destroy: () => void) => ReactNode, { destroyOnRouteChange = true } = {}) {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const root = createRoot(div)
  const unmount = () => {
    root.unmount()
    div.remove()
    window.removeEventListener('popstate', unmount)
  }

  if (destroyOnRouteChange) {
    window.addEventListener('popstate', unmount)
  }

  root.render(fn(unmount))
}
