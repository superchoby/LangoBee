import { useParams, useNavigate, useMatch } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import {
  ARTICLE_PATH,
  LESSONS_PATH,
  ARTICLE_HOMEPAGE_PATH
} from 'src/paths'
import { useFetchStatus } from '../shared/useFetchStatus'
import { Header } from 'src/components/HeaderAndNavbar/Header'
import { BsCheckLg } from 'react-icons/bs'
import './Article.scss'
import { BackButton } from '../shared/BackButton'
import { LoggedOutHeader } from '../HeaderAndNavbar/Header/LoggedOutHeader'
import { WaitingForDataToProcess } from '../shared/WaitingForDataToProcess'
import { useUserIsAuthenticated } from '../shared/useUserIsAuthenticated'
import ReactMarkdown from 'react-markdown'

interface ArticleStructure {
  title: string
  body: string
  metaDescription: string
}

export const Article = (): JSX.Element => {
  const [article, changeArticle] = useState<ArticleStructure>({ title: '', body: '', metaDescription: ''})
  const [userHasFinishedThisArticle, changeUserHasFinishedThisArticle] = useState(false)
  const { userIsAuthenticated } = useUserIsAuthenticated()
  const isLessonArticle = useMatch(ARTICLE_PATH(true)) != null
  const navigate = useNavigate()

  const {
    language,
    slug
  } = useParams()

  const { 
    fetchData: markUserAsHavingReadArticle
  } = useFetchStatus(`languages/article/mark_as_read/Japanese/${slug}/`, 'get')

  const onFetchArticles = useCallback((data: {article: ArticleStructure, userHasFinishedThisArticle: boolean}) => {
    const {
      article,
      userHasFinishedThisArticle
    } = data
    changeArticle(article)
    changeUserHasFinishedThisArticle(userHasFinishedThisArticle)
  }, [])

  const { 
    fetchData: fetchArticlesData, 
    isFetching: isFetchingArticles, 
    isError: errorWithArticlesFetch,
  } = useFetchStatus<{article: ArticleStructure, userHasFinishedThisArticle: boolean}>(`languages/article/${language}/${slug}/`, 'get', onFetchArticles)

  useEffect(() => {
    fetchArticlesData()
  }, [fetchArticlesData])

  const handleButtonClick = () => {
    if (isLessonArticle) {
      markUserAsHavingReadArticle()
      navigate(LESSONS_PATH)
    } else {
      if (userIsAuthenticated) {
        markUserAsHavingReadArticle()
      }
      navigate(ARTICLE_HOMEPAGE_PATH)
    }
  }

  const getButtonText = () => {
    if (!userIsAuthenticated) {
      return 'Back to Articles'
    } else if (isLessonArticle) {
      return 'Back to Lesson'
    } else if (userHasFinishedThisArticle) {
      return (
        <>
          <span>Done</span>
          <BsCheckLg className='article-done-button-check-mark' />
        </>
      )
    } else {
      return 'Done'
    }
  }

  return (
      <div className={`article-page ${userIsAuthenticated ? '' : 'article-page-logged-out'}`} data-testid='article-page'>
        {userIsAuthenticated ? <Header /> : (
          <>
            <LoggedOutHeader />
            <BackButton text='Articles' link={ARTICLE_HOMEPAGE_PATH}/>
          </>
        )}

        {isFetchingArticles ? (
          <WaitingForDataToProcess waitMessage='Loading the article'/>
        ) : (
          errorWithArticlesFetch ? (
            <p>Sorry, this article could not be found</p>
          ) : (
            <>
              <h1 data-testid="article-title">{article.title}</h1>
              <ReactMarkdown children={article.body} className='articles-contents'/>

              <button
                className={`button-at-bottom-of-article ${(!isLessonArticle && userHasFinishedThisArticle) ? 'article-done-button' : ''}`}
                onClick={handleButtonClick}
              >
                {getButtonText()}
              </button>
            </>
          )
        )}
      </div>
  )
}
