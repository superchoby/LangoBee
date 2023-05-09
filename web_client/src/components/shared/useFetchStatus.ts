import { useState, useCallback } from 'react';
import axios from 'axios';

export type FetchStatus = 'idle' | 'fetching' | 'success' | 'error';

export const useFetchStatus = <T>(url: string, onData: (data: T) => void) => {
  const [status, setStatus] = useState<FetchStatus>('idle');
  const [error, setError] = useState<any>(null);

  const setFetching = () => setStatus('fetching');
  const setSuccess = () => setStatus('success');
  const setFailure = () => setStatus('error');

  const fetchData = useCallback(async () => {
    setFetching();
    try {
      const response = await axios.get(url);
      onData(response.data);
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
