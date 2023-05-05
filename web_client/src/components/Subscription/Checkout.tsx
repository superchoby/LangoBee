import { useEffect, useState } from 'react';
import axios from 'axios'
import { useSearchParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import { CONTACT_US_PATH, SUBSCRIPTION_PATH, HOME_PATH } from 'src/paths';
import './Checkout.scss'

export const Checkout = () => { 
  const [actualCheckoutLinkCheckStatus, changeActualCheckoutLinkCheckStatus] = useState<'valid' | 'invalid' | 'currently checking'>('currently checking')
  const [subscriptionType, changeSubscriptionType] = useState('')
  const [searchParams] = useSearchParams();

  useEffect(() => {
    axios.post('subscriptions/successful_checkout/', {session_id: searchParams.get('session_id')})
    .then(res => {
      changeSubscriptionType(res.data.subscription_type)
      changeActualCheckoutLinkCheckStatus('valid')
    })
    .catch(err => {
      changeActualCheckoutLinkCheckStatus('invalid')
      console.log(err)
    })
  }, [searchParams])

  return (
    <div className='your-purchase-container'> 
      <h1>Your Purchase</h1>
      {actualCheckoutLinkCheckStatus === 'currently checking' ? (
        <div className='collecting-checkout-data'>
          <ClipLoader />
          Collecting Data
        </div>
      ) : (
        <div>
          {
            actualCheckoutLinkCheckStatus === 'valid' ? 
            (
              <div>
                <p>
                  Woohoo 🎉! Thanks for the {subscriptionType} subscription! We are glad to have you have your Japanese journey here with us. 
                  You should receive an email for your receipt soon. If you haven't then feel free to ask for it in our&nbsp; 
                  <Link to={CONTACT_US_PATH}>Contact Page</Link>.
                </p>
                
                <p>
                  You can check information regarding your subscription anytime in our <Link to={SUBSCRIPTION_PATH}>Subscription page</Link>.
                </p>
                
                <p>
                  Now, let's back to some learning!
                </p>

                <Link to={HOME_PATH} className='your-purchase-page-home-button'>Home</Link>
              </div>
            ) : (
              <p className='invalid-checkout-session'>
                This is not a valid checkout session. If this isn't the case, go to our &nbsp;
                <Link to={CONTACT_US_PATH}>contact page</Link> &nbsp;
                or send us an email at contact@langobee.com and
                we will get to you as soon as possible.
              </p>
            )
          }
        </div>
      )}
    </div>
  )
};
