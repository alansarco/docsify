import { createSelector, createStructuredSelector } from 'reselect';

const selectSignIn = (state) => state.signin;

export const App_infoData = createSelector( selectSignIn, (signin) => signin.app_info );
export const Status = createSelector( selectSignIn, (signin) => signin.status );
export const LoadingStatus = createSelector( selectSignIn, (signin) => signin.isLoading );
export const Message = createSelector( selectSignIn, (signin) => signin.message );

export const selectSignInData = createStructuredSelector({
      app_info: App_infoData,
      isLoading: LoadingStatus,
      status: Status,
      message: Message,
});
    