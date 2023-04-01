import { useState } from 'react'
import { Link } from 'react-router-dom'
import './SuggestedArticles.scss'

interface ArticleToReadProps {
  articleName: string
  isLastArticle: boolean
  removeThisArticle: () => void
  removed: boolean
}

const ArticleToRead = ({
  articleName,
  isLastArticle,
  removed,
  removeThisArticle
}: ArticleToReadProps): JSX.Element => {
  const [dismissWasClicked, changeDismissWasClicked] = useState(false)
  const lastArticleClass = !isLastArticle ? 'article-to-read-border-bottom' : ''
  const removeArticleClass = dismissWasClicked ? 'remove-this-suggested-article' : ''

  const onClick = (): void => {
    changeDismissWasClicked(true)
    setTimeout(() => {
      changeDismissWasClicked(false)
      removeThisArticle()
    }, 1000)
  }

  return (
        <li
            className={`article-to-read-li ${lastArticleClass} ${removeArticleClass}`}
            style={{ display: removed ? 'none' : 'flex' }}
        >
            <span>{articleName}</span>
            <button onClick={onClick}>dismiss</button>
        </li>
  )
}

export const SuggestedArticles = (): JSX.Element => {
  const [suggestedArticles, changeSuggestedArticles] = useState([
    {
      articleName: 'test name',
      removed: false
    },
    {
      articleName: 'wowie name',
      removed: false
    }
  ])

  return (
        <div className='suggested-articles-container'>
            <h2>Suggested Articles</h2>
            <Link to='/' >
                View All Articles
            </Link>
            <ul className='suggested-articles-list'>
                {suggestedArticles.map(({ articleName, removed }, i) => (
                    <ArticleToRead
                        key={articleName}
                        articleName={articleName}
                        isLastArticle={i === suggestedArticles.length - 1}
                        removed={removed}
                        removeThisArticle={() => {
                          const suggestedArticlesCopy = [...suggestedArticles]
                          suggestedArticlesCopy[i].removed = true
                          changeSuggestedArticles(suggestedArticlesCopy)
                        }}
                    />
                ))}
                {/* <ArticleToRead articleName='test name' isLastArticle={false} />
                <ArticleToRead articleName='wowie name' isLastArticle={true} /> */}
            </ul>
        </div>
  )
}
