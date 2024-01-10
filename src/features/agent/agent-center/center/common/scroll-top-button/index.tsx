/**
 * 代理中心 - 返回顶部按钮
 */
import Icon from '@/components/icon'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import styles from './index.module.css'

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  const handleScroll = () => {
    if (window.scrollY > window.innerHeight) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <Icon
      name="rebate_back_top"
      hasTheme
      className={classNames(styles['slide-top-icon'], {
        '!hidden': !isVisible,
      })}
      onClick={scrollToTop}
    />
  )
}

export { ScrollToTopButton }
