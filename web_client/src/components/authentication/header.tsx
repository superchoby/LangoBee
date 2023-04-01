import React from 'react'
import './header.scss'

interface HeaderProps {
  /**
     * The page the user is currently viewing
     */
  headerText: string
}

/**
 * Header on the login/signup pages that display which page
 * they are currently viewing
 */
export const Header = ({
  headerText
}: HeaderProps): JSX.Element => {
  return (
        <div className='authorization-page-header-text'>{headerText}</div>
  )
}
