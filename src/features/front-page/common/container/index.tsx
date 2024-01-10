import FrontPageContainerHeader from '@/features/front-page/common/container/header'
import { ReactNode } from 'react'

interface FrontPageContainerProps {
  title: string | ReactNode
  subTitle?: string | ReactNode
  children?: ReactNode
  className?: string
}

function FrontPageContainer({ title, subTitle, children, className }: FrontPageContainerProps) {
  return (
    <section className={`home-page-container mb-20 ${className}`}>
      <FrontPageContainerHeader title={title} subtitle={subTitle} />
      {children}
    </section>
  )
}

export default FrontPageContainer
