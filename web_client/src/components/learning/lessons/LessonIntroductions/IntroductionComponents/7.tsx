import { useAppSelector } from '../../../../../app/hooks'
import React from 'react'

export const IntroductionSeven = (): JSX.Element => {
  const { username } = useAppSelector(state => state.user)

  return (
        <>
            <p>
                You did it {username} 🥳 🥳 🥳! I just wanted to say I am so proud of you.
            </p>

            <p>
                One of the most daunting parts of Japanese is the fact
                that it consists of a whole new set of characters completely
                different from English and not so long ago many of these
                letters were indecipherable by you but now you have gone
                through and completed the foundational Japanese letters!
                Once again I just wanted to emphasise how huge of an
                accomplishment and step this is in your Japanese learning
                journey. You have now met the biggest requirement to learn
                most of the vocabulary and grammar that Japanese has to offer!
            </p>

            <p>
                Although it is true that there are a lot of things to do in
                between now and you becoming fluent, knowing Hiragana
                is literally mastering the foundational knowledge needed
                to learn anything else in Japanese. From here on, we will
                be taking a deeper dive into the Japanese language through
                learning some vocabulary and grammar and then soon we will
                take a quick detour to go through some katakana quickly
                and then go back to learning the rest of the vocabulary
                and grammar. Oh! There will also no longer be romaji for the
                rest of these lessons to really help you solidify your hiragana knowledge!
            </p>

            <p>
                I just want to let you know I really am so pumped. Thank you
                so much for trusting me to guide you on your Japanese journey.
            </p>

            <p>
                I hope we can continue to work together as you progress on your journey!
                So now, without further ado, let’s move on! You will be learning
                some of the most fundamental greetings used in everyday
                Japanese conversation.
            </p>
        </>
  )
}
