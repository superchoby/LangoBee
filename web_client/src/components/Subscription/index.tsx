import { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { keysToCamel } from '../shared/keysToCamel'
import { useNavigate } from 'react-router-dom'
import { 
  SUBSCRIPTION_TYPE, 
  LIFETIME_SUBSCRIPTION,
  ANNUAL_SUBSCRIPTION,
  MONTHLY_SUBSCRIPTION,
  FETCHED_DATA_SUCCESS,
  FETCHED_DATA_ERROR,
  FETHCED_DATA_PROCESSING,
  FETCH_TYPE,
  FREE_TRIAL,
} from '../shared/values'
import { HOME_PATH } from 'src/paths'
import { WaitingForDataToProcess } from '../shared/WaitingForDataToProcess'
import { ClipLoader } from 'react-spinners'
import Modal from 'react-modal'
import './index.scss'

const SUBSCRIPTION_MESSAGES = {
  [LIFETIME_SUBSCRIPTION]: `
    Thank you so much for purchasing our Lifetime Subscription! You have made the biggest step you 
    can in learning Japanese. Your support helps all of us at LangoBee continue to do all the things
    we can do help you out! All the extra features that come out in the future will be free for you
    forever!
  `,
  [ANNUAL_SUBSCRIPTION]: `
    Thank you so much for purchasing our Annual Subscription! We know that level of 
    committment will get you really far in Japanese with our platform. As we are
    currently in beta mode and prices are
    subject to increase, be sure to renew your plan to our lifetime as soon as you can to
    get the sweetest deals!
  `,
  [MONTHLY_SUBSCRIPTION]: `
    Thank you so much for joining us here at LangoBee! We know that level of 
    committment will get you really far in Japanese with our platform. As we are
    currently in beta mode and prices are
    subject to increase, be sure to renew your plan to our lifetime or even annual plan
    as soon as you can to get the sweetest deals!
  `,
  [FREE_TRIAL]: `
    We hope you are having a good time here during your free trial period! As prices are
    subject to increase as we reach our official release, be sure to get your subscription
    as soon as possible to have the sweetest deals!
  `,
  'none': `
    You currently do not have an active subscription. Be sure to get one of our plans to get
    back on your Japanese journey!
  `
} as const 

interface SubscriptionOptionProps {
  name: 'Monthly' | 'Annual' | 'Lifetime'
  cost: string
  description: string
  priceMessage?: string
  priceId: string
  upgradingSubscription: boolean
  proratedPrice?: string
  changeSubscriptionUserWantsToUpgradeTo(subscriptionToUpgradeTo: SUBSCRIPTION_TYPE | 'none'): void
  changeLoadingCheckoutSession(status: FETCH_TYPE): void
}

export const SubscriptionOption = ({
  name,
  cost,
  description,
  priceMessage,
  priceId,
  upgradingSubscription,
  changeSubscriptionUserWantsToUpgradeTo,
  changeLoadingCheckoutSession,
  proratedPrice
}: SubscriptionOptionProps) => {
  let buttonClassName = 'subscription-option-button';
  buttonClassName += name === 'Lifetime' ? ' subscription-option-button-lifetime' : ' subscription-option-button-default';
  
  const onContinueClick = () => {
    if (upgradingSubscription) {
      if (name === ANNUAL_SUBSCRIPTION) {
        changeSubscriptionUserWantsToUpgradeTo(name)
      } else { // Is annual
        changeLoadingCheckoutSession(FETHCED_DATA_PROCESSING)
        axios.post('subscriptions/upgrade/', { price_id: priceId, new_subscription_plan: name, prorated_lifetime_cost: proratedPrice })
        .then(res => {
          changeLoadingCheckoutSession(FETCHED_DATA_SUCCESS)
          window.location.href = res.data.redirect_path
        })
        .catch(err => {
          changeLoadingCheckoutSession(FETCHED_DATA_ERROR)
        })
      }
    } else {
      changeLoadingCheckoutSession(FETHCED_DATA_PROCESSING)
      axios.post('subscriptions/create_checkout_session/', {price_id: priceId, subscription_type: name})
      .then(res => {
        changeLoadingCheckoutSession(FETCHED_DATA_SUCCESS)
        window.location.href = res.data.redirect_path
      })
      .catch(err => {
        changeLoadingCheckoutSession(FETCHED_DATA_ERROR)
      })
    }
  }

  return (
    <div className="subscription-option-container">
      {priceMessage != null && (
        <div className="subscription-option-price-message">{priceMessage}!</div>
      )}
      <div className="subscription-option-name-cost-container">
        <span className="subscription-option-name">{name}</span>
        <span className="subscription-option-cost">
          {proratedPrice != null ? 
          (<><span className='subscription-pre-prorate-cost'>${cost}</span>&nbsp;&nbsp;${proratedPrice}</>) :

          (cost)}
        </span>
        <p className='subscription-option-description'>{description}</p>
      </div>
      <button className={buttonClassName} onClick={onContinueClick}>{upgradingSubscription ? 'Upgrade' : 'Continue'}</button>
    </div>
  )
}

const subscriptionValueTierOrder = ['none', FREE_TRIAL, MONTHLY_SUBSCRIPTION, ANNUAL_SUBSCRIPTION, LIFETIME_SUBSCRIPTION] as const

export const SubscriptionsPage = () => {
  const [subscriptionPrices, changeSubscriptionPrices] = useState<{
    name: 'Monthly' | 'Annual' | 'Lifetime'
    cost: string
    description: string
    priceMessage?: string
    priceId: string
  }[]>([])
  const [subscriptionType, changeSubscriptionType] = useState<SUBSCRIPTION_TYPE | 'none' | typeof FREE_TRIAL >()
  const [fetchingUserSubscriptionInfo, changeFetchingUserSubscriptionInfo] = useState<FETCH_TYPE>(FETHCED_DATA_PROCESSING)
  const [subscriptionUserWantsToUpgradeTo, changeSubscriptionUserWantsToUpgradeTo] = useState<SUBSCRIPTION_TYPE | 'none'>('none')
  const [prorationInfo, changeProrationInfo] = useState<{[subscriptionType: string]: string}>({})
  const [processingUpgrade, changeProcessingUpgrade] = useState<FETCH_TYPE>()
  const [loadingCheckoutSession, changeLoadingCheckoutSession] = useState<FETCH_TYPE>()

  const navigate = useNavigate()

  useEffect(() => {
    const requests = [
      axios.get('subscriptions/users_info'),
      axios.get('subscriptions/view_prices/')
    ]
    axios.all(requests)
    .then(res => {
      changeFetchingUserSubscriptionInfo(FETCHED_DATA_SUCCESS)
      changeSubscriptionType(res[0].data.subscription_type)

      const subscriptionPricesObj = keysToCamel(JSON.parse(res[1].data))
      const {
        lifetime,
        monthly,
        annual,
        prorationInfo: prorationInfoData
      } = subscriptionPricesObj as any

      changeProrationInfo(prorationInfoData)
      changeSubscriptionPrices([lifetime, annual, monthly])
    })
    .catch(err => {
      changeFetchingUserSubscriptionInfo(FETCHED_DATA_ERROR)
      console.log(err)
    })
  }, [])

  const subscriptionPricesToShow = useMemo(() => {
    if (subscriptionType != null) {
      return subscriptionPrices.filter(({name}) => subscriptionValueTierOrder.indexOf(name) > subscriptionValueTierOrder.indexOf(subscriptionType))
    } else {
      return []
    }
  }, [subscriptionPrices, subscriptionType])

  const upgradeSubscriptionButtonClick = () => {
    if (subscriptionUserWantsToUpgradeTo !== 'none' && processingUpgrade == null) {
      changeProcessingUpgrade(FETHCED_DATA_PROCESSING)
      let priceIdOfSubscription = ''
      for (const { priceId, name } of subscriptionPrices) {
        if (name === subscriptionUserWantsToUpgradeTo) {
          priceIdOfSubscription = priceId
          break
        }
      }

      if (!prorationInfo.hasOwnProperty('Lifetime')) {
        throw new Error('Lifetime price not found')
      }
      axios.post('subscriptions/upgrade/', { price_id: priceIdOfSubscription, new_subscription_plan: subscriptionUserWantsToUpgradeTo, prorated_lifetime_cost: prorationInfo['Lifetime'] })
      .then(res => {
        changeProcessingUpgrade(FETCHED_DATA_SUCCESS)
        if (subscriptionUserWantsToUpgradeTo === LIFETIME_SUBSCRIPTION) {
          window.location.href = res.data.redirect_path
        }
      })
      .catch(err => {
        changeProcessingUpgrade(FETCHED_DATA_ERROR)
      })
    } else if (processingUpgrade !== FETHCED_DATA_PROCESSING) {
      navigate(HOME_PATH)
    }
  }

  return (
        <div className='subscription-page'>
            <h1>Subscription</h1>
            {fetchingUserSubscriptionInfo === FETHCED_DATA_PROCESSING ? (
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <WaitingForDataToProcess />
              </div>
            ) : (
              subscriptionType != null ? (
                <>
                  <div className='subscription-section'>
                    <h3>Your Subscription Plan</h3>
                    <h4>{subscriptionType}</h4>
                    <p>{SUBSCRIPTION_MESSAGES[subscriptionType]}</p>
                  </div>

                  {subscriptionType !== LIFETIME_SUBSCRIPTION && (
                    <div className='subscription-section'>
                      <h3>Upgrade Your Plan</h3>
                      {subscriptionType !== FREE_TRIAL &&  (
                        <p>
                          Important! Since you still have time remaining in your subscription, the credits will carry
                          over into your upgrade so you don't have to pay full price!
                        </p>
                      )}
                      <div className={`subscription-options-container ${subscriptionPricesToShow.length < 3 ? 'subscription-options-subset' : ''}`}>
                        {subscriptionPricesToShow.map(option => (
                          <SubscriptionOption 
                            key={option.name} 
                            upgradingSubscription={[MONTHLY_SUBSCRIPTION, ANNUAL_SUBSCRIPTION].includes(subscriptionType)} 
                            changeSubscriptionUserWantsToUpgradeTo={changeSubscriptionUserWantsToUpgradeTo}
                            proratedPrice={prorationInfo.hasOwnProperty(option.name) ? prorationInfo[option.name] : undefined}
                            changeLoadingCheckoutSession={changeLoadingCheckoutSession}
                            {...option} 
                          />
                        ))}
                      </div>   
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p>Sorry, there was an error collecting the subscription information at this time. Please try again later.</p>
                </>
              )
              
            )}

        <Modal
          ariaHideApp={false}
          className='user-upgrading-subscription-modal'
          isOpen={subscriptionUserWantsToUpgradeTo !== 'none' && prorationInfo.hasOwnProperty(subscriptionUserWantsToUpgradeTo)}
          onRequestClose={(() => changeSubscriptionUserWantsToUpgradeTo('none'))}
          preventScroll={true}
        > 
          <div>
            <h2>Subscription Upgrade Confirmation</h2>
            <p>
              {(() => {
                if (processingUpgrade == null || processingUpgrade === FETHCED_DATA_PROCESSING) {
                  return `Would you like to upgrade to the ${subscriptionUserWantsToUpgradeTo} subscription for ${prorationInfo[subscriptionUserWantsToUpgradeTo]}?`
                } else if (processingUpgrade === FETCHED_DATA_SUCCESS) {
                  return `Thank you for upgrading to the ${subscriptionUserWantsToUpgradeTo} subscription! You have taken another huge step towards mastering Japanese and your support means a lot to us. So now that we got that out of the way, let's go and learn some more Japanese!`
                } else {
                  return `Sorry, there was an error with the upgrade process, please try again later`
                }
              })()}                         
            </p>
            <button onClick={upgradeSubscriptionButtonClick}>
              {(() => {
                if (processingUpgrade === FETHCED_DATA_PROCESSING) {
                  return <ClipLoader size={18} />
                } else if (processingUpgrade == null) {
                  return 'Confirm and Pay'
                } else {
                  return 'Home'
                }
              })()}
            </button>
          </div>
        </Modal>

        <Modal
          ariaHideApp={false}
          className={`user-upgrading-subscription-modal ${processingUpgrade === FETCHED_DATA_SUCCESS ? 'user-upgrading-subscription-modal-increased-height' : ''}`}
          isOpen={loadingCheckoutSession != null}
          onRequestClose={(() => {
            if (loadingCheckoutSession === FETCHED_DATA_ERROR) {
              changeLoadingCheckoutSession(undefined)
            }
          })}
          preventScroll={true}
        > 
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', width: '100%'}}>
            {loadingCheckoutSession === FETHCED_DATA_PROCESSING ? (
              <WaitingForDataToProcess />
            ) : (
              loadingCheckoutSession === FETCHED_DATA_ERROR && <p>Sorry, there was an error processing your checkout at this moment, please try again later.</p>
            )}
          </div>
        </Modal>

        <Modal
          ariaHideApp={false}
          className={`user-upgrading-subscription-modal ${processingUpgrade === FETCHED_DATA_SUCCESS ? 'user-upgrading-subscription-modal-increased-height' : ''}`}
          isOpen={subscriptionUserWantsToUpgradeTo !== 'none' && prorationInfo.hasOwnProperty(subscriptionUserWantsToUpgradeTo)}
          onRequestClose={(() => changeSubscriptionUserWantsToUpgradeTo('none'))}
          preventScroll={true}
        > 
          <div>
            <h2>Subscription Upgrade Confirmation</h2>
            <p>
              {(() => {
                if (processingUpgrade == null || processingUpgrade === FETHCED_DATA_PROCESSING) {
                  return `Would you like to upgrade to the ${subscriptionUserWantsToUpgradeTo} subscription for ${prorationInfo[subscriptionUserWantsToUpgradeTo]}?`
                } else if (processingUpgrade === FETCHED_DATA_SUCCESS) {
                  return `Thank you for upgrading to the ${subscriptionUserWantsToUpgradeTo} subscription! You have taken another huge step towards mastering Japanese and your support means a lot to us. So now that we got that out of the way, let's go and learn some more Japanese!`
                } else {
                  return `Sorry, there was an error with the upgrade process, please try again later`
                }
              })()}                         
            </p>
            <button onClick={upgradeSubscriptionButtonClick}>
              {(() => {
                if (processingUpgrade === FETHCED_DATA_PROCESSING) {
                  return <ClipLoader size={18} />
                } else if (processingUpgrade == null) {
                  return 'Confirm and Pay'
                } else {
                  return 'Home'
                }
              })()}
            </button>
          </div>
        </Modal>
            {/* {subscriptionType ? } */}
            
{/* 
            <div className='subscription-options-container'>
              {subscriptionPrices.map(option => (
                <SubscriptionOption key={option.name} {...option} />
              ))}
            </div>               */}
        </div>
  )
}
