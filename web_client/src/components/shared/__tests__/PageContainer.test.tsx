import { PageContainer } from '../PageContainer'
import { screen, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

const TEST_HEADER = 'test header'
const TEST_CHILDREN_ELEMENT_TEXT = 'test child element text'

const MockPageContainer = ({
    hasHomeButtonOnBottom,
}: {hasHomeButtonOnBottom?: boolean}) => {
    return (
        <BrowserRouter>
            <PageContainer 
                className=''
                header={TEST_HEADER}
                children={<div>{TEST_CHILDREN_ELEMENT_TEXT}</div>}
                hasHomeButtonOnBottom={hasHomeButtonOnBottom ?? false}
            />
        </BrowserRouter>
    )
}

describe("PageContainer", () => {
    it("Properly renders the header, child elemen, and back button", () => {
        render(
            <MockPageContainer />
        )
        
        expect(screen.queryByRole('link')).toBeInTheDocument()
        expect(screen.queryByText(TEST_HEADER)).toBeInTheDocument()
        expect(screen.queryByText(TEST_CHILDREN_ELEMENT_TEXT)).toBeInTheDocument()
    })
    it("Properly renders the home button on the bottom as well when the prop for it is true", () => {
        render(
            <MockPageContainer hasHomeButtonOnBottom={true} />
        )
        
        expect(screen.queryAllByRole('link').length).toBeGreaterThan(1)
    })
})
