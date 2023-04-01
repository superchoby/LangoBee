export const correctlyAnsweredType = 'correctly answered'
export const incorrectlyAnsweredType = 'incorrectly answered'
export const notYetAnsweredType = 'not yet answered'

type answerStatus = typeof correctlyAnsweredType | typeof incorrectlyAnsweredType | typeof notYetAnsweredType

export type SRSFlashcardsDictType = {
    [card: string]: {
        cardFrontSideStatus: answerStatus
        cardBackSideStatus: answerStatus
        cardIsCorrect: boolean
    }
}
