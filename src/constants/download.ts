export const enum downloadAppType {
  ios = 'ios',
  android = 'android',
  h5 = 'h5',
  google = 'google',
  appstore = 'appstore',
  superDownload = 'superdownload',
}

export const enum downloadDesktopType {
  windows = 'windows',
  mac = 'mac',
  linux = 'linux',
}

export const downloadTypeRanking = {
  [downloadAppType.appstore]: 1,
  [downloadAppType.ios]: 2,
  [downloadAppType.android]: 3,
  [downloadAppType.google]: 4,
  [downloadAppType.superDownload]: 5,
  [downloadDesktopType.mac]: 6,
  [downloadDesktopType.windows]: 7,
  [downloadDesktopType.linux]: 8,
}

export const downloadIconsType = {
  [downloadAppType.ios]: 'download_apple',
  [downloadAppType.android]: 'icon_download_apk',
  [downloadAppType.google]: 'download_google',
  [downloadAppType.appstore]: 'download_apple',
  [downloadAppType.superDownload]: 'icon_download_super',

  [downloadDesktopType.windows]: 'download_windows',
  [downloadDesktopType.linux]: 'download_linux',
  [downloadDesktopType.mac]: 'download_apple',
}

export enum downloadAppStatus {
  active = 1,
  inActive = 2,
}
