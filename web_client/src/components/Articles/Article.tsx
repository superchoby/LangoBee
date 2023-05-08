import { useParams, useNavigate, useMatch } from 'react-router-dom'
import { ArticlesDict } from './ArticlesList'
import { PageContainer } from '../shared/PageContainer'
import { useEffect, useState } from 'react'
import {
  ARTICLE_PATH,
  LESSONS_PATH
} from 'src/paths'
import axios from 'axios'
import { Header } from 'src/components/HeaderAndNavbar/Header'
import { BsCheckLg } from 'react-icons/bs'
import './Article.scss'

interface ArticleSection {
  content: string
  header: string | null
}

interface Article {
  title: string
  sections: ArticleSection[]
}

export const Article = (): JSX.Element => {
  const [cantFindArticle, changeCantFindArticle] = useState(false)
  const [article, changeArticle] = useState<Article>({ title: '', sections: [] })
  const [loadingArticles, changeLoadingArticles] = useState(false)
  const [userHasFinishedThisArticle, changeUserHasFinishedThisArticle] = useState(false)
  const [errorUpdatingArticleAsRead, changeErrorUpdatingArticleAsRead] = useState(false)
  const [currentlyUpdatingArticleAsRead, changeCurrentlyUpdatingArticleAsRead] = useState(false)
  const isLessonArticle = useMatch(ARTICLE_PATH(true)) != null
  const navigate = useNavigate()

  const {
    language,
    slug
  } = useParams()

  useEffect(() => {
    changeLoadingArticles(true)
    axios.get(`languages/article/${language}/${slug}/`)
      .then(res => {
        const {
          article,
          user_has_finished_this_article
        } = res.data
        changeLoadingArticles(false)
        changeCantFindArticle(false)
        changeArticle(article)
        changeUserHasFinishedThisArticle(user_has_finished_this_article)
      })
      .catch(err => {
        changeLoadingArticles(false)
        changeCantFindArticle(true)
        console.error(err)
      })
  }, [language, slug])

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
    if (!userHasFinishedThisArticle) {
      changeCurrentlyUpdatingArticleAsRead(true)
      axios.get(`languages/article/mark_as_read/Japanese/${slug}/`)
        .then(_ => {
          changeCurrentlyUpdatingArticleAsRead(false)
          changeErrorUpdatingArticleAsRead(false)
        })
        .catch(err => {
          changeCurrentlyUpdatingArticleAsRead(false)
          changeErrorUpdatingArticleAsRead(false)
        })
    }

    if (isLessonArticle) {
      navigate(LESSONS_PATH)
    }
  }

  const getButtonText = () => {
    if (isLessonArticle) {
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
      <div className='article-page' data-testid='article-page'>
        <Header />
        <h1>{article.title}</h1>
        {article.sections.map(({ header, content }) => {
          return <div className='article-section' key={header}>
            {header != null && <h2>{header}</h2>}
            <div dangerouslySetInnerHTML={{ __html: parseContent(content.split('<newline />').join('\n')) }} />
          </div>
        })}

        <button
          className={`button-at-bottom-of-article ${(!isLessonArticle && userHasFinishedThisArticle) ? 'article-done-button' : ''}`}
          onClick={handleButtonClick}
        >
          {getButtonText()}
        </button>
      </div>
  )
}
