import { FETCH_SIGNIN, FETCH_SIGNIN_FAIL } from './actionTypes';

export const fetchSignIn = (data) => ({
  type: FETCH_SIGNIN,
  data,
});

export const fetchSignInFail = (error) => ({
  type: FETCH_SIGNIN_FAIL,
  error,
});
