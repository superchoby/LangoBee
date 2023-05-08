import { LevelsBreakdownRow } from './LevelsBreakdownRow'
import { PageContainer } from 'src/components/shared/PageContainer'
import React from 'react'
import './index.scss'

/**
 * Static page that teaches users how reviews work
 */
export const InformationOnReviews = (): JSX.Element => {
  return (
        <PageContainer
            hasHomeButtonOnBottom={true}
            header='Space Repitition System'
        >
            <div className='information-about-site-pages-container'>
                <div>
                    <p>
                        Here at LangoBee we use the Space Repitition System (SRS)
                        which is a very effective method for internalizing new concepts
                        in language learning and is very effective for storing concepts
                        in memory in the long term.
                    </p>
                    <p>
                        Essentially, we continue to have you
                        review a concept and the more you get it right, the later we will
                        ask you the question until you do it a certain amount and then you
                        will no longer review it. If you get it wrong, you will still review
                        the concept at a later time but not as late as the scenario in which
                        you got it right. For example, if I am quizzed on the Hiragana あ and I
                        get it right, then I will be asked it again in lets say 8 hours vs 4 hours
                        if I were to get it wrong.
                    </p>
                    <p id='reason-limit-is-set'>
                        Given the nature of this system of reviewing a
                        concept until you master it, we have set a default
                        cap of the amount of lessons you should take in a day
                        as reviews can tend to pile up very easily as we want to
                        have you practice concepts many times over so that you
                        store the concepts into your long term memory. This can be
                        changed anytime though in the settings.
                    </p>
                    <p>
                        Each concept has an SRS level to it which changes
                        as you review them which is broken down below.
                    </p>
                </div>
                <div className='levels-breakdown-container'>
                    <span className='levels-breakdown-header'>Levels Breakdown:</span>
                    <div className='levels-breakdown-name-container'>
                        <div className='levels-color-circle beginner-levels-color-circle' />
                        <span className='levels-breakdown-stage-name'>Beginner:</span>
                    </div>
                    <LevelsBreakdownRow level={1} time='4 hours' />
                    <LevelsBreakdownRow level={2} time='8 hours' />
                    <LevelsBreakdownRow level={3} time='1 day' />
                    <LevelsBreakdownRow level={4} time='2 days' />
                    <div className='levels-breakdown-name-container'>
                        <div className='levels-color-circle novice-levels-color-circle' />
                        <span className='levels-breakdown-stage-name'>Novice:</span>
                    </div>
                    <LevelsBreakdownRow level={5} time='1 week' />
                    <LevelsBreakdownRow level={6} time='2 weeks' />
                    <div className='levels-breakdown-name-container'>
                        <div className='levels-color-circle intermediate-levels-color-circle' />
                        <span className='levels-breakdown-stage-name'>Intermediate:</span>
                    </div>
                    <LevelsBreakdownRow level={7} time='1 month' />
                    <div className='levels-breakdown-name-container'>
                        <div className='levels-color-circle expert-levels-color-circle' />
                        <span className='levels-breakdown-stage-name'>Expert:</span>
                    </div>
                    <LevelsBreakdownRow level={8} time='4 months' />
                    <div className='levels-breakdown-name-container'>
                        <div className='levels-color-circle master-levels-color-circle' />
                        <span className='levels-breakdown-stage-name'>Master:</span>
                    </div>
                    <LevelsBreakdownRow level={9} time='Done!' />
                </div>

                <div className='levels-breakdown-example'>
                    Example: If you are level 3 on a concept and get it correct,
                    you are now level 4 and it will pop up in your reviews again
                    in 2 days
                </div>

                <div className='note-on-shorter-reviews'>
                    Note:
                    Certain concepts such as the basic Japanese characters (Hiragana and Katakana)
                    have shorter review times. They have 4 srs levels and the review times are
                    2 hours, 4 hours, 8 hours, and 24 hours respectively.
                </div>
            </div>
        </PageContainer>
  )
}
