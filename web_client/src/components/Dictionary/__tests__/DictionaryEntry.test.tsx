import { 
  AddToReviewButton,
  VocabularyDictionaryEntry,
  KanjiDictionaryEntry,
  ADD_TO_REVIEW_BUTTON_MESSAGES,
  JmdictAndLevels,
  WordTags,
  JLPT_LEVEL,
  LANGOBEE_LEVEL,
  COMMON,
} from '../DictionaryEntry'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { RouterWithLinks } from 'src/__mocks__/RouterWithLinks'
import { toKatakana, toRomaji } from 'wanakana'

const MockDictionaryEntry = ({
  dataToAddToReview={
    subject_type: 'vocabulary', 
    jmdict_id: 1
  },
  loggedOutUser=false
}: {
  dataToAddToReview? : {
    subject_type: 'vocabulary'
    jmdict_id: number
  },
  loggedOutUser?: boolean
}) => (
  <RouterWithLinks context={{userIsAuthenticated: !loggedOutUser}}>
    <AddToReviewButton dataToAddToReview={dataToAddToReview} />
  </RouterWithLinks> 
)

const EXAMPLE_KANJI_WORD = '言葉'
const EXAMPLE_KANA_WORD = 'ことば'

const createMockJmdictEntry = (includeKanjiWord=true, isCommon=true) => {
  return {
    kanjiVocabulary: includeKanjiWord ? [{
      common: isCommon,
      text: EXAMPLE_KANJI_WORD,
      tags: [],
      jmdictEntry: 1
    }] : [],
    kanaVocabulary: [{
      common: isCommon,
      text: EXAMPLE_KANA_WORD,
      tags: [],
      jmdictEntry: 1,
      appliesToKanji: ['*'],
    }],
    jmDictId: 1,
    sense: []
  }
}

const MockVocabularyDictionaryEntry = ({
  jmdict=createMockJmdictEntry(),
  jlptLevel=null,
  courseLevel=null,
}: Partial<JmdictAndLevels>) => {
  return (
    <RouterWithLinks>
      <VocabularyDictionaryEntry 
        jmdict={jmdict} 
        jlptLevel={jlptLevel} 
        courseLevel={courseLevel} 
      />
    </RouterWithLinks>
  )
}

describe('Dictionary Entry', () => {
    describe('Add review button', () => {
      const {
        join,
        add,
        alreadyInReviews,
        finished,
        error,
      } = ADD_TO_REVIEW_BUTTON_MESSAGES
      it('Initially shows the add message', () => {
        render(<MockDictionaryEntry />)
        expect(screen.queryByRole('button', { name: add })).toBeInTheDocument()
      })

      it('Shows join message when logged out user tries to click', () => {
        render(<MockDictionaryEntry loggedOutUser={true} />)
        fireEvent.click(screen.getByRole('button', { name: add }))
        expect(screen.queryByRole('button', { name: join })).toBeInTheDocument()
      })
      
      it('Shows successful added message after clicking a new subject', async () => {
        render(<MockDictionaryEntry />)
        fireEvent.click(screen.getByRole('button', { name: add }))
        expect(await screen.findByRole('button', { name: finished })).toBeInTheDocument()
      })

      it('Shows already in reviews message after clicking on a subject they already know', async () => {
        render(<MockDictionaryEntry 
          dataToAddToReview={{
            subject_type: 'vocabulary',
            jmdict_id: 2
          }}
        />)
        fireEvent.click(screen.getByRole('button', { name: add }))
        expect(await screen.findByRole('button', { name: alreadyInReviews })).toBeInTheDocument()
      })

      it('Shows error message when there is an error in the server', async () => {
        render(<MockDictionaryEntry 
          dataToAddToReview={{
            subject_type: 'vocabulary',
            jmdict_id: 3
          }}
        />)
        fireEvent.click(screen.getByRole('button', { name: add }))
        expect(await screen.findByRole('button', { name: error })).toBeInTheDocument()
      })
    })

    describe('VocabularyDictionaryEntry', () => {
      it('Shows kanji, kana, and romaji for kanji word', () => {
        render(<MockVocabularyDictionaryEntry />)
        expect(screen.queryByText(EXAMPLE_KANJI_WORD)).toBeInTheDocument()
        expect(screen.queryByText(EXAMPLE_KANA_WORD)).toBeInTheDocument()
        expect(screen.queryByText(toRomaji(EXAMPLE_KANA_WORD))).toBeInTheDocument()
      })
    })

    describe('WordTags', () => {
      it('LangoBee Level renders properly', () => {
        render(<WordTags tagType={LANGOBEE_LEVEL} text={1} />)
        expect(screen.queryByText(`${LANGOBEE_LEVEL} 1`)).toBeInTheDocument()
      })

      it('JLPT level renders properly', () => {
        render(<WordTags tagType={JLPT_LEVEL} text={1} />)
        expect(screen.queryByText(`${JLPT_LEVEL} 1`)).toBeInTheDocument()
      })

      it ('Common tag renders properly', () => {
        render(<WordTags tagType={COMMON} text='dafadf' />)
        expect(screen.queryByText(COMMON)).toBeInTheDocument()
      })
    })

    describe('KanjiDictionaryEntry', () => {
      const TEST_CHARACTER = '一'
      const TEST_KUNYOMI = ['いち', 'に', 'さん']
      const TEST_ONYOMI = ['し', 'ご', 'ろく']
      const TEST_MEANINGS = ['1', '2']
      
      render(
        <RouterWithLinks>
          <KanjiDictionaryEntry 
            character={TEST_CHARACTER}
            kunyomi={TEST_KUNYOMI}
            onyomi={TEST_ONYOMI}
            meanings={TEST_MEANINGS}
            strokeCount={1}
            freq={1}
            grade={1}
            readingMnemonic=''
            meaningMnemonic=''
            radicalsUsed={[]}
            kanjiContainedWithinThis={[]}
            vocabularyThatUsesThis={null}
            mainMeaningsToUse={[]}
          />
        </RouterWithLinks>
      )
      
      expect(screen.queryByText(TEST_CHARACTER)).toBeInTheDocument()
      expect(screen.queryByText(TEST_KUNYOMI.join(', '))).toBeInTheDocument()
      expect(screen.queryByText(TEST_ONYOMI.map(reading => toKatakana(reading)).join(', '))).toBeInTheDocument()
      expect(screen.queryByText(TEST_MEANINGS.join(', '))).toBeInTheDocument()
      cleanup()
    })
})
