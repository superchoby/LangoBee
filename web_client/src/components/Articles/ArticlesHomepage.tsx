import { Link } from 'react-router-dom'
import { BackButton } from '../shared/BackButton'
import { useEffect, useState } from 'react'
import { useFetchStatus } from '../shared/useFetchStatus'
import { ARTICLE_PATH, ROOT_PATH } from 'src/paths'
import { WaitingForDataToProcess } from '../shared/WaitingForDataToProcess'
import { useOutletContext } from 'react-router-dom'
import { LoggedOutHeader } from '../HeaderAndNavbar/Header/LoggedOutHeader'
import { PageContainer } from '../shared/PageContainer'
import './ArticlesHomepage.scss'

interface ArticlePreviewProps { 
  category: string
  title: string 
  slug: string
  sections: {
    header: string
    content: string
  }[]
}

function removeXMLTags(input: string): string {
  const regex = /<[^>]*>/g; // Match all XML tags
  const output = input.replace(regex, ''); // Replace XML tags with an empty string
  return output;
}

const ArticlePreview = ({
  category,
  title,
  slug,
  sections
}: ArticlePreviewProps) => {
  return (
    <li className='article-preview'>
      <Link to={ARTICLE_PATH(false, 'Japanese', slug)}>{title}</Link>
      <p>{removeXMLTags(sections[0].content).slice(0, 130)}...</p>
    </li>
  )
}

export const ArticlesHomepage = (): JSX.Element => {
  const [articles, changeArticles] = useState<ArticlePreviewProps[]>([])
  const { fetchData, isFetching, isError } = useFetchStatus<ArticlePreviewProps[]>('languages/article', 'get', changeArticles);
  const { userIsAuthenicated } = useOutletContext<{userIsAuthenicated: boolean}>()

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return userIsAuthenicated ? (
        <PageContainer
            header='Articles'
            className='articles-homepage'
            hasHomeButtonOnBottom={false}
            homeButtonGoesToRoot={!userIsAuthenicated}
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
        {!userIsAuthenicated && (
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
