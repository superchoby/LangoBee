import { useEffect, useState } from 'react';
import axios from 'axios'
import { useSearchParams } from 'react-router-dom';

export const Checkout = () => { 
  const [searchParams] = useSearchParams();

  // useEffect(() => {
  //   axios.post('subscriptions/successful_checkout/', {session_id: searchParams.get('session_id')})
  //   .then(res => {
      
  //   })
  //   .catch(err => {
  //     console.log(err)
  //   })
  // }, [searchParams])

  return (
    <div>checkout page</div>
  )
  };
