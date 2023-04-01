import React from 'react'

export const IntroductionFive = (): JSX.Element => {
  return (
        <>
            <p>
                2 rows of Hiragana cleared in one lesson? You’re amazing!
            </p>

            <p>
                We are now nearing the end of Hiragana and soon enough we
                will be able to move on to expanding your vocabulary
                and learning some grammar! The next Hiragana we will
                learn is the “Ra Gyou” and it is infamous for being tough
                for Japanese beginners to pronounce. Of course as always,
                I will be trying my best to provide the best tips possible
                for how to pronounce it but since it is tough, I highly recommend
                you watch this video beforehand. Keep in mind the tips
                in this video as you go and learn “Ra Gyou”.
            </p>

            <iframe
                // width="300"
                // height="315"
                src="https://www.youtube.com/embed/V2wzUuGm7yw"
                title="YouTube video player"
                frameBorder="0"
                className='intro-to-japanese-iframe'
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />

            <p>
                We are now nearing the end of Hiragana so let’s go and push forward!
            </p>
        </>
  )
}
