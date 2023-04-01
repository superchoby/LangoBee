import { useAppSelector } from '../../app/hooks'
import { AdvancedImage } from '@cloudinary/react'
import { Cloudinary } from '@cloudinary/url-gen'
import { thumbnail } from '@cloudinary/url-gen/actions/resize'
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners'
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity'
import { FocusOn } from '@cloudinary/url-gen/qualifiers/focusOn'
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
  // TODO: Mock this class to have the resize functoin not do anyting with its parameters

  const cld = new Cloudinary({
    cloud: {
      cloudName: 'sf32adba'
    }
  })

  // const myImage = cld.image(profilePicture)
  // myImage
  //   .resize(thumbnail().width(imageDimensions).height(imageDimensions).gravity(focusOn(FocusOn.face()))) // Crop the image, focusing on the face.
  //   .roundCorners(byRadius(imageDimensions / 2)).format('png')

  const myImage = cld.image(profilePicture)
  myImage
    .resize(thumbnail().gravity(focusOn(FocusOn.face()))) // Crop the image, focusing on the face.
    .format('png')

  return (
        <div className='profile-pic-container'>
            <div className={`pfp-container ${containerClassName}`} >
              {profilePicture === '' ? <IoPersonOutline color='white' size={30} /> : <AdvancedImage cldImg={myImage} />}
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
