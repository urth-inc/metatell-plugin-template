import React from "react";

import styles from "./CustomAccessDeniedScreen.module.css";

export type CustomAccessDeniedScreenProps = {
  isSignedIn: boolean;
  accessDeniedMessageForLoggedInUsers: string;
  accessDeniedButtonTextForLoggedInUsers: string;
  accessDeniedButtonUrlForLoggedInUsers: string;
  accessDeniedMessageForAnonymousUsers: string;
  accessDeniedButtonTextForAnonymousUsers: string;
  accessDeniedButtonUrlForAnonymousUsers: string;
  onButtonClick: () => void;
};

export const CustomAccessDeniedScreen: React.FC<CustomAccessDeniedScreenProps> = ({
  isSignedIn,
  accessDeniedMessageForLoggedInUsers,
  accessDeniedButtonTextForLoggedInUsers,
  accessDeniedButtonUrlForLoggedInUsers,
  accessDeniedMessageForAnonymousUsers,
  accessDeniedButtonTextForAnonymousUsers,
  accessDeniedButtonUrlForAnonymousUsers,
  onButtonClick
}) => {
  const message = isSignedIn ? accessDeniedMessageForLoggedInUsers : accessDeniedMessageForAnonymousUsers;
  const buttonText = isSignedIn ? accessDeniedButtonTextForLoggedInUsers : accessDeniedButtonTextForAnonymousUsers;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{message}</h2>
      <p className={styles.message} />
      <button className={styles.button} type="button" onClick={onButtonClick}>
        {buttonText}
      </button>
    </section>
  );
};
