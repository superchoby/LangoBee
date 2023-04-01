import { useAppSelector } from '../../../../../app/hooks'
import React from 'react'

export const IntroductionThirteen = (): JSX.Element => {
  const { username } = useAppSelector(state => state.user)

  return (
        <>
            <p>
                Congratulations {username} on learning your first set
                of vocabulary words! A big set of them at that.
                You are already making a lot of progress with your
                Katakana knowledge.
            </p>

            <p>
                Next up, you will learn more Katakana words but not just that,
                you will also learn some of your first Katakana vocabulary.
                You may notice that it is often easier to learn some Katakana
                words than it is to learn some Hiragana ones due to their
                similarity with certain words in other languages.
            </p>

            <p>
                This will be an exciting lesson ahead and it&apos;ll be cool to
                finally have you learn your first set of Katakana words!
            </p>
        </>
  )
}
