import './index.scss'
import { Navbar } from './Navbar'
import { Header } from './Header'

interface HeaderAndNavbarProps {
  PageContents: JSX.Element
  hasGapBetweenHeaderAndContents: boolean
}

export const HeaderAndNavbar = ({
  PageContents,
  hasGapBetweenHeaderAndContents
}: HeaderAndNavbarProps): JSX.Element => {
  return (
        <div className='header-and-navbar-container'>
            <Header />
            <div className={`page-contents-and-navbar-container ${hasGapBetweenHeaderAndContents ? 'page-contents-and-header-gap' : ''}`}>
              <Navbar />
              <div className='header-and-navbar-page-contents-container'>
                {PageContents}
              </div>
              <div className='gap-between-page-and-mobile-navbar'/>
            </div>
        </div>
  )
}
