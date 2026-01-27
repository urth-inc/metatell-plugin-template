import React, { useMemo, useState } from "react";

import { CustomExitScreen, ExitReason } from "./components/CustomExitScreen";
import type { ExitReasonType, ExitScreenCopy, ExitScreenCopyByReason } from "./components/CustomExitScreen";
import styles from "./App.module.css";

export const App: React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [reason, setReason] = useState<ExitReasonType>(ExitReason.denied);

  const [loggedInMessage, setLoggedInMessage] = useState("入室権限がありません");
  const [loggedInButtonText, setLoggedInButtonText] = useState("トップページへ戻る");
  const [loggedInButtonUrl, setLoggedInButtonUrl] = useState("https://example.com");
  const [anonymousMessage, setAnonymousMessage] = useState("このルームへの入室は制限されています");
  const [anonymousButtonText, setAnonymousButtonText] = useState("ログインする");
  const [anonymousButtonUrl, setAnonymousButtonUrl] = useState("https://example.com/signin");

  const copyByReason = useMemo<ExitScreenCopyByReason>(() => {
    const deniedCopy: ExitScreenCopy = isSignedIn
      ? {
          title: loggedInMessage,
          message: "",
          buttonLabel: loggedInButtonText,
          buttonUrl: loggedInButtonUrl,
          action: "navigate"
        }
      : {
          title: anonymousMessage,
          message: "",
          buttonLabel: anonymousButtonText,
          buttonUrl: anonymousButtonUrl,
          action: "navigate"
        };

    return {
      [ExitReason.exited]: {
        title: "退出しました",
        message: "ルームを退出しました。",
        buttonLabel: "再読み込み",
        action: "reload" as const
      },
      [ExitReason.left]: {
        title: "退出しました",
        message: "ルームを退出しました。",
        buttonLabel: "再読み込み",
        action: "reload" as const
      },
      [ExitReason.closed]: {
        title: "ルームはクローズされました",
        message: "管理者がルームをクローズしました。",
        buttonLabel: "ホームへ",
        buttonUrl: "/",
        action: "home" as const
      },
      [ExitReason.denied]: deniedCopy,
      [ExitReason.kicked]: {
        title: "ルームから退出させられました",
        message: "管理者によって退出させられました。",
        buttonLabel: "ホームへ",
        buttonUrl: "/",
        action: "home" as const
      },
      [ExitReason.connectError]: {
        title: "接続エラー",
        message: "接続に失敗しました。",
        buttonLabel: "再試行",
        action: "reload" as const
      },
      [ExitReason.sceneError]: {
        title: "シーンエラー",
        message: "シーンの読み込みに失敗しました。",
        buttonLabel: "再読み込み",
        action: "reload" as const
      }
    };
  }, [
    anonymousButtonText,
    anonymousButtonUrl,
    anonymousMessage,
    isSignedIn,
    loggedInButtonText,
    loggedInButtonUrl,
    loggedInMessage
  ]);

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <section className={styles.preview}>
          <h1 className={styles.heading}>CustomExitScreen Preview</h1>
          <CustomExitScreen
            reason={reason}
            isSignedIn={isSignedIn}
            copyByReason={copyByReason}
            onPrimaryAction={() => {
              const copy = copyByReason[reason];
              if (copy.buttonUrl) {
                window.location.href = copy.buttonUrl;
                return;
              }
              window.location.reload();
            }}
          />
        </section>
        <aside className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Debug Inputs</h2>
          </div>
          <div className={styles.panelGrid}>
            <label className={styles.field}>
              Reason
              <select value={reason} onChange={event => setReason(event.target.value as ExitReasonType)}>
                {Object.values(ExitReason).map(reasonValue => (
                  <option key={reasonValue} value={reasonValue}>
                    {reasonValue}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              Signed In
              <input type="checkbox" checked={isSignedIn} onChange={event => setIsSignedIn(event.target.checked)} />
            </label>
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>Denied (Signed-in)</h3>
              <label className={styles.field}>
                Message
                <textarea value={loggedInMessage} onChange={event => setLoggedInMessage(event.target.value)} />
              </label>
              <label className={styles.field}>
                Button Text
                <input type="text" value={loggedInButtonText} onChange={event => setLoggedInButtonText(event.target.value)} />
              </label>
              <label className={styles.field}>
                Button URL
                <input type="text" value={loggedInButtonUrl} onChange={event => setLoggedInButtonUrl(event.target.value)} />
              </label>
            </div>
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>Denied (Anonymous)</h3>
              <label className={styles.field}>
                Message
                <textarea value={anonymousMessage} onChange={event => setAnonymousMessage(event.target.value)} />
              </label>
              <label className={styles.field}>
                Button Text
                <input type="text" value={anonymousButtonText} onChange={event => setAnonymousButtonText(event.target.value)} />
              </label>
              <label className={styles.field}>
                Button URL
                <input type="text" value={anonymousButtonUrl} onChange={event => setAnonymousButtonUrl(event.target.value)} />
              </label>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
