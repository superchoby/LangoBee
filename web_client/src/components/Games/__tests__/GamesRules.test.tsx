import { GameRules } from "../GameRules";
import { screen, render, fireEvent } from '@testing-library/react'

describe("Game Rules Component Tests", () => {
    it("Renders Properly", () => {
        render(
            <GameRules 
                objective='Test Objective'
                rules={[
                    'Test rules',
                ]} 
            />
        )

        const rulesDisplayButton = screen.getByText("View Rules")
        expect(rulesDisplayButton).toBeInTheDocument()
    })

    it('Shows Rules When "View Rules" is clicked', () => {
        render(
            <GameRules 
                objective='Test Objective'
                rules={[
                    'Test rules',
                ]} 
            />
        )

        const viewRulesButton = screen.getByText("View Rules")
        fireEvent.click(viewRulesButton)
        const hideRulesButton = screen.getByText("Hide Rules")
        const ObjectiveHeader = screen.getByText("Objective:")
        const rulesHeader = screen.getByText("Rules:")
        const testRule = screen.getByText('Test rules')
        expect(hideRulesButton).toBeVisible()
        expect(ObjectiveHeader).toBeVisible()
        expect(rulesHeader).toBeVisible()
        expect(testRule).toBeVisible()
    })

    it('Hide Rules When "Hide Rules" is clicked', () => {
        render(
            <GameRules 
                objective='Test Objective'
                rules={[
                    'Test rules',
                ]} 
            />
        )

        // Click to show rules then click again to hide
        let viewRulesButton = screen.getByText("View Rules")
        fireEvent.click(viewRulesButton)
        const hideRulesButton = screen.getByText("Hide Rules")
        fireEvent.click(hideRulesButton)
        viewRulesButton = screen.getByText("View Rules")
        const ObjectiveHeader = screen.getByText("Objective:")
        const rulesHeader = screen.getByText("Rules:")
        expect(viewRulesButton).toBeVisible()
        expect(ObjectiveHeader).not.toBeVisible()
        expect(rulesHeader).not.toBeVisible()
    })
})