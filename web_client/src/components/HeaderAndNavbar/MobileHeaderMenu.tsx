import { useEffect, useState } from 'react'
import './MobileHeaderMenu.scss'

interface MobileHeaderMenuProps {
  children: JSX.Element
}

export const MobileHeaderMenu = ({
  children
}: MobileHeaderMenuProps): JSX.Element => {
  const [hasActiveClass, changeHasActiveClass] = useState(false)

  useEffect(() => {
    if (!hasActiveClass) {
      changeHasActiveClass(true)
    }
  }, [hasActiveClass])

  return (
        <ul className={`mobile-header-menu-container ${hasActiveClass ? 'mobile-header-menu-container-active' : ''}`}>
            {children}
        </ul>
  )
}
