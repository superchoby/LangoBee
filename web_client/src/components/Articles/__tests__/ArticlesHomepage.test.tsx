import { render, screen } from '@testing-library/react'
import { ROOT_PATH, ARTICLE_PATH } from 'src/paths';
import { ArticlesHomepage } from '../ArticlesHomepage';
import { RouterWithLinks } from 'src/__mocks__/RouterWithLinks';

const MockArticlesHomepage = ({
    userIsAuthenticated
}: {
    userIsAuthenticated: boolean
}) => {
    return (
        <RouterWithLinks context={{userIsAuthenticated}}>
            <ArticlesHomepage />
        </RouterWithLinks>
    )
}

describe('ArticleHomepage', () => {
    it('Back button to articles renders on logged out', async () => {
        render(<MockArticlesHomepage userIsAuthenticated={false} />);
        expect(await screen.findByText('More articles to come out in the future!')).toBeInTheDocument()
        const buttonBackToArticles = screen.getByRole('link', { name: 'Home' })
        expect(buttonBackToArticles).toHaveAttribute('href', ROOT_PATH)
        });

    it("Articles render with links to it's page", async () => {
        render(<MockArticlesHomepage userIsAuthenticated={true} />)
        const articleLink = await screen.findByRole('link', { name: 'test title' })
        expect(articleLink).toBeInTheDocument()
        expect(articleLink).toHaveAttribute('href', ARTICLE_PATH(false, 'Japanese', 'test-slug'))
    })
});
