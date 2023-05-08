import { HeaderIconWrapper } from '../HeaderIconWrapper'
import { ProfilePic } from '../../../../shared/ProfilePic'
import { ProfileMenu } from './ProfileMenu'

export const ProfileIcon = (): JSX.Element => {
  return (
        <HeaderIconWrapper
            // Icon={<ProfilePic imageDimensions={40} fontSize={30} />}
            Icon={<ProfilePic />}
            TooltipContents={<ProfileMenu />}
            isTheRightMostIcon={true}
        />
  )
}
