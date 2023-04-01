import { ReviewForecast } from './ReviewForecast'
import { ImmersionLevel } from './ImmersionLevel'
import './index.scss'

interface SideInfoProps {
  allSrsCards: Array<{
    nextReviewDate: string
  }>
}

export const SideInfo = ({
  allSrsCards
}: SideInfoProps): JSX.Element => {
  return (
        <div className='side-info-container'>
            <ReviewForecast allSrsCards={allSrsCards} />
            <ImmersionLevel />
        </div>
  )
}
