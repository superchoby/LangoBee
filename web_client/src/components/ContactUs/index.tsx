import { useState, useEffect, useRef } from "react"
import { BsFillPersonFill } from "react-icons/bs"
import { AiFillBug } from "react-icons/ai"
import { BsLightbulb } from "react-icons/bs"
import { AiFillQuestionCircle } from "react-icons/ai"
import { useAppSelector } from "src/app/hooks"
import { ClipLoader } from "react-spinners"
import { BsCheckCircle } from 'react-icons/bs'
import { useNavigate } from "react-router-dom"
import { HOME_PATH } from "src/paths"
import axios from 'axios'
import './index.scss'

const ACCOUNT_SUBJECT = 'Account'
const ACCOUNT_BUG_TECHNICAL_ISSUE = 'Bug/Technical Issue'
const ACCOUNT_FEATURE_REQUEST = 'Feature Request'
const ACCOUNT_SOMETHING_ELSE = 'Something Else'

const CONTACT_US_SUBJECTS = [
    {
        name: ACCOUNT_SUBJECT,
        Icon: BsFillPersonFill,
    },
    {
        name: ACCOUNT_BUG_TECHNICAL_ISSUE,
        Icon: AiFillBug,
    },
    {
        name: ACCOUNT_FEATURE_REQUEST,
        Icon: BsLightbulb,
    },
    {
        name: ACCOUNT_SOMETHING_ELSE,
        Icon: AiFillQuestionCircle,
    }
] as const

export const ContactUs = () => {
    const [subject, changeSubject] = useState<'' | typeof ACCOUNT_SUBJECT | typeof ACCOUNT_BUG_TECHNICAL_ISSUE | typeof ACCOUNT_FEATURE_REQUEST | typeof ACCOUNT_SOMETHING_ELSE>('')
    const [usersMessage, changeUsersMessage] = useState('')
    const [messageSendState, changeMessageSendState] = useState<'nothing' | 'success' | 'error' | 'processing'>('nothing');
    const { email } = useAppSelector(state => state.user)
    const formRef = useRef<HTMLFormElement | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (subject !== '' && formRef.current != null) {
            formRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [formRef, subject])

    const submitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        changeMessageSendState('processing');

        axios.post('emails/contact_us/', {email, subject, message: usersMessage, isFromACurrentUser: true})
        .then(res => {
            changeMessageSendState('success');
            changeSubject('')
            changeUsersMessage('')
        })
        .catch(err => {
            changeMessageSendState('error');
        })
    };

    const returnHome = () => {
        navigate(HOME_PATH)
    }

    return (
        <div className='contact-us-page'>
            {messageSendState === 'success' ? (
                <div className='contact-us-page-success-message-container'>
                    <BsCheckCircle />
                    <p>Thanks for contacting us! We will be sure to get back to you shortly.</p>
                    <button className='contact-us-return' onClick={returnHome}>Home</button>
                </div>
            ) : (
                <>
                    <h2 className='contact-us-page-header'>What would you like to contact us about?</h2>
                    <div className='contact-us-subjects-container'>
                        {CONTACT_US_SUBJECTS.map(({name, Icon}) => (
                            <button onClick={() => changeSubject(name)} className={`contact-us-subject-button ${subject === name ? 'selected-subject' : ''}`} key={name}>
                                <Icon />
                                {name}
                            </button>
                        ))}
                    </div>
                    
                    {subject !== '' && (
                        <form className='contact-us-form' ref={formRef} onSubmit={submitMessage}>
                            <h4 className='contact-us-form-header'>
                                So that we can better help you, please provide any relevant details about 
                                &nbsp;{subject !== 'Something Else' ? 'your' : ''} <span className='contact-us-subject'>{subject}</span>
                            </h4>
                            <textarea
                                id="message"
                                name="message"
                                value={usersMessage}
                                onChange={({target: { value }}) => changeUsersMessage(value)}
                                className="contact-us-message-box"
                                rows={4}
                                required={true}
                            />
                            {messageSendState === 'error' && <p className='contact-us-error-message'>Sorry there was an error processing your message, please try again later</p>}
                            <button className='contact-us-submit' type='submit'>{messageSendState === 'processing' ? <ClipLoader color='white' /> : 'Submit'}</button>
                        </form>
                    )}
                </>
            )}
        </div>
    )
}