import { HeaderIconWrapper } from '../HeaderIconWrapper'
import { render, screen, fireEvent } from '@testing-library/react'

const TEST_ICON_MSG = 'test icon'
const TEST_TOOLTIP_MSG = 'test tooltip'

const MockHeaderIconWrapper = () => {
  return (
        <HeaderIconWrapper
            Icon={<div>{TEST_ICON_MSG}</div>}
            TooltipContents={<div>{TEST_TOOLTIP_MSG}</div>}
        />
  )
}

describe('HeaderIconWrapper', () => {
  it('The icon renders', () => {
    render(<MockHeaderIconWrapper />)
    expect(screen.queryByText(TEST_ICON_MSG)).toBeInTheDocument()
  })

  it('The tooltip shows when it should depending on if the user is hovering or not', async () => {
    render(<MockHeaderIconWrapper />)
    expect(screen.queryByText(TEST_TOOLTIP_MSG)).not.toBeInTheDocument()
    fireEvent.mouseOver(screen.getByTestId('header-icon-wrapper'))
    expect(await screen.findByText(TEST_TOOLTIP_MSG)).toBeInTheDocument()
  })
})
