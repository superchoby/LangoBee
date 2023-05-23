import { Fragment, useEffect } from 'react';
import './WritingDiagram.scss'
import { PRINT_TYPE, TRYING_TO_PRINT, CAN_PRINT_NOW } from '.';

export interface CharacterStrokeInfo {
  characterStrokeNumbers: { number: number, transform: string }[]
  strokePaths: string[]
}

interface WritingDiagramProps extends CharacterStrokeInfo {
  printStatus: PRINT_TYPE
  changePrintStatusToPrintNow(): void
}

export const WritingDiagram = ({
  characterStrokeNumbers,
  strokePaths,
  printStatus,
  changePrintStatusToPrintNow
}: WritingDiagramProps) => {

  useEffect(() => {
    if (printStatus === TRYING_TO_PRINT) {
      changePrintStatusToPrintNow()
    }
  }, [
    changePrintStatusToPrintNow,
    printStatus
  ])
  
  const gridPath = 'M0,54 L109,54 M54,0 L54,109';
  const gridItems = Array.from({ length: 30 }, (_, i) => (
    <svg 
      key={i} 
      className={`writing-diagram-svg ${[CAN_PRINT_NOW, TRYING_TO_PRINT].includes(printStatus) ? 'writing-diagram-svg-max-size' : ''}`} 
      viewBox="0 0 109 109"
    >
        {i + 1 <= strokePaths.length && (
            <Fragment key={i}>
                <g className='writing-diagram-characters-strokes'>
                    {strokePaths.slice(0, i + 1).map((path, idx) => (
                        <path 
                          key={idx} 
                          d={path} 
                          className={`writing-diagram-characters-stroke-${i === idx ? 'current' : 'previous'}`}
                        />
                    ))}
                </g>
                
                <g className='writing-diagram-stroke-number-indicator'>
                    <text transform={characterStrokeNumbers[i].transform}>{i + 1}</text>
                </g>
            </Fragment>
        )}
        {i < 20 && <path d={gridPath} className='writing-diagram-grid-divider' />}
    </svg>
  ));

  return (
    <div className='writing-diagram-container'>
      {gridItems}
    </div>
  );
};
