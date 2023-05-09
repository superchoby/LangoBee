import { ArticlesDict } from './ArticlesList'
import { Link } from 'react-router-dom'
import { PageContainer } from '../shared/PageContainer'
import { useEffect, useState } from 'react'
import { useFetchStatus } from '../shared/useFetchStatus'
import { ARTICLE_PATH } from 'src/paths'
import { WaitingForDataToProcess } from '../shared/WaitingForDataToProcess'
import './ArticlesHomepage.scss'
import axios from 'axios'

interface ArticlesWithinThisCategoryType {
  title: string
  url: string
}

type ArticlesByCategoryDict = Record<string, ArticlesWithinThisCategoryType[]>
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
      <p>{removeXMLTags(sections[0].content).slice(0, 90)}...</p>
    </li>
  )
}

export const ArticlesHomepage = (): JSX.Element => {
  const [articles, changeArticles] = useState<ArticlePreviewProps[]>([])
  const { fetchData, error, isFetching, isSuccess, isError, isIdle } = useFetchStatus<ArticlePreviewProps[]>('languages/article', changeArticles);

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
        <PageContainer
            header='Articles'
            className='articles-homepage'
            hasHomeButtonOnBottom={false}
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
                      {articles.map(props => <ArticlePreview {...props} />)}
                    </ul>
                    
                    <p className='more-articles-to-come-out-msg'>More articles to come out in the future!</p>
                  </>
                )
              )}
          </>
        </PageContainer>
  )
}
