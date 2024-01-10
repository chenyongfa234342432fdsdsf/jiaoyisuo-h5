import { useEffect, useRef, useState } from 'react'

function checkIsBottom(reference) {
  return Math.floor(reference.getBoundingClientRect().bottom) <= window.screen.availHeight
}

function useScrollBottom() {
  const scroller = useRef<HTMLDivElement>()
  const [reference, setreference] = useState<HTMLDivElement>()
  const [isBottomSub, setisBottomSub] = useState<boolean>()

  useEffect(() => {
    if (scroller && scroller.current) {
      setreference(scroller.current)
    }
  }, [scroller])

  // update position
  useEffect(() => {
    function updateScrollPosition(e) {
      if (reference) {
        setisBottomSub(checkIsBottom(reference))
      }
    }
    if (reference) {
      window.addEventListener('scroll', updateScrollPosition)
    }

    return () => {
      if (reference) window.removeEventListener('scroll', updateScrollPosition)
    }
  }, [reference])

  return { scroller, isBottomSub }
}

export default useScrollBottom
