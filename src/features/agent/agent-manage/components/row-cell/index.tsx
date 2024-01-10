import classNames from 'classnames'
import { ReactNode } from 'react'
import { JsxElement } from 'typescript'
import Styles from './index.module.css'

interface RowCellPropsType {
  leftSlot: ReactNode
  rightSlot: ReactNode
  IconSlot?: ReactNode
}

export default function RowCell({ leftSlot, rightSlot, IconSlot }: RowCellPropsType) {
  return (
    <div className={classNames(Styles['manage-row'])}>
      <div className="manage-label-text">{leftSlot}</div>
      <div className="manage-content-text">
        <span>{rightSlot}</span>
        {IconSlot && <div className="icon">{IconSlot}</div>}
      </div>
    </div>
  )
}
