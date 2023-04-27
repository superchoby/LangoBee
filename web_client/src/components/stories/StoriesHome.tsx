import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { STORIES_HOME_PATH } from 'src/paths'
import './StoriesHome.scss'

type StoryChoice = {
    recommendedLevel: number
    slug: string
    title: string
}

export const StoriesHome = () => {
    const [storyChoices, changeStoryChoices] = useState<StoryChoice[]>([])

    useEffect(() => {
        axios.get('stories/Japanese')
        .then(res => {
            changeStoryChoices(res.data.map((story: any) => ({
                recommendedLevel: story.recommended_level,
                ...story
            })))
        })
        .catch(err => {
            console.error(err)
        })
    }, [])

    return (
        <div>
            <div className='set-of-story-choices-with-header'>
                <h2>Set 1</h2>
                <div className='story-choices'>
                    {storyChoices.map(({
                        recommendedLevel,
                        slug,
                        title,
                    }) => (
                        <div className='story-choice' key={slug}>
                            <Link to={`${STORIES_HOME_PATH}/Japanese/${slug}`} className='story-choice-link'>
                                {title}
                            </Link>
                            <p className='story-choice-recommended-level'>Recommended Level: {recommendedLevel}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}