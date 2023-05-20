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

  const parseContent = (content: string) => {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(`<p>${content}</p>`, 'text/xml')
    const subheaders = xmlDoc.getElementsByTagName('subheader')
    while (subheaders.length > 0) {
      const span = document.createElement('h3')
      // span.classList.add('kana-mnemonic-bold-pronunciation')
      span.textContent = subheaders[0].textContent
      subheaders[0].replaceWith(span)
    }
    return xmlDoc.documentElement.innerHTML
  }

  const handleButtonClick = () => {
    if (!userIsAuthenticated) {
      navigate(ARTICLE_HOMEPAGE_PATH)
    } else  {
      if (!userHasFinishedThisArticle) {
        markUserAsHavingReadArticle()
      }
      if (isLessonArticle) {
        navigate(LESSONS_PATH)
      }
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
      return 'Mark as Read'
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
              {/* {article.sections.map(({ header, content }) => {
                return <div className='article-section' key={header}>
                  {header != null && <h2>{header}</h2>}
                  <div dangerouslySetInnerHTML={{ __html: parseContent(content.split('<newline />').join('\n')) }} />
                </div>
              })} */}
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
