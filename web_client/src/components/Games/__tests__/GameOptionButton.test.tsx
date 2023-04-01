import { GameOptionButton } from "../GameOptionButton";
import { screen, render, fireEvent } from "@testing-library/react";
import { RouterWithLinks } from "src/__mocks__/RouterWithLinks";

const LESSON_REQUIRED = '3.5'
const UPSELL_TEXT = 'upsell'
const URL = '/url'
const GAME_CONTENT_FILLER = 'Game Filler'

const MockGameOptionButton = ({usersCurrentLesson}: {usersCurrentLesson: string}) => {
    return (
        <RouterWithLinks 
                mainComponent={
                    <GameOptionButton 
                        usersCurrentLesson={usersCurrentLesson} 
                        name='test name'
                        upsell={UPSELL_TEXT}
                        lessonRequired={LESSON_REQUIRED}
                        urlName={URL}
                    />
                }
                otherLinks={[{
                    path: URL,
                    component: <div>{GAME_CONTENT_FILLER}</div>,
                }]}
            />
    )
}

describe("Game Selection Tests", () => {
    it("Game Choice Renders", () => {
        render(<MockGameOptionButton usersCurrentLesson='10' />)

        const gameLink = screen.getByRole('link')
        expect(gameLink).toHaveAttribute("href", URL)
    })

    it("Game Not Accessible when on a lesson that is too low", () => {
        render(<MockGameOptionButton usersCurrentLesson='1' />)

        const lessonRequiredMsg = screen.getByText(`You must be at lesson ${LESSON_REQUIRED}`)
        const gameLink = screen.getByRole('link')
        fireEvent.click(gameLink)
        expect(lessonRequiredMsg).toBeInTheDocument()
    })

    it("Game upsell is shown when at a high enough lesson", () => {
        render(<MockGameOptionButton usersCurrentLesson='10' />)

        const upsellText = screen.getByText(UPSELL_TEXT)
        expect(upsellText).toBeInTheDocument()
        const gameLink = screen.getByRole('link')
        fireEvent.click(gameLink)
        const gameContent = screen.getByText(GAME_CONTENT_FILLER)
        expect(gameContent).toBeInTheDocument()
    })
})