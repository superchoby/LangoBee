import { InputBar, inputIsInvalid } from '../InputBar'
import { useState } from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

interface MockInputBarProps {
  valueIsInJapanese: boolean
  typingInHiragana: boolean
}

const MockInputBar = ({
  valueIsInJapanese,
  typingInHiragana
}: MockInputBarProps): JSX.Element => {
  const [value, changeValue] = useState('')
  const [hasNewQuestion, changeHasNewQuestion] = useState(true)

  return (
        <InputBar
            className=''
            choiceSubmitted={false}
            currentAnswerStatus='incorrect'
            changeCurrentGuess={changeValue}
            answerIsInJapanese={valueIsInJapanese}
            currentGuess={value}
            changeIsInvalidInput={() => {}}
            hasInvalidInputClass={false}
            hasNewQuestion={hasNewQuestion}
            changeHasNewQuestion={changeHasNewQuestion}
            typingInHiragana={typingInHiragana}
        />
  )
}

test('Input is invalid checker is working for English values', () => {
  expect(inputIsInvalid('sljdflkjds*&*', false)).toEqual(true)
  expect(inputIsInvalid('%asdfadf#', false)).toEqual(true)
  expect(inputIsInvalid('test @', false)).toEqual(true)
  expect(inputIsInvalid('あsteve', false)).toEqual(true)
  expect(inputIsInvalid('test', false)).toEqual(false)
  expect(inputIsInvalid('9:00', false)).toEqual(false)
})

test('Input is invalid checker is working for Japanese values', () => {
  expect(inputIsInvalid('asan', true)).toEqual(true)
  expect(inputIsInvalid('あsteve', true)).toEqual(true)
  expect(inputIsInvalid('asa*&*', true)).toEqual(true)
  // Will eventually user input these
  // expect(inputIsInvalid('TESUTO', true)).toEqual(false);
  // expect(inputIsInvalid('tamesu', true)).toEqual(false);
  expect(inputIsInvalid('シー', true)).toEqual(false)
})

test('Input autofocuses', async () => {
  const testMessage = 'If input autofocuses then typing in the keyboard without clicking the input element would work'
  render(
        <MockInputBar
            valueIsInJapanese={false}
            typingInHiragana={false}
        />
  )

  const user = userEvent.setup()
  const inputElement = screen.getByPlaceholderText('Answer')
  await user.keyboard(testMessage)
  expect(inputElement as HTMLInputElement).toHaveValue(testMessage)
})

test('"n" kana is properly dealt with for Hiragana', async () => {
  render(
        <MockInputBar
            valueIsInJapanese={true}
            typingInHiragana={true}
        />
  )

  const user = userEvent.setup()
  const inputElement = screen.getByPlaceholderText('Answer')
  // fireEvent.change(inputElement, {target: {value: 'hello'}})
  await act(async () => { await user.keyboard('na') })
  expect(inputElement as HTMLInputElement).toHaveValue('な')

  await act(async () => { await user.keyboard('nn') })
  expect(inputElement as HTMLInputElement).toHaveValue('なん')
})

test('"n" kana is properly dealt with for Katakana', async () => {
  render(
        <MockInputBar
            valueIsInJapanese={true}
            typingInHiragana={false}
        />
  )
  const user = userEvent.setup()
  const inputElement = screen.getByPlaceholderText('Answer')
  await act(async () => { await user.keyboard('na') })
  expect(inputElement as HTMLInputElement).toHaveValue('ナ')
  await act(async () => { await user.keyboard('nn') })
  expect(inputElement as HTMLInputElement).toHaveValue('ナン')
})

test('small katakana stay present after letters are inputted ', async () => {
  render(
        <MockInputBar
            valueIsInJapanese={true}
            typingInHiragana={false}
        />
  )
  const user = userEvent.setup()
  const inputElement = screen.getByPlaceholderText('Answer')
  await act(async () => { await user.keyboard('fa') })
  expect(inputElement as HTMLInputElement).toHaveValue('ファ')
  fireEvent.change(inputElement, { target: { value: '' } })
  await act(async () => { await user.keyboard('fai') })
  expect(inputElement as HTMLInputElement).toHaveValue('ファイ')
})
