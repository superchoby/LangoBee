import React from 'react';
import './WritingDiagram.scss'

export interface WritingDiagramProps {
  characterStrokeNumbers: { number: number, transform: string }[]
  strokePaths: string[]
}

export const WritingDiagram = ({
  characterStrokeNumbers,
  strokePaths
}: WritingDiagramProps) => {
  
  const gridPath = 'M0,54 L109,54 M54,0 L54,109';
  const gridItems = Array.from({ length: 30 }, (_, i) => (
    <svg key={i} className='writing-diagram-svg' viewBox="0 0 109 109">
        {i + 1 <= strokePaths.length && (
            <React.Fragment key={i}>
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
            </React.Fragment>
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
