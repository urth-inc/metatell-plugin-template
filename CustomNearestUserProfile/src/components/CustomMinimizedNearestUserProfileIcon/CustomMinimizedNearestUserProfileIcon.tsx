import React from "react";
import classNames from "classnames";

import { SpeakerIcon } from "./SpeakerIcon";

import styles from "./CustomMinimizedNearestUserProfileIcon.module.scss";

type Props = {
  onClick: () => void;
  showSpeakerIcon: boolean;
};

export const CustomMinimizedNearestUserProfileIcon: React.FC<Props> = ({
  onClick,
  showSpeakerIcon,
}) => {
  return (
    <button
      className={classNames(
        styles.menuButtonContainer,
        !showSpeakerIcon && styles.hidden,
      )}
      onClick={onClick}
    >
      <SpeakerIcon />
    </button>
  );
};
