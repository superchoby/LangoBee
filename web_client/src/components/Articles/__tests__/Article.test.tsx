import { render, screen } from '@testing-library/react'
import { Article } from '../Article';
import { ARTICLE_HOMEPAGE_PATH } from 'src/paths';
import { RouterWithLinks } from 'src/__mocks__/RouterWithLinks'

const MockArticle = ({
    userIsAuthenticated,
    fetchesValidArticle
}: {
    userIsAuthenticated: boolean
    fetchesValidArticle: boolean
}) => (
    <RouterWithLinks 
        initialEntries={[fetchesValidArticle ? '/articles/Japanese/test-slug' : '/articles/FalseLanguage/false-slug']}
        componentsPath='/articles/:language/:slug'
        context={{userIsAuthenticated}}
    >
        <Article />
    </RouterWithLinks>
)

describe('Article', () => {
    describe('Logged Out Features',  () => {
        it('Back button to articles renders', async () => {
            render(<MockArticle userIsAuthenticated={false} fetchesValidArticle={true} />);
            expect(await screen.findByTestId('article-title')).toBeInTheDocument()
            const buttonBackToArticles = await screen.findByRole('link', { name: 'Articles' })
            expect(buttonBackToArticles).toHaveAttribute('href', ARTICLE_HOMEPAGE_PATH)
          });
    })

    it("Article's content renders", async () => {
        render(<MockArticle userIsAuthenticated={true} fetchesValidArticle={true} />)
        expect(await screen.findByTestId('article-title')).toBeInTheDocument()
        expect(await screen.findByText('Test Title')).toBeInTheDocument()
        expect(await screen.findByText('Test Content')).toBeInTheDocument()
        expect(await screen.findByText('Test Header')).toBeInTheDocument()
    })
    
    it("Show invalid message when rendering invaid article", async () => {
        render(<MockArticle userIsAuthenticated={true} fetchesValidArticle={false} />)
        expect(await screen.findByText('Sorry, this article could not be found')).toBeInTheDocument()
    })
});
