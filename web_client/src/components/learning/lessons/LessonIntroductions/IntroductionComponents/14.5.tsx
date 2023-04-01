import { useAppSelector } from '../../../../../app/hooks'
import React from 'react'

export const IntroductionFourteenPointFive = (): JSX.Element => {
  const { username } = useAppSelector(state => state.user)

  return (
        <>
            <p>
                Wow {username}, you are so close to getting it
                to the end of Katakana! As for all the new characters,
                you are completely done with that.
            </p>

            <p>
                In the next lesson you will learn some Katakana concepts
                that very rarely exist in Hiragana, small characters!
                Like you&apos;ve learned before, there are Katakana equivalents
                to the small つ, や,ゆ, and よ characters however unlike in
                Hiragana, small ア, イ, ウ, エ, オ are also very prevalent!
            </p>

            <p>
                Let’s go see what these mysterious small characters
                are in the next lesson!
            </p>
        </>
  )
}
