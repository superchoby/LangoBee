import { 
  CONTACT_US_SUBJECTS, 
  ContactUs, 
  contactUsPromptText,
  THANKS_FOR_CONTACTING_US_MSG
} from './'
import { fireEvent, screen } from '@testing-library/react'
import { renderWithProviders } from 'src/__mocks__/Provider'
import { RouterWithLinks } from 'src/__mocks__/RouterWithLinks'
import { HOME_PATH } from 'src/paths'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'

describe('Authentication Submit Button Component Tests', () => {
  it("Button choices to choose a subject renders and form for user to input their message doesn't appear yet", () => {
    renderWithProviders((
        <RouterWithLinks>
            <ContactUs />
        </RouterWithLinks>
    ))
    for (const { name } of CONTACT_US_SUBJECTS) {
        expect(screen.queryByRole('button', { name })).toBeInTheDocument()
    }
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
  })

  it('Form with proper prompt renders after choosing a subject', () => {
    renderWithProviders((
      <RouterWithLinks>
          <ContactUs />
      </RouterWithLinks>
    ))
    window.HTMLElement.prototype.scrollIntoView = function() {};

    for (const { name } of CONTACT_US_SUBJECTS) {
      fireEvent.click(screen.getByRole('button', { name }))
      expect(screen.queryByRole('heading', {name: `${contactUsPromptText(name)}${name}`})).toBeInTheDocument()
    }
    expect(screen.queryByRole('form', { name: /Contact Us Form/i })).toBeInTheDocument()
  })

  describe('On form submit', () => {
    let textArea: any = null
    beforeEach(() => {
      renderWithProviders((
        <RouterWithLinks>
            <ContactUs />
        </RouterWithLinks>
      ))
      window.HTMLElement.prototype.scrollIntoView = function() {};
  
      const randomSubject = Object.values(CONTACT_US_SUBJECTS)[Math.floor(Math.random()*CONTACT_US_SUBJECTS.length)].name
      fireEvent.click(screen.getByRole('button', { name: randomSubject }))
      textArea = screen.getByLabelText('Contact Us Text Input Area')
    })
    it('shows them a message and a button to go home on successful submit', async () => {
      await act(async () => {
        await userEvent.type(textArea, 'valid message')
      })
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(await screen.findByText(THANKS_FOR_CONTACTING_US_MSG)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', HOME_PATH)
    })

    // eventually handle the error case
  })
})
