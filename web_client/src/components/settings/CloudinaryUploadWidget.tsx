import { useEffect } from 'react'
import axios from 'axios'
import { useAppDispatch } from '../../app/hooks'
import { updateProfilePic } from '../../app/userSlice'
import './CloudinaryUploadWidget.scss'

const isInDevelopmentEnv = process.env.NODE_ENV == null || process.env.NODE_ENV === 'development'

export const CloudinaryUploadWidget = ({
  className
}: { className: string }): JSX.Element => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // @ts-expect-error
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'sf32adba',
        uploadPreset: 'twsqurbo',
        multiple: false,
        clientAllowedFormats: ['image']
      },
      // @ts-expect-error
      (error, result) => {
        if (error == null && result != null && result.event === 'success') {
          axios.post('users/upload-pfp/', {
            pfpId: result.info.public_id
          })
            .then(() => {
              dispatch(updateProfilePic({
                profilePicture: result.info.public_id
              }))
            })
            .catch(err => { if (isInDevelopmentEnv) console.log(err.response.data) })
        }
      }
    )
    // @ts-expect-error
    document.getElementById('upload_widget').addEventListener(
      'click',
      function () {
        myWidget.open()
      },
      false
    )
  }, [dispatch])

  return (
    <button id="upload_widget" className={className}>
      Change
    </button>
  )
}
