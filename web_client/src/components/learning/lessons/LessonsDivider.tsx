import './LessonsDivider.scss'

interface LessonsDividerProps {
    header: string
    subheader: string
    color: number /* 1-5 */
}

export const LessonsDivider = ({
    header,
    subheader,
    color
}: LessonsDividerProps) => {
    // TODO: come up with thingy for color change
    return (
        <div className={`lessons-divider lessons-page-element-color-${color}`}>
            <span className='lessons-divider-header'>{header}</span>
            <span className='lessons-divider-subheader'>{subheader}</span>
        </div>
    )
}
