import { PageContainer } from '../../shared/PageContainer'
import './CompletedFinalLesson.scss'

export const CompletedFinalLesson = (): JSX.Element => {
  return (
        <PageContainer
              hasHomeButtonOnBottom={true}
              header='Reached our Last Lesson'
              homeButtonGoesToRoot={false}
        >
            <>
                <p>
                    Wow, you&apos;ve completed our (current) final lesson!
                    Thank you for sticking with us for so long.
                </p>

                <p>We are doing our best to come out with more lessons as soon as we can 👩‍💻.</p>

                <p>We hope you look forward to it!</p>
            </>
        </PageContainer>
  )
}
