import { useNavigate } from 'react-router-dom'
import { BsFillFastForwardCircleFill } from 'react-icons/bs'
import { TEST_PATH } from 'src/paths'
import './TestToSkipLevelsButton.scss'

interface TestToSkipLevelsButtonProps {
  message: string
  testLink: string
}

export const TestToSkipLevelsButton = ({
  message,
  testLink
}: TestToSkipLevelsButtonProps) => {
  const navigate = useNavigate()

  return (
        <button onClick={() => { navigate(`${TEST_PATH}/${testLink}`) }} className='test-to-skip-levels-button'>
            <div className="test-to-skip-levels-button-message">{message}</div>
            <BsFillFastForwardCircleFill />
        </button>
  )
}
