import { ArticlesDict } from './ArticlesList'
import { Link } from 'react-router-dom'
import { PageContainer } from '../shared/PageContainer'
import { useMemo } from 'react'
import './ArticlesHomepage.scss'

interface ArticlesWithinThisCategoryType {
  title: string
  url: string
}

interface ArticlesByCategoryDict {
  [category: string]: ArticlesWithinThisCategoryType[]
}

export const ArticlesHomepage = (): JSX.Element => {
  const articlesByCategory: ArticlesByCategoryDict = useMemo(() => (
    // Fetches all the articles and adds them to dict based on their "category" value
    Object.values(ArticlesDict).reduce<ArticlesByCategoryDict>(
      (accumulator, { category, title, url }: { category: string, title: string, url: string }) => {
        const accumulatorCopy = { ...accumulator }
        let articlesWithinThisCategory: ArticlesWithinThisCategoryType[] = []
        if (!Object.prototype.hasOwnProperty.call(accumulator, category)) {
          articlesWithinThisCategory = [...accumulatorCopy[category]]
        }
        articlesWithinThisCategory.push({
          title,
          url
        })
        accumulatorCopy[category] = articlesWithinThisCategory
        return accumulatorCopy
      },
      {}
    )
  ), [])

  return (
        <PageContainer
            header='Articles'
            className='lesson-container'
            hasHomeButtonOnBottom={false}
        >
            <div>
                {Object.entries(articlesByCategory).map(([category, articles]) => (
                    <div className='articles-category-section-container' key={category}>
                        <h2>{category}:</h2>
                        <ul>
                            {articles.map(({ url, title }) => (
                                <li key={url}>
                                    <Link to={`${category}/${url}`}>
                                        {title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
                <p className='more-articles-to-come-out-msg'>More articles to come out in the future!</p>
            </div>
        </PageContainer>
  )
}
