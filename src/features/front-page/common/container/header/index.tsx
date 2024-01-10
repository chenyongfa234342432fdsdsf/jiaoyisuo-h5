import { ReactNode } from 'react'
import styles from './index.module.css'

interface FrontPageContainerHeaderProps {
  title: string | ReactNode
  subtitle?: string | ReactNode
}

function FrontPageContainerHeader({ title, subtitle }: FrontPageContainerHeaderProps) {
  return (
    <div className={`home-page-container-header ${styles.scoped}`}>
      <div className="title">
        <label>{title}</label>
      </div>
      <div className="subtitle">
        <label>{subtitle}</label>
      </div>
    </div>
  )
}

export default FrontPageContainerHeader
