import { envIsProd } from './env'

/**
 * initialise vConsole on dev env
 * @returns void
 */
export function initVConsoleOnDev() {
  if (envIsProd) return
  import('vconsole').then(res => {
    const VConsole = res.default
    let vconsole = new VConsole()

    // re-initialise on user agent change
    window.addEventListener('resize', () => {
      // destroy existing vconsole
      if (vconsole) vconsole.destroy()
      vconsole = new VConsole()
    })
  })
}
