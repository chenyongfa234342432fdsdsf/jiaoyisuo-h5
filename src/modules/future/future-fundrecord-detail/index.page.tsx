import NavBar from '@/components/navbar'
import { useRef } from 'react'
import { usePageContext } from '@/hooks/use-page-context'
import ContractFundrecordDetail from '@/features/trade/contract/contract-fundrecord-detail'
import { t } from '@lingui/macro'
import { getKycDefaultSeoMeta } from '@/helper/kyc'
import styles from './index.module.css'

export function Page() {
  const pageContext = usePageContext()

  const { positionId, fundingRateId, createTime, endTime, symbolType, symbol } = pageContext?.urlParsed?.search || {}

  const FundrecordContainer = useRef<HTMLDivElement>(null)

  return (
    <div className={styles.scoped} ref={FundrecordContainer}>
      <NavBar title={t`assets.financial-record.recordDetail`} />
      <ContractFundrecordDetail
        fundingRateId={fundingRateId}
        createTime={createTime}
        endTime={endTime}
        positionId={positionId}
        symbolType={symbolType}
        symbol={symbol}
      />
    </div>
  )
}

export async function onBeforeRender(pageContext) {
  return {
    pageContext: {
      documentProps: await getKycDefaultSeoMeta(t`constants/assets/common-8`),
    },
  }
}
