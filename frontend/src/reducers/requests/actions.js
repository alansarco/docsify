import { FETCH_REQUESTS, FETCH_REQUESTS_FAIL } from './actionTypes';

export const fetchRequests = (data) => ({
  type: FETCH_REQUESTS,
  data,
});

export const fetchRequestsFail = (error) => ({
  type: FETCH_REQUESTS_FAIL,
  error,
});
