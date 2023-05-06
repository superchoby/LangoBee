import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { keysToCamel } from 'src/components/shared/keysToCamel'
import { Header } from '../HeaderAndNavbar/Header'
import { StorySection, StorySectionProps } from './StorySection'
import { HOME_PATH, STORIES_HOME_PATH } from 'src/paths'
import { Link } from 'react-router-dom'
import './StoryReader.scss'



type Story = {
    audioLink: string,
    recommendedLevel: number
    sections: StorySectionProps[]
    title: string
}

export const StoryReader = () => {
    const [story, changeStory] = useState<Story>({
        audioLink: '',
        recommendedLevel: 1,
        sections: [],
        title: ''
    })

    const {
        language,
        slug
    } = useParams()

    useEffect(() => {
        axios.get(`stories/${language}/${slug}`)
        .then(res => {
            const dataKeysConverted = keysToCamel(res.data) as any
            dataKeysConverted.sections = dataKeysConverted.sections.map((section: any) => ({
                ...section,
                translation: (() => {
                    for (const translation of section.translations) {
                        if (translation.language.name === 'English') {
                            return translation
                        }
                    }
                    return { explanations: [], translationText: '' }
                })()
            }))
            changeStory(dataKeysConverted as Story)
        })
        .catch(err => {
            console.error(err)
        })
    }, [language, slug])

    const {
        sections,
        title
    } = story
    
    return (
        <div className='read-story-container'>
            <Header />
            <h2 className='story-reader-story-title'>{title}</h2>
            {sections.map((props) => (<StorySection key={props.text} {...props} />))}
            <div className='story-quizzes-coming-soon-msg'>
                <h2>Quizzes coming soon!</h2>
                <p>Soon enough you'll be able to test yourself after reading the stories.</p>
            </div>
            
            <div className='story-reader-leave-page-links-container'>
                <Link 
                    to={HOME_PATH} 
                    className='story-reader-leave-page-links story-reader-leave-page-links-home'
                >
                    Home
                </Link>
                <Link 
                    to={STORIES_HOME_PATH} 
                    className='story-reader-leave-page-links story-reader-leave-page-links-stories'
                >
                    Stories
                </Link>
            </div>
        </div>
    )
}
