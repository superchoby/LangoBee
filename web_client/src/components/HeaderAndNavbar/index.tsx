import { useAppSelector } from 'src/app/hooks'
import { useEffect, useState } from 'react'
import './index.scss'
import { Navbar } from './Navbar'
import { Header } from './Header'
import { useOutletContext } from 'react-router-dom'
import { BackButton } from '../shared/BackButton'
import { LoggedOutHeader } from './Header/LoggedOutHeader'
import { ROOT_PATH } from 'src/paths'

interface HeaderAndNavbarProps {
  PageContents: JSX.Element
  hasGapBetweenHeaderAndContents: boolean
}

export const HeaderAndNavbar = ({
  PageContents,
  hasGapBetweenHeaderAndContents
}: HeaderAndNavbarProps): JSX.Element => {
  const { isOnFreeTrial } = useAppSelector(state => state.user)
  const [encourageUserToJoin, changeEncourageUserToJoin] = useState(isOnFreeTrial)
  const { userIsAuthenicated } = useOutletContext<{userIsAuthenicated: boolean}>()

  useEffect(() => {
    changeEncourageUserToJoin(isOnFreeTrial)
  }, [isOnFreeTrial])

  return (
        <div className='header-and-navbar-container'>
          {
            userIsAuthenicated ? (
              <>
                <Header />
                {encourageUserToJoin && (
                  <div className='encourage-user-to-sub-while-on-trial'>
                      <p>Subscribe to maintain your full access after your trial ends!</p> <button onClick={() => changeEncourageUserToJoin(false)}>Hide</button>
                      {/* <AiFillCloseCircle onClick={() => changeEncourageUserToJoin(false)}/> */}
                  </div>
                )}
                
                <div className={`page-contents-and-navbar-container ${hasGapBetweenHeaderAndContents ? 'page-contents-and-header-gap' : ''}`}>
                  <Navbar />
                  <div className='header-and-navbar-page-contents-container'>
                    {PageContents}
                  </div>
                  <div className='gap-between-page-and-mobile-navbar'/>
                </div>
              </>
            ) : (
              <>
                
                <div className='header-and-navbar-page-contents-container' style={{margin: '0 auto'}}>
                  <LoggedOutHeader />
                  <BackButton link={ROOT_PATH}/>
                  {PageContents}
                </div>
              </>
            )
          }
        </div>
  )
}
