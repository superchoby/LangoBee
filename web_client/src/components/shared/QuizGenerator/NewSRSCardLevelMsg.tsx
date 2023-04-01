import {
  BsFillArrowUpCircleFill,
  BsFillArrowDownCircleFill
} from 'react-icons/bs'

import './NewSRSCardLevelMsg.scss'

interface NewSRSCardLevelMsgProps {
  userGotSubjectCorrect: boolean
  subjectsCurrentLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
}

export const srsCardLevelNames = {
  1: 'Beginner 1',
  2: 'Beginner 2',
  3: 'Beginner 3',
  4: 'Beginner 4',
  5: 'Novice 1',
  6: 'Novice 2',
  7: 'Intermediate',
  8: 'Expert',
  9: 'Master'
}

export const NewSRSCardLevelMsg = ({
  userGotSubjectCorrect,
  subjectsCurrentLevel
}: NewSRSCardLevelMsgProps): JSX.Element => {

  return (
        <div
            className={`completed-both-sides-of-question-indicator ${userGotSubjectCorrect ? 'srs-card-lvl-up-msg' : 'srs-card-lvl-down-msg'}`}
        >
            {userGotSubjectCorrect ? <BsFillArrowUpCircleFill /> : <BsFillArrowDownCircleFill />}
            {srsCardLevelNames[subjectsCurrentLevel]}
        </div>
  )
}
