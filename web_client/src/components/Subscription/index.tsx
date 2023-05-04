import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CHECKOUT_PATH } from 'src/paths'
import { keysToCamel } from '../shared/keysToCamel'
import './index.scss'

interface SubscriptionOptionProps {
  name: 'Monthly' | 'Annual' | 'Lifetime'
  cost: string
  description: string
  priceMessage?: string
  priceId: string
}

export const SubscriptionOption = ({
  name,
  cost,
  description,
  priceMessage,
  priceId
}: SubscriptionOptionProps) => {
  let buttonClassName = 'subscription-option-button';
  buttonClassName += name === 'Lifetime' ? ' subscription-option-button-lifetime' : ' subscription-option-button-default';
  
  const navigate = useNavigate()

  const onContinueClick = () => {
    axios.post('subscriptions/create_checkout_session/', {price_id: priceId, subscription_type: name})
    .then(res => {
      window.location.href = res.data.redirect_path
    })
    .catch(err => {
      
    })
  }

  
  return (
    // <div className='subscription-option-container'>
    //   <h4>{name}</h4>
    //   <span>{description}</span>
    //   <span>{cost}</span>
    // </div>
    <div className="subscription-option-container">
      {priceMessage != null && (
        <div className="subscription-option-price-message">{priceMessage}!</div>
      )}
      <div className="subscription-option-name-cost-container">
        <span className="subscription-option-name">{name}</span>
        <span className="subscription-option-cost">${cost}</span>
        <p className='subscription-option-description'>{description}</p>
      </div>
      <button className={buttonClassName} onClick={onContinueClick}>Continue</button>
    </div>
  )
}

// const SUBSCRIPTION_OPTIONS = [
//   {
//     name: 'Lifetime',
//     cost: '119.99',
//     description: 'Unlock your maximum learning potential with our lifetime subscription! Have forever access to everything we have and will offer.',
//     priceMessage: 'Best Value'
//   },
//   {
//     name: 'Annual',
//     cost: '49.99',
//     description: 'For those who are fully committed and ready to make huge progress in a year.',
//     priceMessage: '20% off'
//   },
//   {
//     name: 'Monthly',
//     cost: '4.99',
//     description: 'Enjoy the flexibility of our month-to-month plan! Perfect for those still deciding if they are fully committed.'
//   },  
// ] as const

export const SubscriptionsPage = () => {
  const [subscriptionPrices, changeSubscriptionPrices] = useState<SubscriptionOptionProps[]>([])

  useEffect(() => {
    axios.get('subscriptions/view_prices/')
    .then(res => {
      const subscriptionPricesObj = keysToCamel(JSON.parse(res.data))
      const {
        lifetime,
        monthly,
        annual
      } = subscriptionPricesObj as any
      changeSubscriptionPrices([lifetime, annual, monthly])
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

  return (
        <div>
            <h1>Subscription</h1>
            <div className='subscription-options-container'>
              {subscriptionPrices.map(option => (
                <SubscriptionOption key={option.name} {...option} />
              ))}
            </div>              
        </div>
  )
}
