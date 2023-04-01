import { HeaderIconWrapper } from '../HeaderIconWrapper'
import { ProfilePic } from '../../../../shared/ProfilePic'
import { ProfileMenu } from './ProfileMenu'
import DefaultUserIcon from '../../../images/DefaultUserIcon.png'

export const ProfileIcon = (): JSX.Element => {
  return (
        <HeaderIconWrapper
            // Icon={<ProfilePic imageDimensions={40} fontSize={30} />}
            Icon={<img src={DefaultUserIcon} alt='profile-icon' height={40}/>}
            TooltipContents={<ProfileMenu />}
            isTheRightMostIcon={true}
        />
  )
}
