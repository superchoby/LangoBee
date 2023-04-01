import React from 'react'

export const IntroductionFivePointFive = (): JSX.Element => {
  return (
        <>
            <p>
                Congratulations on completing the Hiragana with arguably
                the hardest characters to pronounce! As a reward, you can
                get a huge break on this next lesson.
            </p>

            <p>
                We are going to learn about a special rule for Hiragana
                characters in the next lesson. Do you remember the Hiragana
                characters や, ゆ, よ, and つ that we learned in previous
                lessons? Well it turns out that when these
                characters are written smaller than usual they change the
                pronunciation of the word in a different way. This is how
                they appear when written smaller: ゃ, ゅ, ょ, and っ. We will
                still have the flashcards to teach and review for you but I
                would like to provide a quick explanation here to prevent
                some confusion.
            </p>

            <p>
                Before I explain, let me show you some examples.
                ちゅ -&gt; chu, りょ -&gt; ryo, びゃ - bya
            </p>

            <p>
                What the small や, ゆ, and よ does is it takes a
                Hiragana that ends with an い sound and replaces
                the い sound with the respective character. This
                can be only used for Hiragana ending with an い
                except for い itself and ぢ.
            </p>

            <p>
                Here are some examples now for the small つ
            </p>

            <p>
                かった -&gt; katta, すっぱい -&gt; suppai, けっしょう -&gt; kesshou
            </p>

            <p>
                What the small つ does it emphasises the sound that
                comes right ahead of it. In romaji terms, this
                means that the letter is repeated twice which you
                can see in すっぱい with the “p” for example. As
                the pronunciation is hard to explain in writing,
                I highly suggest watching this video.
            </p>

            <iframe
                // width="300"
                // height="315"
                src="https://www.youtube.com/embed/jVynW7frBig"
                title="YouTube video player"
                frameBorder="0"
                className='intro-to-japanese-iframe'
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />

            <p>
                Phew that was a long explanation. Now let’s get on with the lesson!
            </p>
        </>
  )
}
