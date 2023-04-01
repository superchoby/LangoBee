// import { FirstIntroduction } from "./IntroductionComponents/Introduction1";

import { useAppDispatch } from '../../../../app/hooks'
import { setIntroMsgAsRead } from '../../../../app/userSlice'
import {
  FirstIntroduction,
  IntroductionOnePointFive,
  IntroductionTwo,
  IntroductionTwoPointFive,
  IntroductionThree,
  IntroductionThreePointFive,
  IntroductionFour,
  IntroductionFourPointFive,
  IntroductionFive,
  IntroductionFivePointFive,
  IntroductionSix,
  IntroductionSeven,
  IntroductionEight,
  IntroductionNine,
  IntroductionTen,
  IntroductionEleven,
  IntroductionTwelve,
  IntroductionThirteen,
  IntroductionFourteen,
  IntroductionFourteenPointFive,
  IntroductionFifteen,
  IntroductionSixteen,
  IntroductionSeventeen,
  IntroductionEighteen
} from './IntroductionComponents'
import axios from 'axios'
import './index.scss'

interface LessonIntroductionsType {
  [lesson: string]: JSX.Element
}

export const LessonIntroductionsObj: LessonIntroductionsType = {
  1: <FirstIntroduction />,
  1.5: <IntroductionOnePointFive />,
  2: <IntroductionTwo />,
  2.5: <IntroductionTwoPointFive />,
  3: <IntroductionThree />,
  3.5: <IntroductionThreePointFive />,
  4: <IntroductionFour />,
  4.5: <IntroductionFourPointFive />,
  5: <IntroductionFive />,
  5.5: <IntroductionFivePointFive />,
  6: <IntroductionSix />,
  7: <IntroductionSeven />,
  8: <IntroductionEight />,
  9: <IntroductionNine />,
  10: <IntroductionTen />,
  11: <IntroductionEleven />,
  12: <IntroductionTwelve />,
  13: <IntroductionThirteen />,
  14: <IntroductionFourteen />,
  14.5: <IntroductionFourteenPointFive />,
  15: <IntroductionFifteen />,
  16: <IntroductionSixteen />,
  17: <IntroductionSeventeen />,
  18: <IntroductionEighteen />
}

interface LessonIntroductionProps {
  introToUse: keyof typeof LessonIntroductionsObj
}

export const LessonIntroduction = ({
  introToUse
}: LessonIntroductionProps): JSX.Element => {
  const dispatch = useAppDispatch()

  const readyToStartLesson = (): void => {
    axios.get('users/viewed-lesson-intro/')
      .then(_res => dispatch(setIntroMsgAsRead()))
      .catch(_err => {})
  }

  return (
        <div className='lesson-introduction-container'>
            <div className='lesson-introduction-msg-container'>
                {LessonIntroductionsObj[introToUse]}
            </div>
            <div data-testid='asdf' className='start-lesson-button' onClick={readyToStartLesson}>
                Let&apos;s Go!
            </div>
        </div>
  )
}
