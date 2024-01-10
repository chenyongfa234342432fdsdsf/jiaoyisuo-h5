import { getMaintenanceConfigFromS3 } from '@/apis/maintenance'
import LazyImage from '@/components/lazy-image'
import Link from '@/components/link'
import { formatDate } from '@/helper/date'
import { usePageContext } from '@/hooks/use-page-context'
import { useLayoutStore } from '@/store/layout'
import { t } from '@lingui/macro'
import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import { useCommonStore } from '@/store/common'
import styles from './index.module.css'

function Page() {
  const [config, setconfig] = useState<any>()
  const { host } = usePageContext()

  const locale = useCommonStore().locale

  useEffect(() => {
    getMaintenanceConfigFromS3({}).then(res => {
      setconfig(res.data)
    })
  }, [])

  return (
    <div className={styles.scoped}>
      <div className="flex flex-col text-text_color_01 mx-5 w-full">
        <LazyImage className="mx-auto" src={config?.icon || ''} />
        <div className="flex flex-col space-y-4 mt-5">
          <div>
            <div className="text-base font-medium">{t`modules_maintenance_index_page_57qy7tx-vqbq_fnjy9isz`} </div>
            <div>{config?.title}</div>
          </div>
          <div className="text-xs leading-5">
            <div>{t`modules_maintenance_index_page_rrecascl2pervxxq7158n`} </div>
            <div className="text-brand_color" dangerouslySetInnerHTML={{ __html: config?.content }} />
          </div>
          <div className="text-xs leading-5">
            <div>{t`modules_maintenance_index_page_prqgdnpkw7gqj_v6pimsa`}</div>
            {config?.start_time && config?.end_time && (
              <div className="text-brand_color">{`${formatDate(config?.start_time, 'YYYY-MM-DD HH:mm')} - ${formatDate(
                config?.end_time,
                'YYYY-MM-DD HH:mm'
              )}`}</div>
            )}
          </div>
          {!isEmpty(config?.contact_us || []) && (
            <div className="text-xs leading-5">
              <div>{t`modules_maintenance_index_page_cwycjpcndthenvqv_doj7`}</div>
              <div className="social-media-grid">
                {config.contact_us
                  ?.filter(e => e.lanTypeCd === locale)
                  ?.map((configData, index) => (
                    <Link key={index} href={configData.linkUrl} className="w-5 h-5">
                      <LazyImage width={20} height={20} src={configData.imgIcon} />
                    </Link>
                  ))}
              </div>
            </div>
          )}
          {config?.customer_jump_url && (
            <div className="text-xs leading-5">
              <div>
                {t`modules_maintenance_index_page_dxd41hp5ruzh7ehlyuvus`} 24{' '}
                {t`modules_maintenance_index_page_mifautwhnlp2cbeph72qo`}
              </div>
              <Link href={config.customer_jump_url}>
                <span className="text-brand_color">
                  {host}
                  {config.customer_jump_url}
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { Page }
