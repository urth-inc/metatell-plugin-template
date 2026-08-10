import React from "react";

import styles from "./ReactionContainer.module.scss";
import commonStyles from "./common.module.scss";
import { useReactionTutorial } from "./useReactionTutorial";
import { ReactionIcon } from "./icons/ReactionIcon";

type Props = {
  skipTutorial: () => void;
  index: number;
  numberOfSteps: number;
  stepIndex: number;
  run: boolean;
  setStepIndex: React.Dispatch<React.SetStateAction<number>>;
  setShowEffect: React.Dispatch<React.SetStateAction<boolean>>;
  setRun: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ReactionContainer: React.FC<Props> = ({
  skipTutorial,
  stepIndex,
  index,
  numberOfSteps,
  run,
  setRun,
  setStepIndex,
  setShowEffect,
}: Props) => {
  useReactionTutorial({
    run,
    setRun,
    stepIndex,
    index,
    setStepIndex,
    setShowEffect,
  });

  return (
    <div className={commonStyles.tutorialContainer}>
      <div className={styles.reactionIconContainer}>
        <div className={styles.reactionIcon}>
          <ReactionIcon />
        </div>
        <div className={styles.reactionIconText}>React</div>
      </div>
      <div className={commonStyles.messageContainer}>
        リアクションボタンを押してみよう
      </div>
      <div
        className={commonStyles.progressContainer}
      >{`${(stepIndex + 1).toString()}/${numberOfSteps.toString()}`}</div>
      <button onClick={skipTutorial} className={commonStyles.skipButton}>
        スキップ
      </button>
    </div>
  );
};
