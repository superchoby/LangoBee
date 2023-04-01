import { ArticleContainer } from './ArticleContainer'

export const JapaneseWritingSystem = (): JSX.Element => {
  return (
        <ArticleContainer
            content={[
              {
                subheader: '',
                content: (
                        <p>Japanese consists of three alphabets.</p>
                )
              },
              {
                subheader: 'Hiragana',
                content: (
                        <p>
                            The most common alphabet system, used for
                            grammar points and traditional Japanese
                            words. This is a phonetic alphabet meaning
                            the characters in themselves don’t have meaning,
                            they just represent a pronunciation.
                        </p>
                )
              },
              {
                subheader: 'Katakana',
                content: (
                        <p>
                            The alphabet system used for words that were
                            taken from foreign languages. E.g The word for
                            “hotel” is ホテル (pronunciation: hoteru).
                            Like Hiragana, this is also a phonetic alphabet.
                        </p>
                )
              },
              {
                subheader: 'Kanji',
                content: (
                        <p>
                            An alphabet system originally based on Chinese
                            characters. Many words consist of a combination
                            of Kanji and Hiragana. Unlike Hiragana and
                            Katakana, Kanji is not a phonetic alphabet.
                            Every character has its own meaning and doesn’t
                            represent a pronunciation and almost always
                            has multiple different ways it can be read
                            depending on the word it is in.
                        </p>
                )
              },
              {
                subheader: '',
                content: (
                        <p>
                            Here at LangoBee we will be starting with
                            getting you familiar with the Hiragana characters,
                            then the Katakana characters, and finally the kanji!
                        </p>
                )
              }
            ]}
        />
  )
}
