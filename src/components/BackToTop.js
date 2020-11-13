import React, { useState, useEffect } from 'react'
import throttle from 'lodash/throttle'
import classNames from 'classnames'
import Button from 'components/Button'

/**
 * Render back to top button
 */
function BackToTop() {
  const visible = useBackToTop()

  return (
    <Button
      titleOnly="Back to top"
      icon="fas fa-arrow-up"
      onClick={windowScrollToTop}
      className={classNames('BackToTop', { visible })}
      medium
    />
  )
}

function windowScrollToTop() {
  window.scrollTo(0, 0)
}

function useBackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const listener = throttle(() => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop

      setVisible(scrollTop > 200)
    }, 200)

    window.addEventListener('scroll', listener)

    return () => {
      window.removeEventListener('scroll', listener)
    }
  }, [])

  return visible
}

export default BackToTop
