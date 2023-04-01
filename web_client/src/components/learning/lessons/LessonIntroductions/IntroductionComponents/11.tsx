import { useAppSelector } from '../../../../../app/hooks'
import React from 'react'

export const IntroductionEleven = (): JSX.Element => {
  const { username } = useAppSelector(state => state.user)

  return (
        <>
            <p>
                Hey {username}, it&apos;s really cool that you&apos;ve learned your
                first set of counters in Japanese. We will definitely get
                into more counters in future lessons as they are very
                important but you&apos;ve already made a very huge step into them.
            </p>

            <p>
                After the last lesson, there is now a large increase in the
                types of sentences you can now form/comprehend and in the
                next lesson we will add more to your grammar knowledge by
                teaching you how to say things such as “not” in a formal
                and casual way!
            </p>

            <p>
                Good luck with the next lesson and see you in the next one!
            </p>

        </>
  )
}
