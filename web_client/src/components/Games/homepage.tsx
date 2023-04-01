import { PageContainer } from '../shared/PageContainer'
import { GameOptionButton } from './GameOptionButton'
import { GamesList } from './GamesList'
import { useAppSelector } from 'src/app/hooks'
import './index.scss'

export const GamesHomepage = (): JSX.Element => {
  const { currentLesson } = useAppSelector(state => state.user.progressOnCourses.Japanese.JLPT)

  return (
        <PageContainer
            header='Games'
            hasHomeButtonOnBottom={false}
        >
            <div className='game-selection-container'>
                {GamesList.map((gameInfo) =>
                    <GameOptionButton key={gameInfo.name} usersCurrentLesson={currentLesson} {...gameInfo} />
                )}

                <div className='more-games-to-come-msg'>
                    You can do some games for some exp. More games to come soon!
                </div>
            </div>
        </PageContainer>
  )
}
