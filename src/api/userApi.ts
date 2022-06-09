import axios from "axios";
import { useState } from "react";
import { UserProfile } from "../model/UserProfile";

export const useUserAPI = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingUserProfile, setIsLoadingUserProfile] =
    useState<boolean>(false);
  const [errorLoadingUserProfile, setErrorLoadingUserProfile] =
    useState<Error>();

  const logIn = (username: string, pwd: string) => {
    setIsLoadingUserProfile(true);
    axios
      .post("/login", { username, pwd })
      .then((response) => {
        const { data } = response;
        setUserProfile(data);
        setErrorLoadingUserProfile(undefined);
      })
      .catch((error) => {
        setUserProfile(null);
        setErrorLoadingUserProfile(error);
      })
      .finally(() => {
        setIsLoadingUserProfile(false);
      });
  };

  const [loggedOut, setLoggedOut] = useState<boolean>();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [errorLoggingOut, setErrorLoggingOut] = useState<Error>();

  const logOut = () => {
    setIsLoggingOut(true);
    axios
      .post("/logout")
      .then((response) => {
        const { data } = response;
        setLoggedOut(data);
        setUserProfile(null);
        setErrorLoggingOut(undefined);
      })
      .catch((error) => {
        setLoggedOut(undefined);
        setErrorLoggingOut(error);
      })
      .finally(() => {
        setIsLoggingOut(false);
      });
  };

  const [termsAccepted, setTermsAccepted] = useState<boolean>();
  const [errorAcceptingTerms, setErrorAcceptingTerms] = useState<Error>();
  const [loadingTermsAccepted, setLoadingTermsAccepted] =
    useState<boolean>(false);

  const acceptTermsAndConditions = () => {
    setLoadingTermsAccepted(true);
    axios
      .post("/accept")
      .then((response) => {
        const { data } = response;
        setTermsAccepted(data);
        setErrorAcceptingTerms(undefined);
      })
      .catch((error) => {
        setTermsAccepted(undefined);
        setErrorAcceptingTerms(error);
      })
      .finally(() => {
        setLoadingTermsAccepted(false);
      });
  };

  return {
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
    loadingTermsAccepted,
  };
};
