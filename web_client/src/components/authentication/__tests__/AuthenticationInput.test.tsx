import { AuthenticationInput } from '../AuthenticationInput'
import { render, screen, fireEvent } from '@testing-library/react'
import { useState } from 'react'

const MockAuthenticationInput = ({ testPlacholder }: { testPlacholder: string }) => {
  const [value, changeValue] = useState('')
  return (
        <AuthenticationInput
            id='test-input'
            label='test label'
            placeholder={testPlacholder}
            type='text'
            value={value}
            changeValue={changeValue}
        />
  )
}

describe('Authentication Input Tests', () => {
  const testLabel = 'Test Label'
  const testPlacholder = 'test placeholder'
  it('Input renders', () => {
    render(
            <AuthenticationInput
                id='test-input'
                label={testLabel}
                placeholder={testPlacholder}
                type='text'
                value={''}
                changeValue={() => {}}
            />
    )

    const inputEl = screen.getByPlaceholderText(testPlacholder)
    expect(inputEl).toBeInTheDocument()
    expect(inputEl).toHaveAttribute('type', 'text')
  })

  it('Should be able to type in input', () => {
    render(<MockAuthenticationInput testPlacholder={testPlacholder} />)

    const testValue = 'test value'
    const inputEl = screen.getByPlaceholderText(testPlacholder)
    fireEvent.change(inputEl, { target: { value: testValue } })

    expect(inputEl).toHaveValue(testValue)
  })
})
