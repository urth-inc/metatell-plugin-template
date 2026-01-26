import React, { useState } from "react";

import { CustomAccessDeniedScreen } from "./components/CustomAccessDeniedScreen";
import styles from "./App.module.css";

export const App: React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loggedInMessage, setLoggedInMessage] = useState("入室権限がありません");
  const [loggedInButtonText, setLoggedInButtonText] = useState("トップページへ戻る");
  const [loggedInButtonUrl, setLoggedInButtonUrl] = useState("https://example.com");
  const [anonymousMessage, setAnonymousMessage] = useState("このルームへの入室は制限されています");
  const [anonymousButtonText, setAnonymousButtonText] = useState("ログインする");
  const [anonymousButtonUrl, setAnonymousButtonUrl] = useState("https://example.com/signin");

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <section className={styles.preview}>
          <h1 className={styles.heading}>CustomAccessDeniedScreen Preview</h1>
          <CustomAccessDeniedScreen
            isSignedIn={isSignedIn}
            accessDeniedMessageForLoggedInUsers={loggedInMessage}
            accessDeniedButtonTextForLoggedInUsers={loggedInButtonText}
            accessDeniedButtonUrlForLoggedInUsers={loggedInButtonUrl}
            accessDeniedMessageForAnonymousUsers={anonymousMessage}
            accessDeniedButtonTextForAnonymousUsers={anonymousButtonText}
            accessDeniedButtonUrlForAnonymousUsers={anonymousButtonUrl}
          onButtonClick={() => {
            const url = isSignedIn ? loggedInButtonUrl : anonymousButtonUrl;
            window.location.href = url;
          }}
          />
        </section>
        <aside className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Debug Inputs</h2>
          </div>
          <div className={styles.panelGrid}>
            <div
              className={`${styles.fieldGroup} ${!isSignedIn ? styles.activeGroup : ""}`}
              role="button"
              tabIndex={0}
              onClick={() => setIsSignedIn(false)}
              onKeyDown={event => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setIsSignedIn(false);
                }
              }}
            >
              <h3 className={styles.groupTitle}>
                Anonymous
                {!isSignedIn && <span className={styles.activeBadge}>Active</span>}
              </h3>
              <label className={styles.field} onClick={event => event.stopPropagation()}>
                Message
                <textarea
                  value={anonymousMessage}
                  onChange={event => setAnonymousMessage(event.target.value)}
                  onClick={event => event.stopPropagation()}
                />
              </label>
              <label className={styles.field} onClick={event => event.stopPropagation()}>
                Button Text
                <input
                  type="text"
                  value={anonymousButtonText}
                  onChange={event => setAnonymousButtonText(event.target.value)}
                  onClick={event => event.stopPropagation()}
                />
              </label>
              <label className={styles.field} onClick={event => event.stopPropagation()}>
                Button URL
                <input
                  type="text"
                  value={anonymousButtonUrl}
                  onChange={event => setAnonymousButtonUrl(event.target.value)}
                  onClick={event => event.stopPropagation()}
                />
              </label>
            </div>
            <div
              className={`${styles.fieldGroup} ${isSignedIn ? styles.activeGroup : ""}`}
              role="button"
              tabIndex={0}
              onClick={() => setIsSignedIn(true)}
              onKeyDown={event => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setIsSignedIn(true);
                }
              }}
            >
              <h3 className={styles.groupTitle}>
                Logged-in
                {isSignedIn && <span className={styles.activeBadge}>Active</span>}
              </h3>
              <label className={styles.field} onClick={event => event.stopPropagation()}>
                Message
                <textarea
                  value={loggedInMessage}
                  onChange={event => setLoggedInMessage(event.target.value)}
                  onClick={event => event.stopPropagation()}
                />
              </label>
              <label className={styles.field} onClick={event => event.stopPropagation()}>
                Button Text
                <input
                  type="text"
                  value={loggedInButtonText}
                  onChange={event => setLoggedInButtonText(event.target.value)}
                  onClick={event => event.stopPropagation()}
                />
              </label>
              <label className={styles.field} onClick={event => event.stopPropagation()}>
                Button URL
                <input
                  type="text"
                  value={loggedInButtonUrl}
                  onChange={event => setLoggedInButtonUrl(event.target.value)}
                  onClick={event => event.stopPropagation()}
                />
              </label>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
