import DownloadHeader from '@/features/download/header'
import useDownloadInfo from '@/hooks/features/download'
import { useLayoutStore } from '@/store/layout'
import DownloadCommunity from './community'
import DownloadButton from './download-button'
import DownloadLayout from './download-layout'
import styles from './index.module.css'

function Download() {
  const { appInfo, desktopInfo } = useDownloadInfo()
  const { appDownloadTitle, appDownloadDescription, pcDownloadTitle, pcDownloadDescription } =
    useLayoutStore().layoutProps || {}
  return (
    <>
      <div className={styles.header}>
        <DownloadHeader />
      </div>
      {appInfo && (
        <DownloadLayout
          title={
            <span className="flex flex-col items-center space-y-5">
              <span className="download-title">{appDownloadTitle}</span>
              <DownloadCommunity />
            </span>
          }
          description={<span className="text-text_color_02">{appDownloadDescription}</span>}
          buttons={<DownloadButton data={appInfo} />}
        />
      )}
      {desktopInfo && (
        <DownloadLayout
          title={<span className="download-title">{pcDownloadTitle}</span>}
          description={<span className="text-text_color_02">{pcDownloadDescription}</span>}
          buttons={<DownloadButton data={desktopInfo} />}
          isDesktop
        />
      )}
    </>
  )
}

export default Download
