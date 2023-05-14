import { PageContainer } from 'src/components/shared/PageContainer'
import React from 'react'

export const ImmersionLevelInfo = (): JSX.Element => {
  return (
        <PageContainer
            header='Immersion Level'
            hasHomeButtonOnBottom={true}
            homeButtonGoesToRoot={false}
        >
            <div className='information-about-site-pages-container'>
                <div>
                    As you progress through the site, more and more of the site will
                    begin to transition from English to Japanese. The goal is to
                    provide you with more immersion into the Japanese language which
                    is a language learning strategy in which you surround yourself with
                    as much Japanese as possible. What you&apos;ll find in even the most advanced
                    textbooks is that 90-95% percent of their content is in the language
                    that the reader is expected to know such as English which can often
                    slow down a learner&apos;s progress so we use a unique immersion style to
                    help speed up your Japanese learning journey.
                </div>

                <br />
                <br />

                <div>
                    Your Immersion Level will begin to increase the higher your level gets
                    telling you how much of the site will now be displayed to you
                    in Japanese rather than English. You will notice that the Japanese words and
                    grammar that you have learned will begin to appear more and more instead
                    of English. This allows you to continually reinforce the knowledge you have
                    learned as well as ensure that you improve your understanding of the
                    vocabulary and grammar through constantly seeing it in context.
                </div>
            </div>
        </PageContainer>
  )
}
