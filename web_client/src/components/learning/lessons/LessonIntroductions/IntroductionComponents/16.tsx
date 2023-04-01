import { useAppSelector } from '../../../../../app/hooks'
import { Link } from 'react-router-dom'
import { ArticlesUrls } from 'src/components/Articles/ArticlesList'
import React from 'react'

export const IntroductionSixteen = (): JSX.Element => {
  const { username } = useAppSelector(state => state.user)

  return (
        <>
            <p>
                Let&apos;s go {username}! You are now a Katakana Masteeeeerrrrrr!
            </p>

            <p>
                Learning all of Katakana opens up a whole new set of
                words that you can know read and understand. What&apos;s
                great too about Katakana words is that since they
                often are used for words not native to the Japanese
                language, there is a chance that some of the words from
                the other languages they adopt from, such as English, you
                already know and as such, you can learn them easily! For
                example with ホテル having the meaning “hotel.” From here on
                your ability to acquire vocabulary will greatly improve!
            </p>

            <p>
                In this next lesson, you will utilize your Katakana knowledge
                and learn the names of many countries. We will also be
                learning an important part of grammar, verb conjugations!
                If you aren&apos;t familiar with verbs such as the&nbsp;
                <Link to={ArticlesUrls.verbsDictionaryForm}>dictionary form</Link> or the
                <Link to='/articles/'>ます form</Link>,
                I highly suggest you take a look our articles!
            </p>

            <p>As always, good luck with your next lesson!</p>
        </>
  )
}
