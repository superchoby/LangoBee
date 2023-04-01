import { useAppSelector } from '../../../../../app/hooks'
import React from 'react'

export const IntroductionTen = (): JSX.Element => {
  const { username } = useAppSelector(state => state.user)

  return (
        <>
            <p>
                Congratulations on hitting lesson 10 {username}! That is a huuuuuggggggeeeeee
                milestone. Also amazing is that you went through your first grammar lesson.
                That means you can officially form Japanese sentences now with everything
                you learned, cool! In the next lesson we will learn one of the most important
                parts of Japanese, counters! In Japanese there are many units used to count
                various things and we will learn the counters related to time. We
                will also be learning cool grammar that’ll let you point out things and
                places!
            </p>
        </>
  )
}
