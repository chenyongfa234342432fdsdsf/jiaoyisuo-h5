import classNames from 'classnames'

export function FormBox({ title, children, className = '' }) {
  return (
    <div className={classNames('mb-4 px-4', className)}>
      <div className="text-sm hidden text-text_color_02 mb-1">{title}</div>
      {children}
    </div>
  )
}
