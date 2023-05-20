import { Link } from 'react-router-dom'
import { BackButton } from '../shared/BackButton'
import { useEffect, useState } from 'react'
import { useFetchStatus } from '../shared/useFetchStatus'
import { ARTICLE_PATH, ROOT_PATH } from 'src/paths'
import { WaitingForDataToProcess } from '../shared/WaitingForDataToProcess'
import { LoggedOutHeader } from '../HeaderAndNavbar/Header/LoggedOutHeader'
import { PageContainer } from '../shared/PageContainer'
import { useUserIsAuthenticated } from '../shared/useUserIsAuthenticated'
import './ArticlesHomepage.scss'

interface ArticlePreviewProps { 
  tags: {name: string}[]
  title: string 
  slug: string
  body: string
}

function removeMarkdown(md: string) {
  // Remove headers marked with #
  let result = md.replace(/(^\s*#+\s*)([^#]+)/gm, '$2');
  
  // Remove bold and italics marked with *, _ or __
  result = result.replace(/(\*\*|__)(.*?)\1/g, '$2');
  result = result.replace(/(\*|_)(.*?)\1/g, '$2');
  
  // Remove inline code blocks
  result = result.replace(/(`)(.*?)\1/g, '$2');

  // Remove strikethrough text
  result = result.replace(/(\~\~)(.*?)\1/g, '$2');
  
  // Remove links and images
  result = result.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '$1');  // images
  result = result.replace(/\[([^\]]*)\]\(([^\)]+)\)/g, '$1');  // hyperlinks
  
  // Remove blockquotes
  result = result.replace(/\n\s*(>)\s*(.+)/g, '\n$2');

  // Remove horizontal rules
  result = result.replace(/(\*\*\*|- - -|___)/g, '');
  
  return result;
}

const ArticlePreview = ({
  title,
  slug,
  body
}: ArticlePreviewProps) => {
  return (
    <li className='article-preview'>
      <Link to={ARTICLE_PATH(false, 'Japanese', slug)}>{title}</Link>
      <p>{removeMarkdown(body).slice(0, 130)}...</p>
    </li>
  )
}

export const ArticlesHomepage = (): JSX.Element => {
  const [articles, changeArticles] = useState<ArticlePreviewProps[]>([])
  const { fetchData, isFetching, isError } = useFetchStatus<ArticlePreviewProps[]>('languages/article', 'get', changeArticles);
  const { userIsAuthenticated } = useUserIsAuthenticated()

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return userIsAuthenticated ? (
        <PageContainer
            header='Articles'
            className='articles-homepage'
            hasHomeButtonOnBottom={false}
            homeButtonGoesToRoot={!userIsAuthenticated}
        >
          <>
            <span>Come here to refresh or learn new, cool things about Japanese</span>
            {isFetching ? (
              <WaitingForDataToProcess />
            ) : (
              isError ? (
                <p>Sorry, there was an issue loading the articles at this moment. Please try again later.</p>
              ) : (
                <>
                  <ul className='articles-homepage-articles-list'>
                    {articles.map(props => <ArticlePreview key={props.title} {...props} />)}
                  </ul>
                  
                  <p className='more-articles-to-come-out-msg'>More articles to come out in the future!</p>
                </>
              )
            )}
          </>
        </PageContainer>
  ) : (
    <div className='articles-homepage'>
        {!userIsAuthenticated && (
          <>
            <LoggedOutHeader />
            <BackButton link={ROOT_PATH} />
            <h1 className='articles-homepage-header'>Articles</h1>
          </>
        )}
        <span>Come here to refresh or learn new, cool things about Japanese</span>
        {isFetching ? (
          <WaitingForDataToProcess />
        ) : (
          isError ? (
            <p>Sorry, there was an issue loading the articles at this moment. Please try again later.</p>
          ) : (
            <>
              <ul className='articles-homepage-articles-list'>
                {articles.map(props => <ArticlePreview key={props.title} {...props} />)}
              </ul>
              
              <p className='more-articles-to-come-out-msg'>More articles to come out in the future!</p>
            </>
          )
        )}
    </div>
  )
}
