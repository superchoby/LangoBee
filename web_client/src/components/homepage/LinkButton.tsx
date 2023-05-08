import './LinkButton.scss'
import { Link } from "react-router-dom";

interface LinkButtonProps {
  name: string
  image: string
  link: string
  className: string
  numberToDisplay?: number
}

export const LinkButton = ({
  name,
  link,
  image,
  className,
  numberToDisplay
}: LinkButtonProps) => {
  return (
        <Link to={link} className={`link-button-container ${className}`}>
            <img src={image} className='link-button-img' alt={name}/>
            <div className='link-button-text-container'>
                {numberToDisplay != null && (numberToDisplay > 0
                  ? (
                    <span className='link-button-num-to-display'>{numberToDisplay}</span>
                    )
                  : (
                    <span className='link-button-name'>No</span>
                    ))}
                <span className='link-button-name'>{name}</span>
            </div>
        </Link>
  )
}
