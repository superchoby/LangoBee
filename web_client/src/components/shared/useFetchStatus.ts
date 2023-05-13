import { useState, useCallback } from 'react';
import axios from 'axios';
import { keysToCamel } from '../shared/keysToCamel'

export type FetchStatus = 'idle' | 'fetching' | 'success' | 'error';
export type RequestData = {
  type: 'get'
} | {
  type: 'post'
  data: Object
}

export const useFetchStatus = <T>(url: string, onData?: (data: T) => void) => {
  const [status, setStatus] = useState<FetchStatus>('idle');
  const [error, setError] = useState<any>(null);

  const setFetching = () => setStatus('fetching');
  const setSuccess = () => setStatus('success');
  const setFailure = () => setStatus('error');

  const fetchData = useCallback(async (requestData: RequestData) => {
    setFetching();
    try {
      const response = await (requestData.type === 'get' ? axios.get(url) : axios.post(url, requestData.data));
      const camelVersionOfData: T = (() => {
        if (Array.isArray(response.data)) {
          return response.data.map(data => keysToCamel(data))
        } else {
          return Object.entries(response.data).reduce((acc, [key, value]) => (
            {...acc, [key]: keysToCamel(value)} 
          ), {} as any)
        }
      })()
      if (onData != null) {
        onData(camelVersionOfData);
      }
      setSuccess();
    } catch (error) {
      setError(error);
      setFailure();
    }
  }, [url, onData]);

  return {
    status,
    error,
    fetchData,
    isFetching: status === 'fetching',
    isSuccess: status === 'success',
    isError: status === 'error',
    isIdle: status === 'idle',
  };
};
