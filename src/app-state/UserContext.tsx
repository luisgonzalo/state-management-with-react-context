import React, { useEffect } from 'react';
import { useUserAPI } from '../api/userApi';
import { UserProfile } from '../model/UserProfile';

export interface UserContext {
  userProfile: UserProfile | null;
  logIn: (username: string, password: string) => void;
  logOut: () => void;
  updateUserProfile: (profile: UserProfile) => void;
  acceptTermsAndConditions: () => void;
}

export const CurrentUserContext = React.createContext<UserContext>({
  userProfile: null,
  logIn: () => {},
  logOut: () => {},
  updateUserProfile: () => {},
  acceptTermsAndConditions: () => {}
});

export const useCurrentUser = () => {
  const context = React.useContext(CurrentUserContext);
  if (!context) {
    throw new Error(`useCurrentUser must be used within a CurrentUserProvider`);
  }
  return context;
};

export const CurrentUserProvider = (props: any) => {
  const [currentUserProfile, setCurrentUserProfile] =
    React.useState<UserProfile | null>(null);

  const {
    logIn,
    userProfile,
    isLoadingUserProfile,
    errorLoadingUserProfile,

    logOut,
    loggedOut,
    isLoggingOut,
    errorLoggingOut,

    acceptTermsAndConditions,
    termsAccepted,
    errorAcceptingTerms,
    loadingTermsAccepted
  } = useUserAPI();

  // 1) this effect loads the response from a successful login api
  //   call and sets the user profile
  useEffect(() => {
    if (
      userProfile &&
      errorLoadingUserProfile === undefined &&
      !isLoadingUserProfile
    ) {
      setCurrentUserProfile(userProfile);
    }
  }, [
    currentUserProfile,
    errorLoadingUserProfile,
    isLoadingUserProfile,
    userProfile
  ]);

  // 2) this effect sets the user profile to null when the api call
  //    to logout is successful
  useEffect(() => {
    if (loggedOut && errorLoggingOut === undefined && !isLoggingOut) {
      setCurrentUserProfile(null);
    }
  }, [loggedOut, errorLoggingOut, isLoggingOut]);

  // 3) this effect updates the user profile when the api call to
  //   accept terms & conditions is successful
  useEffect(() => {
    if (
      currentUserProfile &&
      termsAccepted &&
      errorAcceptingTerms === undefined &&
      !loadingTermsAccepted
    ) {
      setCurrentUserProfile((profile) =>
        profile
          ? {
              ...profile,
              termsAccepted: true
            }
          : null
      );
    }
  }, [
    termsAccepted,
    errorAcceptingTerms,
    loadingTermsAccepted,
    currentUserProfile
  ]);

  const updateUserProfile = (profile: UserProfile) => {
    setCurrentUserProfile({ ...profile });
    // call the API to store the changes...
  };

  const memoValue = React.useMemo<UserContext>(
    () => ({
      userProfile: currentUserProfile,
      logIn,
      logOut,
      updateUserProfile,
      acceptTermsAndConditions
    }),
    [acceptTermsAndConditions, currentUserProfile, logIn, logOut]
  );
  return <CurrentUserContext.Provider value={memoValue} {...props} />;
};
