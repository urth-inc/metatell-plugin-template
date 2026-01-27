import React from "react";

import styles from "./CustomExitScreen.module.css";

export const ExitReason = {
  exited: "exited",
  closed: "closed",
  denied: "denied",
  kicked: "kicked",
  left: "left",
  connectError: "connectError",
  sceneError: "sceneError"
} as const;

export type ExitReasonType = (typeof ExitReason)[keyof typeof ExitReason];

export type ExitScreenAction = "reload" | "home" | "navigate";

export type ExitScreenCopy = {
  title: string;
  message: string;
  buttonLabel: string;
  buttonUrl?: string;
  action: ExitScreenAction;
};

export type ExitScreenCopyByReason = Record<ExitReasonType, ExitScreenCopy>;

export type CustomExitScreenProps = {
  reason: ExitReasonType;
  isSignedIn: boolean;
  copyByReason: ExitScreenCopyByReason;
  onPrimaryAction: () => void;
};

export const CustomExitScreen: React.FC<CustomExitScreenProps> = ({ reason, copyByReason, onPrimaryAction }) => {
  const copy = copyByReason[reason];

  return (
    <section className={styles.container} data-reason={reason}>
      <h2 className={styles.title}>{copy.title}</h2>
      <p className={styles.message}>{copy.message}</p>
      <button className={styles.button} type="button" onClick={onPrimaryAction}>
        {copy.buttonLabel}
      </button>
    </section>
  );
};
