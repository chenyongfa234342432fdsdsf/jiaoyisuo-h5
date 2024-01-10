import { ReactElement } from 'react'

type IProps = {
  isHide?: boolean
  children: JSX.Element
  className?: string
}

function HideContent({ isHide, children, className }: IProps) {
  if (isHide) {
    return <div className={`${className}`}>******</div>
  }

  return <div className={`${className}`}>{children}</div>
}

export default HideContent
