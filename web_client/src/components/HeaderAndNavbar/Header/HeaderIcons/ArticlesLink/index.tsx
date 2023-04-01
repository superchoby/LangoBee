import { RiArticleLine } from 'react-icons/ri'
import { HeaderIconWrapper } from '../HeaderIconWrapper'
import { SuggestedArticles } from './SuggestedArticles'
import './index.scss'

export const ArticlesLink = (): JSX.Element => {
  return (
    <HeaderIconWrapper
        Icon={
          <div className='articles-icon-container'>
            <RiArticleLine className='articles-icon'/>
          </div>
        }
        TooltipContents={<SuggestedArticles />}
        isTheRightMostIcon={false}
    />
  )
}
