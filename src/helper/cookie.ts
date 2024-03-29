import Cookies from 'js-cookie'

export const setCookie = (key: string, value: string, expires: number): void => {
  Cookies.set(key, value, { expires })
}

export function setCookieTheme(theme) {
  setCookie('theme', theme, 365)
}
export function setCookieThemeColor(color) {
  setCookie('themeColor', color, 365)
}
export function setCookieLocale(locale) {
  setCookie('locale', locale, 365)
}
export function setCookieToken(token) {
  setCookie('token', token, 365)
}
export function removeCookieToken() {
  setCookie('token', '', 0)
}

export function setCookieIsMerge(isMerge) {
  setCookie('isMerge', isMerge, 365)
}
export function setCookieBid(bid) {
  setCookie('bid', bid, 365)
}
