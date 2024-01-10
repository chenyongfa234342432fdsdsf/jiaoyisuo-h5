import { install } from 'resize-observer'

export function initObserver() {
  if (!window.ResizeObserver) install()
}
