import { render, screen } from '@testing-library/react'
import { ArticleContainer } from '../ArticleContainer'

describe('Article Container', () => {
  it('Renders properly', () => {
    const TEST_HEADER = 'test header'
    const TEST_CONTENT = 'test content'
    render(
            <ArticleContainer
                content={[{
                  subheader: TEST_HEADER,
                  content: <button>{TEST_CONTENT}</button>
                }]}
            />
    )

    expect(screen.queryByRole('heading', { level: 3 })).toHaveTextContent(TEST_HEADER)
    expect(screen.queryByRole('button')).toHaveTextContent(TEST_CONTENT)
  })
})
