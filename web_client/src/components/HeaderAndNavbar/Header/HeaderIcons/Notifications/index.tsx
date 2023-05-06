import { HeaderIconWrapper } from '../HeaderIconWrapper'
import { IoNotifications } from 'react-icons/io5'
import './index.scss'

export const NotificationsIcon = (): JSX.Element => {

  return (
    <HeaderIconWrapper
        Icon={
          <div className='notifications-icon-container'>
            <IoNotifications className='notifications-icon' />
            <div className='new-notifications-dot' />
          </div>        }
        TooltipContents={
            <div className='notifications-container'>
              <h2>No updates for now</h2>
              <p>We'll let you know when important changes come!</p>
            </div>
        }
        isTheRightMostIcon={false}
    />
  )
}
