import { useAppSelector } from '../../app/hooks'
import { IS_IN_DEV_MODE } from './values'
import { CLOUDFRONT_BASE_URL } from './values'
import DefaultUserIcon from '../../images/DefaultUserIcon.png'
import './ProfilePic.scss'

interface ProfilePicProps {
  // imageDimensions: number
  // fontSize: number
  customImage?: string | null,
  imageClassName?: string
}

export const ProfilePic = ({
  // imageDimensions,
  // fontSize,
  customImage,
  imageClassName
}: ProfilePicProps): JSX.Element => {
  const {
    profilePicture,
  } = useAppSelector(state => state.user)
  const imgSrc = customImage != null ? (
    customImage
  ) : (
    profilePicture != null ? (
      `${CLOUDFRONT_BASE_URL}profile_pics/${IS_IN_DEV_MODE ? 'dev' : 'prod'}/${profilePicture}`
    ) : (
      DefaultUserIcon
    )  
  )

  return (
        <div className='profile-pic-container'>
          <img src={imgSrc} alt='your pfp' className={`profile-pic ${imageClassName != null ? imageClassName : ''}`} />
        </div>
  )
}
