import './DifferenceExplanation.scss'

interface DifferenceExplanationProps {
  mainTextRepresentation: string
  explanation: string
}

export const DifferenceExplanation = ({
  mainTextRepresentation,
  explanation
}: DifferenceExplanationProps) => {
  const vocabImageRegex = /<VocabImage id='(.*?)'>(.*?)<\/VocabImage>/g
  const baseUrl = 'https://langobee.s3.us-west-1.amazonaws.com/vocabulary_images/'

  const splitExplanation = explanation.split(vocabImageRegex)

  const parsedExplanation = splitExplanation.map((part, index) => {
    if (index % 3 === 1) {
      const id = part
      const imageUrl = `${baseUrl}${id}.png`
      return (
          <a key={index} href={imageUrl} target="_blank" rel="noopener noreferrer">
            {splitExplanation[index + 1]}
          </a>
      )
    }
    if (index % 3 === 2) {
      return null
    }
    return part
  })

  return (
        <div className='difference-explanation-container'>
          <div className='difference-explanation-container-word-being-explained'>{mainTextRepresentation}</div>
          <span> - {parsedExplanation}</span>
        </div>
  )
}
