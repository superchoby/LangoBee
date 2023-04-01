import { Fragment } from 'react'
import './ArticleContainer.scss'

interface ArticleContainerProps {
  content: Array<{
    subheader?: string
    content: JSX.Element
  }>
}

export const ArticleContainer = ({
  content
}: ArticleContainerProps): JSX.Element => {
  return (
        <div className='article-container'>
            {content.map(({ subheader, content }, index) => (
                <Fragment key={index}>
                    {subheader != null && subheader.length > 0 && <h3>{subheader}</h3>}
                    {content}
                </Fragment>
            ))}
        </div>
  )
}
