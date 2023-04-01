import { useState } from "react"
import './StorySection.scss'

const parseContent = (content: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(`<p>${content}</p>`,"text/xml");
    const speakers = xmlDoc.getElementsByTagName('speaker')
    while (speakers.length > 0) {
      const span = document.createElement('span')
      // span.classList.add('kana-mnemonic-bold-pronunciation')
      span.classList.add('story-speaker-name')
      span.textContent = speakers[0].textContent + ':'
      speakers[0].replaceWith(span)
    }

    return xmlDoc.documentElement.innerHTML
}

export interface StorySectionProps {
    header: string
    text: string
    translation: {
        explanations: {
            explanation: string
            wordsBeingExplained: string
        }[]
        translationText: string
    }
}

export const StorySection = ({
    header,
    text,
    translation: {
        explanations,
        translationText
    }
}: StorySectionProps) => {
    const [showTranslation, changeShowTranslation] = useState(false)
    const [showExplanation, changeShowExplanation] = useState(false)

    const handleTranslationButtonClick = () => {
        if (showTranslation) {
            changeShowTranslation(false)
            changeShowExplanation(false)
        } else {
            changeShowTranslation(true)
        }
    }
    
    return (
        <div className='story-reader-section-container'>
            {/* <div className='story-section-text-and-translation'> */}
                <div className='stories-contents-and-translation-button-container'>
                    <p className='story-reader-stories-contents' dangerouslySetInnerHTML={{__html: parseContent(text)}} />
                    <button 
                        className={`story-section-button story-section-translate-button ${showTranslation ? 'story-section-hide-translation-button' : ''}`} 
                        onClick={handleTranslationButtonClick}
                    >
                        {showTranslation ? 'Hide' : 'Translate'}
                    </button>
                </div>
                <div className='story-section-translation-container' style={{display: showTranslation ? 'flex' : 'none'}}>
                    <span className='story-section-translation'>
                        <span className='story-section-translation-header'>Translation</span>: {translationText}
                    </span>
                    {explanations.length > 0 && (
                        <button 
                            className={`story-section-button story-section-explanation-button ${showExplanation ? 'story-section-hide-explanation-button' : ''}`} 
                            onClick={() => {changeShowExplanation(!showExplanation)}}
                        >
                            {showExplanation ? 'Hide Explanation' : 'Explain'}
                        </button>
                    )}
                    
                </div>
                <ul className='story-section-translation-explanation-container' style={{display: showExplanation ? 'block' : 'none'}}>
                    {explanations.map(({ wordsBeingExplained, explanation}) => (
                        <li><span className='story-section-words-being-explained'>{wordsBeingExplained}</span>: {explanation}</li>
                    ))}
                </ul>
        </div>
    )
}