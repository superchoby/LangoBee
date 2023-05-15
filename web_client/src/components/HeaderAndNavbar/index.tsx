import { useAppSelector } from 'src/app/hooks'
import { useEffect, useState } from 'react'
import './index.scss'
import { Navbar } from './Navbar'
import { Header } from './Header'
import { useUserIsAuthenticated } from '../shared/useUserIsAuthenticated'
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
  const { isOnFreeTrial, dateJoined } = useAppSelector(state => state.user)
  const [encourageUserToJoin, changeEncourageUserToJoin] = useState(isOnFreeTrial)
  const { userIsAuthenticated } = useUserIsAuthenticated()

  useEffect(() => {
    let threeHoursAgo = new Date();
    threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);
    changeEncourageUserToJoin(new Date(dateJoined) < threeHoursAgo)
  }, [isOnFreeTrial, dateJoined])

  console.log(encourageUserToJoin)

  return (
        <div className='header-and-navbar-container'>
          {
            userIsAuthenticated ? (
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
