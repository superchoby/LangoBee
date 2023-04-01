import { useAppSelector } from '../../../../../app/hooks'
import React from 'react'

export const FirstIntroduction = (): JSX.Element => {
  const { username } = useAppSelector(state => state.user)

  return (
        <>
            <p>
                Hello {username}!  My name is Tommy and I’m glad to see you have joined us here at Japanese Heroes in
                this fun language learning journey that is Japanese! Whether you are learning Japanese
                because of anime, manga, Japan’s culture, history or for whatever great reason, we are
                happy you are here and hope to make your love for Japanese even bigger! Let’s talk about
                how we plan on helping you achieve your Japanese goals.
            </p>

            <p>
                First off, if you are not familiar with the Japanese writing system, I highly
                suggest you watch this video here first.
            </p>

            <iframe
                src="https://www.youtube.com/embed/r7a8OjvViwE"
                title="YouTube video player"
                frameBorder="0"
                className='intro-to-japanese-iframe'
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />

            <p>
                As you can see, Japanese consists of two simpler alphabets, Hiragana and Katakana,
                and a more advanced one, Kanji. Here we will focus on teaching you the
                simpler alphabets first and once you build a foundation, we will aide
                you in learning Kanji. Every lesson will either teach you new alphabet
                letters or vocabulary words and then teach concepts that build upon
                what you have just learned. For example, we might teach you vocabulary
                that uses the Hiragana you just learned or grammar with sentence examples
                that use the vocabulary you just learned.
            </p>

            <p>
                Throughout every lesson I will
                be meeting with you again and talk about what’s to come and maybe some
                fun facts about Japan! Now what are you waiting for, let’s get started!
            </p>
        </>
  )
}
