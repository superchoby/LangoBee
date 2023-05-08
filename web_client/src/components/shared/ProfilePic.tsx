import { useAppSelector } from '../../app/hooks'
import { IoPersonOutline } from 'react-icons/io5'
import ProgressBar from '@ramonak/react-progress-bar'
import './ProfilePic.scss'

interface ProfilePicProps {
  // imageDimensions: number
  // fontSize: number
  containerClassName: string
}

export const ProfilePic = ({
  // imageDimensions,
  // fontSize,
  containerClassName
}: ProfilePicProps): JSX.Element => {
  const {
    profilePicture,
    username
  } = useAppSelector(state => state.user)




  return (
        <div className='profile-pic-container'>
            <div className={`pfp-container ${containerClassName}`} >
              work 0no pfp
            </div>

            {/* <div className='profile-pic-username-and-level-container'>
              <span>{username}</span>
              <span>Level 3</span> */}
              {/* <ProgressBar
                  bgColor="#64B5F6"
                  barContainerClassName="level-exp-bar-container"
                  completedClassName="exp-gained-portion-of-bar"
                  completed={`40%`}

                  isLabelVisible={false}
                  className='level-exp-bar'
              /> */}
            {/* </div> */}

        </div>
  )
}
