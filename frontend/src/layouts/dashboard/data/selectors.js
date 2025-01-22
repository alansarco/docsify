import { createSelector, createStructuredSelector } from 'reselect';

const selectDashboard = (state) => state.dashboard;

export const AuthUserData = createSelector( selectDashboard, (dashboard) => dashboard.authUser );
export const loadAuthUser = createSelector( selectDashboard, (dashboard) => dashboard.loadAuthUser );

export const AdminNotifsData = createSelector( selectDashboard, (dashboard) => dashboard.adminnotifs );
export const loadAdminNotifs = createSelector( selectDashboard, (dashboard) => dashboard.loadAdminNotifs);

export const OtherStatsData = createSelector( selectDashboard, (dashboard) => dashboard.otherStats );
export const loadOtherStats = createSelector( selectDashboard, (dashboard) => dashboard.loadOtherStats );

export const ErrorMessage = createSelector( selectDashboard, (dashboard) => dashboard.errormessage );

export const selectDashboardData = createStructuredSelector({
  authUser: AuthUserData,
  loadAuthUser: loadAuthUser,

  adminnotifs: AdminNotifsData,
  loadAdminNotifs: loadAdminNotifs,

  otherStats: OtherStatsData,
  loadOtherStats: loadOtherStats,
  
  errormessage: ErrorMessage,
});
